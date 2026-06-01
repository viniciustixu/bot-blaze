const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function getConfigPath() {
  return path.join(
    app.getPath('userData'),
    'config.json'
  );
}

function carregarConfig() {
  return JSON.parse(
    fs.readFileSync(
      getConfigPath(),
      'utf8'
    )
  );
}

module.exports = {
  carregarConfig
};
