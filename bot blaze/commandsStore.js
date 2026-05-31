const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function getCommandsPath() {
  return path.join(app.getPath('userData'), 'commands.json');
}

function loadCommands() {
  const file = getCommandsPath();

  if (!fs.existsSync(file)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

module.exports = {
  getCommandsPath,
  loadCommands
};