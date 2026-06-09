const { mensagens } = require('./chatreader');
const { carregarConfig } = require('./config');


function processarFila() {
  const config = carregarConfig();

  if (mensagens.length === 0)
    return null;

  switch (config.modo) {

    case 'sequencial':
      return mensagens[0];


    case 'anarquia': {
      const index =
        Math.floor(
          Math.random() * mensagens.length
        );

      return mensagens[index];
    }
  }
}

module.exports = {
  mensagens,
  processarFila
};