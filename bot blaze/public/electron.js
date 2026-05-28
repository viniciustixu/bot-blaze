const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('path');
const { start, stop, isRunning, getStatus, emAquecimento } = require('../execute');



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


  ipcMain.handle('bot-toggle', async () => {

    const status = getStatus();

    if (status === 'running') {

      await stop();

      console.log('Bot OFF');

      return;
    }

    if (status === 'off') {

      await start();

      console.log('Bot ON');
    }
  });

  ipcMain.handle('bot-status', () => {
    return getStatus();
  });

  ipcMain.handle('bot-aquecendo', () => {
    return emAquecimento();
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