const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electronAPI',
  {
    iniciarBot: () => {
      ipcRenderer.send('iniciar-bot');
    }
  }
);