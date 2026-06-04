const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('path');
const { start, stop, getStatus, emAquecimento, getFila, getComandoExecutando } = require('../execute');
const fs = require('fs');
const comandosPadrao = require('../commands.json');

const log = require('electron-log');
const configPadrao = {
  url: 'https://blaze.stream/nami88',
  delayEntreTeclas: 1003,
  submode: false,
  modo: 'sequencial'
};



let splash = null;
let mainWindow = null;


log.info('Updater iniciado');
log.error('Erro no updater');
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

ipcMain.handle('bot-aquecendo', () => {
  return emAquecimento();
});

ipcMain.handle('bot-fila', () => {
  return getFila();
});

ipcMain.handle('fechar-app', () => {
  app.quit();
});

ipcMain.handle('get-commands', () => {

  const caminhoComandos =
    garantirArquivoComandos();

  return JSON.parse(
    fs.readFileSync(
      caminhoComandos,
      'utf8'
    )
  );
});

ipcMain.handle(
  'delete-command',
  (event, comando) => {

    const caminho =
      garantirArquivoComandos();

    const comandos = JSON.parse(
      fs.readFileSync(caminho, 'utf8')
    );

    delete comandos[comando];

    fs.writeFileSync(
      caminho,
      JSON.stringify(comandos, null, 2)
    );

    return true;
  }
);

ipcMain.handle('update-command', (event, oldKey, data) => {
  const caminho = garantirArquivoComandos();

  const comandos = JSON.parse(
    fs.readFileSync(caminho, 'utf8')
  );

  if (oldKey !== data.comando) {
    delete comandos[oldKey];
  }

  comandos[data.comando] = {
    tecla: data.tecla,
    delay: data.delay
  };

  fs.writeFileSync(caminho, JSON.stringify(comandos, null, 2));

  return true;
});

ipcMain.handle('create-command', (event, data) => {
  const caminho = garantirArquivoComandos();

  const comandos = JSON.parse(
    fs.readFileSync(caminho, 'utf8')
  );

  const { comando, tecla, delay } = data;

  if (!comando || !tecla || !delay) {
    return { erro: 'Preencha todos os campos' };
  }

  if (comandos[comando]) {
    return { erro: 'Esse comando já existe' };
  }

  comandos[comando] = {
    tecla,
    delay
  };

  fs.writeFileSync(
    caminho,
    JSON.stringify(comandos, null, 2)
  );

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
    fs.writeFileSync(
      caminhoComandos,
      JSON.stringify(comandosPadrao, null, 2)
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

    autoUpdater.on('checking-for-update', () => {
      log.info('Verificando atualização...');
    });

    setTimeout(() => {
      log.warn('Timeout updater');
      done();
    }, 8000);

    autoUpdater.on('update-available', (info) => {
      log.info('Update disponível:', info.version);
    });

    autoUpdater.on('update-not-available', () => {
      log.info('Nenhuma atualização');
      done();
    });

    autoUpdater.on('error', (err) => {
      log.error('Erro updater:', err);
      done();
    });

    autoUpdater.on('update-downloaded', () => {
      log.info('Update baixado');
      done();
      autoUpdater.quitAndInstall();
    });

    autoUpdater.autoDownload = true;

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