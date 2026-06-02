const { processarFila } = require('./queue');
const { keyboard, Key } = require('@nut-tree-fork/nut-js');
const { mensagens, startChatReader, stopChatReader, emAquecimento } = require('./chatreader');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { loadCommands } = require('./commandsStore');
const { carregarConfig } = require('./config');


let status = 'off';
let comandoExecutando = null;



async function start() {
  console.log('executar');
  if (status !== 'off')
    return;

  status = 'starting';

  mensagens.length = 0;

  try {
    await startChatReader();

    status = 'running';

    executarFila().catch(err => {
      console.error('Erro na fila:', err);
    });

    let config2 = carregarConfig();
    console.log('Bot ON', config2);

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


async function executarFila() {


  while (status === 'running') {
    const config = carregarConfig();

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
    comandoExecutando = item;

    console.log(
      `[EXECUTANDO] ${item.usuario} -> ${item.mensagem}`
    );
    keyboard.config.autoDelayMs = 50;

    await keyboard.pressKey(tecla);
    await delay(comando.delay);
    await keyboard.releaseKey(tecla);
    await delay(config.delayEntreTeclas);



    comandoExecutando = null;

    const index = mensagens.findIndex(
      msg => msg.uuid === item.uuid
    );

    if (index !== -1) {
      mensagens.splice(index, 1);
    }

    console.log("mensagens: ", mensagens.length);
  }
}

function delay(ms) {

  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function getComandoExecutando() {
  return comandoExecutando;
}

module.exports = {
  start,
  stop,
  emAquecimento,
  getStatus,
  getFila,
  getComandoExecutando
};