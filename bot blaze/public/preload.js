const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electronAPI',
  {
    iniciarPausarBot: () => {
      return ipcRenderer.invoke('bot-toggle');
    },

    botRodando: () => {
      return ipcRenderer.invoke('bot-status');
    },

    botAquecendo: () => {
      return ipcRenderer.invoke('bot-aquecendo');
    }
  }
);
