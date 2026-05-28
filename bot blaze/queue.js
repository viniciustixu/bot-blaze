const { mensagens } = require('./chatreader');



let modo = 'sequencial'; // sequencial, democracia, anarquia
let subscriberOnly = false;



function processarFila() {

  if (mensagens.length === 0)
    return null;



  if (subscriberOnly) {

    for (let i = mensagens.length - 1; i >= 0; i--) {

      const item = mensagens[i];

      if (!item.subscriber) {
        console.log(
          'REMOVENDO NÃO SUB:',
          item.usuario
        );

        mensagens.splice(i, 1);

        console.log("mensagens atuais:", mensagens.length);
      }
    }
  }

  if (mensagens.length === 0)
    return null;



  switch (modo) {

    case 'sequencial':

      return mensagens[0];



    case 'democracia': {

      const votos = {};

      for (const item of mensagens) {

        const comando =
          item.mensagem.toLowerCase();

        if (!votos[comando]) {
          votos[comando] = 0;
        }

        votos[comando]++;
      }

      let comandoVencedor = null;
      let maiorNumero = 0;

      for (const comando in votos) {

        if (votos[comando] > maiorNumero) {

          maiorNumero = votos[comando];
          comandoVencedor = comando;
        }
      }

      return mensagens.find(item => {

        return item.mensagem.toLowerCase()
          === comandoVencedor;

      });
    }



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
  modo,
  subscriberOnly,
  processarFila
};