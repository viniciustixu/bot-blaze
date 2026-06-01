const { processarFila } = require('./queue');
const { keyboard, Key } = require('@nut-tree-fork/nut-js');
const { mensagens, startChatReader, stopChatReader, emAquecimento } = require('./chatreader');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { loadCommands } = require('./commandsStore');



let delayEntreComandos = 300;
let status = 'off';



async function start() {
  if (status !== 'off')
    return;

  status = 'starting';

  mensagens.length = 0;

  try {
    await startChatReader();

    status = 'running';

    executarFila();

    console.log('Bot ON');

  } catch (e) {
    status = 'off';

    return {
      erro: e.message
    };
  }
}

async function stop() {

  status = 'off';

  mensagens.length = 0;

  await stopChatReader();

  console.log('Bot OFF');
}

function getStatus() {
  return status;
}

function getFila() {
  return mensagens;
}

function getComandosPath() {
  return path.join(app.getPath('userData'), 'commands.json');
}

function carregarComandos() {
  const file = getComandosPath();

  if (!fs.existsSync(file)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(file, 'utf8'));
}


async function executarFila() {


  while (status === 'running') {

    if (mensagens.length === 0) {

      await delay(100);
      continue;
    }

    const item = processarFila();


    if (!item)
      continue;


    const comandos = loadCommands();

    const comando =
      comandos[item.mensagem.toLowerCase()];

    if (!comando)
      continue;

    const tecla =
      Key[comando.tecla];

    if (!tecla) {
      console.log(`Tecla inválida: ${comando.tecla}`);

      const index = mensagens.findIndex(
        msg => msg.uuid === item.uuid
      );

      if (index !== -1) {
        mensagens.splice(index, 1);
      }

      continue;
    }

    console.log(
      `[EXECUTANDO] ${item.usuario} -> ${item.mensagem}`
    );
    keyboard.config.autoDelayMs = 50;

    await keyboard.pressKey(tecla);
    await delay(comando.delay);
    await keyboard.releaseKey(tecla);


    console.log(keyboard.config.autoDelayMs);



    const index = mensagens.findIndex(
      msg => msg.uuid === item.uuid
    );

    if (index !== -1) {
      mensagens.splice(index, 1);
    }

    await delay(delayEntreComandos);

    console.log("mensagens: ", mensagens.length);
  }
}

function delay(ms) {

  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  start,
  stop,
  emAquecimento,
  getStatus,
  getFila,
  delayEntreComandos
};