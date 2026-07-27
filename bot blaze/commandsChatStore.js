const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function getCommandsChatPath() {
  return path.join(app.getPath('userData'), 'commandschat.json');
}

function getDefaults() {
  const fallbackPath = path.join(__dirname, 'commandschat.json');
  try {
    return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
  } catch {
    return {};
  }
}

function loadChatCommands() {
  const file = getCommandsChatPath();

  if (!fs.existsSync(file)) {
    const defaults = getDefaults();
    fs.writeFileSync(file, JSON.stringify(defaults, null, 2));
    return defaults;
  }

  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function saveChatCommands(commands) {
  fs.writeFileSync(getCommandsChatPath(), JSON.stringify(commands, null, 2));
}

function createChatCommand(key, resposta) {
  const cmds = loadChatCommands();
  if (cmds[key]) return { erro: 'Esse comando ja existe' };
  cmds[key] = { type: 'reply', resposta };
  saveChatCommands(cmds);
  return { ok: true };
}

function deleteChatCommand(key) {
  const cmds = loadChatCommands();
  delete cmds[key];
  saveChatCommands(cmds);
}

function updateChatCommand(oldKey, key, resposta) {
  const cmds = loadChatCommands();
  if (oldKey !== key) delete cmds[oldKey];
  cmds[key] = { type: 'reply', resposta };
  saveChatCommands(cmds);
}

module.exports = {
  loadChatCommands,
  saveChatCommands,
  createChatCommand,
  deleteChatCommand,
  updateChatCommand
};
