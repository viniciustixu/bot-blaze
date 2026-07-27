const path = require('path');
const fs = require('fs');

const participantes = {};

function getCaminho() {
  const electron = require('electron');
  const pasta = electron.app.getPath('userData');
  return path.join(pasta, 'sorteio.json');
}

function garantirArquivoSorteio() {
  const caminho = getCaminho();
  if (!fs.existsSync(caminho)) {
    const padrao = {
      comando: '!sorteio',
      intervalo: 15,
      pontos: 10,
      multiplicadorSub: 2,
      mensagem: 'Parabéns ${user}, voce ganhou o sorteio!!! 😱',
    };
    fs.writeFileSync(caminho, JSON.stringify(padrao, null, 2));
  }
  return caminho;
}

function carregarSorteioConfig() {
  const caminho = garantirArquivoSorteio();
  return JSON.parse(fs.readFileSync(caminho, 'utf8'));
}

function salvarSorteioConfig(config) {
  const caminho = garantirArquivoSorteio();
  fs.writeFileSync(caminho, JSON.stringify(config, null, 2));
}

function registrarInteracao(username, isSub) {
  const config = carregarSorteioConfig();
  const agora = Date.now();
  const intervaloMs = config.intervalo * 60 * 1000;
  const user = username.toLowerCase();

  if (participantes[user]) {
    if (agora - participantes[user].ultimoInteracao < intervaloMs) {
      return;
    }
    const pontosGanhos = isSub ? config.pontos * config.multiplicadorSub : config.pontos;
    participantes[user].pontos += pontosGanhos;
    participantes[user].ultimoInteracao = agora;
  } else {
    const pontosGanhos = isSub ? config.pontos * config.multiplicadorSub : config.pontos;
    participantes[user] = { pontos: pontosGanhos, ultimoInteracao: agora };
  }
}

function sortear() {
  const usernames = Object.keys(participantes);
  if (usernames.length === 0) return null;

  const total = usernames.reduce((soma, u) => soma + participantes[u].pontos, 0);
  let rand = Math.random() * total;

  for (const user of usernames) {
    rand -= participantes[user].pontos;
    if (rand <= 0) return user;
  }

  return usernames[usernames.length - 1];
}

function resetarPontos() {
  for (const key of Object.keys(participantes)) {
    delete participantes[key];
  }
}

function getParticipantes() {
  return { ...participantes };
}

module.exports = {
  garantirArquivoSorteio,
  carregarSorteioConfig,
  salvarSorteioConfig,
  registrarInteracao,
  sortear,
  resetarPontos,
  getParticipantes,
};
