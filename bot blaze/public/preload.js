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

    botFila: () => {
      return ipcRenderer.invoke('bot-fila');
    },
    fecharApp: () => {
      ipcRenderer.invoke('fechar-app');
    },
    getCommands: () => {
      return ipcRenderer.invoke('get-commands');
    },
    deleteCommand: (comando) => {
      return ipcRenderer.invoke(
        'delete-command',
        comando
      );
    },
    updateCommand: (oldKey, data) => {
      return ipcRenderer.invoke(
        'update-command',
        oldKey,
        data
      );
    },
    createCommand: (data) => {
      return ipcRenderer.invoke('create-command', data);
    },
    getConfig: () => {
      return ipcRenderer.invoke(
        'get-config'
      );
    },
    saveConfig: (config) => {
      return ipcRenderer.invoke(
        'save-config',
        config
      );
    },
    minimizarApp: () => {
      ipcRenderer.invoke('minimizar-app');
    },
    botExecutando: () => {
      return ipcRenderer.invoke('bot-executando');
    },
    appVersion: () => {
      return ipcRenderer.invoke('app-version');
    }
  }
);
