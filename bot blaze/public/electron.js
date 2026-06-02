const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('path');
const { start, stop, isRunning, getStatus, emAquecimento, getFila } = require('../execute');
const fs = require('fs');
const comandosPadrao = require('../commands.json');
const configPadrao = {
  url: 'https://blaze.stream/nami88',
  delayEntreTeclas: 1003,
  submode: false,
  modo: 'sequencial'
};



const createWindow = () => {

  const win = new BrowserWindow({

    width: 1200,
    height: 600,
    icon: path.join(__dirname, '../public/kirbyico.ico'),

    autoHideMenuBar: true, // <-
    resizable: false, // <-

    frame: false, // <-

    webPreferences: {
      preload: path.join(
        __dirname,
        'preload.js'
      ),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const isDev =
    !app.isPackaged;

  if (isDev) {

    win.loadURL(
      'http://localhost:5173'
    );

  } else {

    win.loadFile(
      path.join(
        __dirname,
        '../dist/index.html'
      )
    );
  }
};

app.whenReady().then(() => {

  garantirArquivoComandos();
  garantirArquivoConfig();

  createWindow();


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

    // valida duplicado
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


  app.on('activate', () => {

    if (
      BrowserWindow.getAllWindows()
        .length === 0
    ) {

      createWindow();
    }
  });
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