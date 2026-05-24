const { chromium } = require('playwright');
const crypto = require('crypto');
const comandos = require('./commands.json');

const mensagens = [];
const mensagensLidas = new Set();

// momento que o bot iniciou +10 segundos
const inicio = Date.now() + 10000;

async function startChatReader() {

  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.goto(
    'https://blaze.stream/nami88'
  );

  await page.waitForSelector(
    '[data-testid="virtuoso-item-list"] > div'
  );

  console.log('Chat iniciado...\n');

  setInterval(async () => {

    const data = await page.$$eval(
      '[data-testid="virtuoso-item-list"] > div',
      elementos => {

        return elementos.map(el => {

          const index =
            el.getAttribute('data-index');

          const usuarioEl =
            el.querySelector(
              'button[title="User actions"]'
            );

          const mensagemEl =
            el.querySelector(
              'span.text-text.pl-1.font-normal'
            );

          const subscriber =
            !!el.querySelector(
              'button.text-green-400'
            );

          if (!usuarioEl || !mensagemEl)
            return null;

          return {

            index,

            usuario:
              usuarioEl.innerText
                .replace(':', '')
                .trim(),

            mensagem:
              mensagemEl.innerText
                .trim(),

            subscriber
          };

        }).filter(Boolean);

      }
    );

    for (const item of data) {

      // anti duplicata
      if (mensagensLidas.has(item.index))
        continue;



      // timestamp próprio da mensagem
      const timestamp = Date.now();

      // ignora mensagens antigas
      if (timestamp < inicio)
        continue;

      const mensagem = {

        uuid:
          crypto.randomUUID(),

        timestamp,

        usuario:
          item.usuario,

        mensagem:
          item.mensagem,

        subscriber:
          item.subscriber
      };

      const comando =
        comandos[item.mensagem.toLowerCase()];

      if (!comando)
        continue;

      mensagensLidas.add(item.index);

      mensagens.push(mensagem);

      console.log(mensagem);
    }

  }, 1000);
}

module.exports = {
  startChatReader,
  mensagens
};