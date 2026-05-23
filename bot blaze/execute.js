const {
  keyboard,
  Key
} = require('@nut-tree-fork/nut-js');

const comandos = require('./commands.json');
const fila = require('./queue');

const agora = new Date();

const horario =
  agora.toLocaleTimeString(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  );



function esperar(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function startExecutor() {

  while (true) {

    if (fila.length === 0) {

      await esperar(50);

      continue;
    }

    const item = fila.shift();

    const comando =
      comandos[item.mensagem.toLowerCase()];

    if (!comando) continue;

    const tecla = Key[comando.tecla];

    if (!tecla) continue;

    console.log(
      `[${horario}] ${item.usuario}: ${item.mensagem}`
    );

    await keyboard.pressKey(tecla);

    await esperar(100);

    await keyboard.releaseKey(tecla);

    await esperar(comando.delay);
  }
}

module.exports = startExecutor;