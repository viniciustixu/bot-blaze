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
  try {
    return JSON.parse(
      fs.readFileSync(
        getConfigPath(),
        'utf8'
      )
    );
  } catch {
    const padrao = {
      url: 'https://blaze.stream/nami88',
      delayEntreTeclas: 1003,
      submode: false,
      modo: 'sequencial'
    };

    fs.writeFileSync(
      getConfigPath(),
      JSON.stringify(padrao, null, 2)
    );

    return padrao;
  }
}

module.exports = {
  carregarConfig
};
