const { mensagens, processarFila } = require('./queue');
const comandos = require('./commands.json');

const {
  keyboard,
  Key
} = require('@nut-tree-fork/nut-js');

let delayEntreComandos = 3000;



async function executarFila() {

  while (true) {


    if (mensagens.length === 0) {

      await delay(100);
      continue;
    }

    const item = processarFila();


    if (!item)
      continue;


    const comando =
      comandos[
      item.mensagem.toLowerCase()
      ];

    if (!comando)
      continue;

    const tecla =
      Key[comando.tecla];

    if (!tecla) {
      console.log(
        `Tecla inválida: ${comando.tecla}`
      );
      continue;
    }

    console.log(
      `[EXECUTANDO] ${item.usuario} -> ${item.mensagem}`
    );


    await keyboard.pressKey(tecla);
    await delay(comando.delay);
    await keyboard.releaseKey(tecla);



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
  executarFila,
  delayEntreComandos
};