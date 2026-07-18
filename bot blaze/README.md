# Bot Blaze

Bot estilo "Twitch play Pokémon" para streams na Blaze. O bot lê o chat em tempo real via Playwright (headless Chromium) e executa comandos de teclado/mouse no jogo conforme os viewers enviam mensagens.

## Funcionalidades

- Leitura do chat em tempo real via Playwright (headless)
- Execução de comandos de teclado/mouse via nut-js
- Modos de operação: sequencial (fila) e anarquia (quem chega primeiro executa)
- Modo subscriber-only (verificação via API da Blaze)
- Perfis de comandos (presets) — até 9 perfis
- Interface Electron com React + Tailwind
- Sistema de logs por sessão
- Auto-updater

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- npm (vem junto com o Node)

## Setup

### 1. Clone o repositório

```bash
git clone https://github.com/viniciustixu/bot-blaze.git
cd bot-blaze/bot\ blaze
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Instale o Chromium do Playwright

O bot usa Playwright para ler o chat no browser em headless. É necessário instalar o binário do Chromium:

```bash
npx playwright install chromium
```

### 4. Configure as credenciais da API da Blaze

Copie o template de credenciais e preencha com seus dados:

```bash
cp blaze-credentials.example.js blaze-credentials.js
```

Edite `blaze-credentials.js` com seu `clientId` e `clientSecret`:

```js
module.exports = {
  clientId: "seu_client_id_aqui",
  clientSecret: "seu_client_secret_aqui",
};
```

> **Importante:** O `blaze-credentials.js` está no `.gitignore` e **não** é enviado ao repositório. Você também precisa copiar o arquivo para dentro de `src/`, pois o módulo `src/blaze-api.js` importa de lá:
>
> ```bash
> cp blaze-credentials.js src/blaze-credentials.js
> ```

## Rodando

### Modo desenvolvimento (web)

```bash
npm run dev
```

Abre a interface em `http://localhost:5173`.

### Modo Electron (desktop)

```bash
npm run start
```

Abre a aplicação como janela desktop.

### Build para distribuição

```bash
npm run dist
```

Gera o instalador `.exe` na pasta `dist/`.

## Estrutura do projeto

```
bot blaze/
├── public/
│   ├── electron.js          # Main process do Electron
│   ├── preload.js           # Bridge IPC (contextBridge)
│   └── splash.html          # Tela de splash/loading
├── src/
│   ├── Components/          # Componentes React
│   ├── pages/               # Páginas (Inicio, Config, Controles)
│   ├── blaze-api.js         # API da Blaze (auth, subscribers)
│   └── main.jsx             # Entry point React
├── blaze-credentials.js     # Credenciais da API (gitignored)
├── chatreader.js            # Leitor de chat via Playwright
├── commands.json            # Comandos do bot
├── commandsStore.js         # CRUD de perfis/comandos
├── config.js                # Configurações do app
├── execute.js               # Execução de teclas/mouse (nut-js)
├── queue.js                 # Fila de comandos
└── vite.config.js           # Config do Vite + Tailwind
```

## Comandos do bot

Os comandos são definidos em `commands.json` (gerenciado pela interface). Formato padrão:

```json
{
  "!up": { "tecla": "Up", "delay": 1000 },
  "!down": { "tecla": "Down", "delay": 1000 }
}
```

- **Tecla:** nome da tecla a ser pressionada (ex: `Up`, `Down`, `Left`, `Right`, `a`-`z`, `space`, etc.)
- **Delay:** tempo em milissegundos antes de executar o próximo comando

## Licença

MIT
