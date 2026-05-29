const { chromium } = require('playwright');
const crypto = require('crypto');
const comandos = require('./commands.json');


const mensagens = [];
const mensagensLidas = new Set();
let inicio = 0;

let browser = null;
let page = null;
let interval = null;


async function startChatReader() {

  if (browser)
    return;

  inicio = Date.now() + 10000;

  browser = await chromium.launch({
    headless: true
  });

  page = await browser.newPage();

  await page.goto(
    'https://blaze.stream/nami88'
  );

  try {

    await page.waitForSelector(
      '[data-testid="virtuoso-item-list"] > div',
      {
        timeout: 10000
      }
    );

  }
  catch (e) {

    console.log(
      'Nenhuma mensagem encontrada no chat'
    );

    await browser.close();

    browser = null;
    page = null;

    throw new Error(
      'Falha ao iniciar chat reader'
    );
  }

  console.log('Chat iniciado...\n');


  interval = setInterval(async () => {

    try {

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

      const aquecendo = Date.now() < inicio;

      for (const item of data) {

        if (mensagensLidas.has(item.index))
          continue;

        if (aquecendo) {

          mensagensLidas.add(item.index);
          continue;
        }


        const timestamp = Date.now();

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
    } catch (err) {

      console.log(
        'Erro no chat reader:',
        err
      );

    }
  }, 1000);
}



async function stopChatReader() {

  if (interval) {

    clearInterval(interval);
    interval = null;
  }

  if (page) {

    await page.close();
    page = null;
  }

  if (browser) {

    await browser.close();
    browser = null;
  }

  console.log('Chat finalizado');
}

function emAquecimento() {
  return Date.now() < inicio;
}

module.exports = {
  startChatReader,
  stopChatReader,
  emAquecimento,
  mensagens
};