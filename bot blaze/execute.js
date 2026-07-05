const { processarFila } = require('./queue');
const { keyboard, mouse, Button, Key } = require('@nut-tree-fork/nut-js');
const { mensagens, startChatReader, stopChatReader, getTotalChatMessages, getUniqueUsers, setCounting } = require('./chatreader');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { loadCommands } = require('./commandsStore');
const { carregarConfig } = require('./config');
const { writeLogFile } = require('./logger');


let status = 'off';
let comandoExecutando = null;
let startTime = null;
let cmdExecutedCount = 0;
const mouseMap = {
  'mouse.click(Button.LEFT)': Button.LEFT,
  'mouse.click(Button.RIGHT)': Button.RIGHT,
  'mouse.click(Button.MIDDLE)': Button.MIDDLE,
};



async function start() {
  console.log('executar()');
  if (status !== 'off')
    return;

  status = 'starting';

  mensagens.length = 0;
  comandoExecutando = null;
  cmdExecutedCount = 0;

  try {
    await startChatReader();

    setCounting(true);
    startTime = Date.now();
    status = 'running';

    executarFila().catch(err => {
      console.error('Erro na fila:', err);
      status = 'off';
    });

    let config2 = carregarConfig();
    console.log('BOT ON');

  } catch (e) {
    status = 'off';

    return {
      erro: e.message
    };
  }
}

async function stop() {

  status = 'off';

  if (startTime) {
    const stats = {
      cmdExecuted: cmdExecutedCount,
      totalMessages: getTotalChatMessages(),
      uniqueUsers: new Set(getUniqueUsers())
    };
    await writeLogFile(startTime, stats);
    startTime = null;
  }

  setCounting(false);
  mensagens.length = 0;

  await stopChatReader();

  console.log('BOT OFF');
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
      `[EXECUTANDO] ${item.usuario} -> ${item.mensagem}, fila: ${mensagens.length}`
    );
    keyboard.config.autoDelayMs = 50;

    if (comando.tecla in mouseMap) {

      await mouse.pressButton(
        mouseMap[comando.tecla]
      );
      await delay(comando.delay);
      await mouse.releaseButton(
        mouseMap[comando.tecla]
      );

    } else {

      const tecla =
        Key[comando.tecla];

      if (tecla === undefined) {
        console.log(
          `[EXECUTANDO] Tecla inválida: ${comando.tecla}`
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

    cmdExecutedCount++;


    comandoExecutando = null;

    const index = mensagens.findIndex(
      msg => msg.uuid === item.uuid
    );

    if (index !== -1) {
      mensagens.splice(index, 1);
    }


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
  getStatus,
  getFila,
  getComandoExecutando
};