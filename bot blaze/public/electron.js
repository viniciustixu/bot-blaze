const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('path');
const { start, stop, getStatus, getFila, getComandoExecutando } = require('../execute');
const fs = require('fs');
const comandosStore = require('../commandsStore');

const log = require('electron-log');
const configPadrao = {
  url: 'https://blaze.stream/nami88',
  delayEntreTeclas: 1003,
  submode: false,
  modo: 'sequencial'
};



let splash = null;
let mainWindow = null;


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    icon: path.join(__dirname, '../public/kirbyico.ico'),
    autoHideMenuBar: true,
    resizable: false,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(async () => {
  garantirArquivoComandos();
  garantirArquivoConfig();

  createSplash();

  await verificarAtualizacoes();

  createWindow();

  mainWindow.once('ready-to-show', () => {
    if (splash && !splash.isDestroyed()) {
      splash.close();
      splash = null;
    }

    mainWindow.show();
  });
});

ipcMain.handle('bot-toggle', async () => {
  const status = getStatus();

  if (status === 'running') {
    await stop();
    return;
  }

  if (status === 'off') {
    return await start();
  }
});

ipcMain.handle('bot-status', () => {
  return getStatus();
});

ipcMain.handle('bot-fila', () => {
  return getFila();
});

ipcMain.handle('fechar-app', () => {
  app.quit();
});

ipcMain.handle('get-commands', () => {
  garantirArquivoComandos();
  return comandosStore.loadCommands();
});

ipcMain.handle(
  'delete-command',
  (event, comando) => {
    garantirArquivoComandos();
    const active = comandosStore.loadCommands();
    delete active[comando];
    comandosStore.saveProfile(comandosStore.getActiveProfile(), active);
    return true;
  }
);

ipcMain.handle('update-command', (event, oldKey, data) => {
  garantirArquivoComandos();
  const full = comandosStore.loadFullStructure();
  const profileName = full.activeProfile;
  const active = full.profiles[profileName];

  const reordered = {};
  for (const key of Object.keys(active)) {
    if (key === oldKey) {
      reordered[data.comando] = { tecla: data.tecla, delay: data.delay };
    } else {
      reordered[key] = active[key];
    }
  }

  comandosStore.saveProfile(profileName, reordered);
  return true;
});

ipcMain.handle('create-command', (event, data) => {
  garantirArquivoComandos();
  const active = comandosStore.loadCommands();
  const { comando, tecla, delay } = data;

  if (!comando || !tecla || !delay) {
    return { erro: 'Preencha todos os campos' };
  }

  if (active[comando]) {
    return { erro: 'Esse comando já existe' };
  }

  active[comando] = { tecla, delay };
  comandosStore.saveProfile(comandosStore.getActiveProfile(), active);

  return { ok: true };
});

ipcMain.handle('get-config', () => {

  const caminho =
    garantirArquivoConfig();

  return JSON.parse(
    fs.readFileSync(
      caminho,
      'utf8'
    )
  );
});

ipcMain.handle(
  'save-config',
  (event, config) => {

    const caminho =
      garantirArquivoConfig();

    fs.writeFileSync(
      caminho,
      JSON.stringify(
        config,
        null,
        2
      )
    );

    return true;
  }
);

ipcMain.handle('minimizar-app', () => {
  const win = BrowserWindow.getFocusedWindow();

  if (win) {
    win.minimize();
  }
});

ipcMain.handle('bot-executando', () => {
  return getComandoExecutando();
});

ipcMain.handle('app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-presets', () => {
  garantirArquivoComandos();
  return {
    profiles: comandosStore.getProfiles(),
    active: comandosStore.getActiveProfile()
  };
});

