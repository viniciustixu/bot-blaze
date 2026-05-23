const { chromium } = require('playwright');

async function startChatReader() {



  const browser = await chromium.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(
    'https://blaze.stream/justinotv25'
  );

  // ATIVA TIMESTAMP
  await page.getByRole('button', { name: 'Chat settings' }).click();
  await page.locator(
    'div.hover\\:bg-border',
    { hasText: 'Show Timestamp' }
  ).getByRole(
    'switch'
  ).click();



  await page.waitForSelector(
    '[data-testid="virtuoso-item-list"] > div'
  );

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

        const timestampEl =
          el.querySelector(
            'span.timestamp'
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

          timestamp:
            timestampEl
              ? timestampEl.innerText.trim()
              : null,

          subscriber
        };

      }).filter(Boolean);

    }
  );

  console.log(data);

  await browser.close();
}

module.exports = startChatReader;