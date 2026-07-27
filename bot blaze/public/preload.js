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
    botCmdCount: () => {
      return ipcRenderer.invoke('bot-cmd-count');
    },
    appVersion: () => {
      return ipcRenderer.invoke('app-version');
    },
    getPresets: () => {
      return ipcRenderer.invoke('get-presets');
    },
    createPreset: (name) => {
      return ipcRenderer.invoke('create-preset', name);
    },
    deletePreset: (name) => {
      return ipcRenderer.invoke('delete-preset', name);
    },
    switchPreset: (name) => {
      return ipcRenderer.invoke('switch-preset', name);
    },
    getChatCommands: () => {
      return ipcRenderer.invoke('get-chat-commands');
    },
    createChatCommand: (data) => {
      return ipcRenderer.invoke('create-chat-command', data);
    },
    deleteChatCommand: (key) => {
      return ipcRenderer.invoke('delete-chat-command', key);
    },
    updateChatCommand: (oldKey, data) => {
      return ipcRenderer.invoke('update-chat-command', oldKey, data);
    },
    getSorteioConfig: () => {
      return ipcRenderer.invoke('get-sorteio-config');
    },
    saveSorteioConfig: (config) => {
      return ipcRenderer.invoke('save-sorteio-config', config);
    }
  }
);