ipcMain.handle('create-preset', (event, name) => {
  garantirArquivoComandos();
  const profiles = comandosStore.getProfiles();

  if (profiles.length >= 9)
    return { erro: 'Máximo de 9 perfis atingido' };

  if (profiles.includes(name))
    return { erro: 'Já existe um perfil com esse nome' };

  if (!name || !name.trim())
    return { erro: 'Nome inválido' };

  const defaults = {
    "!up": { tecla: "Up", delay: 1000 },
    "!down": { tecla: "Down", delay: 1000 },
    "!left": { tecla: "Left", delay: 1000 },
    "!right": { tecla: "Right", delay: 1000 }
  };
  comandosStore.saveProfile(name.trim(), defaults);
  comandosStore.switchProfile(name.trim());
  return { ok: true };
});

ipcMain.handle('delete-preset', (event, name) => {
  garantirArquivoComandos();
  const profiles = comandosStore.getProfiles();

  if (profiles.length <= 1)
    return { erro: 'Não é possível deletar o único perfil' };

  if (!profiles.includes(name))
    return { erro: 'Perfil não encontrado' };

  comandosStore.deleteProfile(name);
  return { ok: true };
});

ipcMain.handle('switch-preset', (event, name) => {
  garantirArquivoComandos();
  const profiles = comandosStore.getProfiles();

  if (!profiles.includes(name))
    return { erro: 'Perfil não encontrado' };

  comandosStore.switchProfile(name);
  return { ok: true };
});

// =====================



app.on('activate', () => {

  if (
    BrowserWindow.getAllWindows()
      .length === 0
  ) {

    createWindow();
  }
});


app.on(
  'window-all-closed',
  () => {

    if (
      process.platform !== 'darwin'
    ) {

      app.quit();
    }
  }
);

function garantirArquivoComandos() {
  const pastaUsuario = app.getPath('userData');

  const caminhoComandos = path.join(
    pastaUsuario,
    'commands.json'
  );

  if (!fs.existsSync(caminhoComandos)) {
    const padrao = {
      activeProfile: 'default',
      profiles: {
        default: {
          "!up": { "tecla": "Up", "delay": 1000 },
          "!down": { "tecla": "Down", "delay": 1000 },
          "!left": { "tecla": "Left", "delay": 1000 },
          "!right": { "tecla": "Right", "delay": 1000 }
        }
      }
    };

    fs.writeFileSync(
      caminhoComandos,
      JSON.stringify(padrao, null, 2)
    );

    console.log(
      'commands.json criado em:',
      caminhoComandos
    );
  }

  return caminhoComandos;
}

function garantirArquivoConfig() {
  const pastaUsuario = app.getPath('userData');

  const caminhoConfig = path.join(
    pastaUsuario,
    'config.json'
  );

  if (!fs.existsSync(caminhoConfig)) {
    fs.writeFileSync(
      caminhoConfig,
      JSON.stringify(configPadrao, null, 2)
    );

    console.log(
      'config.json criado em:',
      caminhoConfig
    );
  }

  return caminhoConfig;
}

async function verificarAtualizacoes() {
  if (!app.isPackaged) return;

  return new Promise((resolve) => {
    let finished = false;

    const done = () => {
      if (finished) return;
      finished = true;
      resolve();
    };

    const timeout = setTimeout(() => {
      log.warn('Timeout updater');
      done();
    }, 60000);

    autoUpdater.on('update-not-available', () => {
      clearTimeout(timeout);
      log.info('Nenhuma atualização');
      done();
    });

    autoUpdater.on('error', (err) => {
      clearTimeout(timeout);
      log.error('Erro updater:', err);
      done();
    });

    autoUpdater.on('update-downloaded', () => {
      clearTimeout(timeout);
      log.info('Update baixado — instalando...');
      autoUpdater.quitAndInstall();
    });

    autoUpdater.checkForUpdates();
  });
}

function createSplash() {
  splash = new BrowserWindow({
    width: 400,
    height: 250,
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: true
    }
  });

  splash.loadFile(path.join(__dirname, '../public/splash.html'));
}