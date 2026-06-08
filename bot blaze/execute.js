const { processarFila } = require('./queue');
const { keyboard, mouse, Button, Key } = require('@nut-tree-fork/nut-js');
const { mensagens, startChatReader, stopChatReader, emAquecimento } = require('./chatreader');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { loadCommands } = require('./commandsStore');
const { carregarConfig } = require('./config');


let status = 'off';
let comandoExecutando = null;
const mouseMap = {
  'mouse.click(Button.LEFT)': Button.LEFT,
  'mouse.click(Button.RIGHT)': Button.RIGHT,
  'mouse.click(Button.MIDDLE)': Button.MIDDLE,
};



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
      status = 'off';
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

    if (!comando) {
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

    if (comando.tecla in mouseMap) {

      await mouse.click(
        mouseMap[comando.tecla]
      );

    } else {

      const tecla =
        Key[comando.tecla];

      if (!tecla) {
        console.log(
          `Tecla inválida: ${comando.tecla}`
        );

        const index = mensagens.findIndex(
          msg => msg.uuid === item.uuid
        );

        if (index !== -1) {
          mensagens.splice(index, 1);
        }

        continue;
      }

      await keyboard.pressKey(tecla);
      await delay(comando.delay);
      await keyboard.releaseKey(tecla);
    }
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