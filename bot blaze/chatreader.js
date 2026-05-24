const { chromium } = require('playwright');
const crypto = require('crypto');

const mensagens = [];
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

  const data = await page.$$eval(
    '[data-testid="virtuoso-item-list"] > div',
    elementos => {

      return elementos.map(el => {

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

    const agora = Date.now();

    if (agora < inicio)
      continue;

    mensagens.push({

      uuid:
        crypto.randomUUID(),

      timestamp:
        new Date().toISOString(),

      usuario:
        item.usuario,

      mensagem:
        item.mensagem,

      subscriber:
        item.subscriber
    });
  }

  console.log(mensagens);

  await browser.close();
}

module.exports = {
  startChatReader,
  mensagens
};