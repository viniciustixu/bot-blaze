const { app } = require('electron');
const { chromium } = require('playwright');
const crypto = require('crypto');
const path = require('path');
const { loadCommands } = require('./commandsStore');
const { carregarConfig } = require('./config');
const { iniciarCache, pararCache, isSubscriber } = require('./src/subscriber-check');


const mensagens = [];
const mensagensLidas = new Set();


let browser = null;
let page = null;
let interval = null;


async function startChatReader() {
  mensagensLidas.clear();
  console.log('ChatReader()');

  if (browser)
    return;

  const config = carregarConfig();
  console.log('[CONFIG]', JSON.stringify(config));

  const slug = new URL(config.url).pathname.replace(/^\//, '').split('/')[0];
  iniciarCache(slug);

  browser = await chromium.launch({
    headless: true,
    executablePath: app.isPackaged
      ? path.join(
        process.resourcesPath,
        'chromium',
        'chrome-win64',
        'chrome.exe'
      )
      : undefined
  });

  page = await browser.newPage();

  const { url } = carregarConfig();

  await page.goto(url);


  try {

    await page.waitForSelector(
      '[data-testid="virtuoso-item-list"] > div',
      {
        timeout: 10000
      }
    );

  }
  catch (e) {

    await browser.close();

    browser = null;
    page = null;

    throw new Error(
      'Erro: não foi possível detectar o chat'
    );
  }

  const indicesVisiveis = await page.$$eval(
    '[data-testid="virtuoso-item-list"] > div',
    elementos => elementos.map(el => el.getAttribute('data-index')).filter(Boolean)
  );

  for (const idx of indicesVisiveis) {
    mensagensLidas.add(idx);
  }

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

            if (!usuarioEl || !mensagemEl)
              return null;

            let subscriber = false;

            if (
              usuarioEl.classList.contains(
                'text-green-400'
              )
            ) {
              subscriber = true;
            }
            else if (
              usuarioEl.classList.contains(
                'text-red-600'
              )
            ) {
              subscriber = true;
            }
            else if (
              usuarioEl.classList.contains(
                'text-primary-600'
              ) ||
              usuarioEl.className.includes(
                'ff6600'
              )
            ) {
              subscriber = 'check';
            }
            else if (
              usuarioEl.classList.contains(
                'text-text-help'
              )
            ) {
              subscriber = false;
            }



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

      const config = carregarConfig();

      for (const item of data) {

        if (mensagensLidas.has(item.index))
          continue;

        if (config.submode && item.subscriber !== true) {
          item.subscriber = isSubscriber(item.usuario);
        }


        const comandos = loadCommands();
        const comando = comandos[item.mensagem.toLowerCase()];
        if (!comando)
          continue;

        mensagensLidas.add(item.index);

        if (
          config.submode &&
          !item.subscriber
        ) {
          console.log(`[BLOQUEADO] ${item.usuario} -> ${item.mensagem} (nao e sub)`);
          continue;
        }


        const mensagem = {

          uuid:
            crypto.randomUUID(),

          timestamp: Date.now(),

          usuario:
            item.usuario,

          mensagem:
            item.mensagem,

          subscriber:
            item.subscriber
        };

        mensagens.push(mensagem);


      }
    } catch (err) {

      console.error('[CHAT] Erro no loop:', err.message);

    }
  }, 1000);
}



async function stopChatReader() {
  mensagensLidas.clear();
  pararCache();

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


}

module.exports = {
  startChatReader,
  stopChatReader,
  mensagens
};
