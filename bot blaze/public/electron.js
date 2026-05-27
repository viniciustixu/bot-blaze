const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('path');
const { startChatReader } = require('../chatreader');
const { executarFila } = require('../execute');

let botIniciado = false;

const createWindow = () => {

  const win = new BrowserWindow({

    width: 800,
    height: 600,

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

  createWindow();

  ipcMain.on(
    'iniciar-bot',
    async () => {

      if (botIniciado)
        return;

      botIniciado = true;

      console.log(
        'Iniciando bot...'
      );

      startChatReader();

      executarFila();
    }
  );

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