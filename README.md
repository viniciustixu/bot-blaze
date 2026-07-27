# Bot Blaze

Bot estilo "Twitch play Pokémon" para streams na Blaze. O bot lê o chat em tempo real via Socket.IO (EventSub) e executa comandos de teclado/mouse no jogo conforme os viewers enviam mensagens.

## Funcionalidades

- Leitura do chat em tempo real via Socket.IO (EventSub)
- Execução de comandos de teclado/mouse via nut-js
- Modos de operação: sequencial (fila) e anarquia (quem chega primeiro executa)
- Modo subscriber-only (verificação via API da Blaze)
- Perfis de comandos (presets) — até 9 perfis
- Comandos de resposta automática do chat (reply)
- Sistema de sorteio (raffle) com pontos e multiplicador de inscritos
- Contador de comandos executados na tela inicial
- Interface Electron com React + Tailwind + DaisyUI
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

### 3. Configure as credenciais da API da Blaze

Copie o template de credenciais e preencha com seus dados:

```bash
cp blaze-credentials.example.js blaze-credentials.js
```

Edite `blaze-credentials.js` com seu `clientId`, `clientSecret` e `botUserId`:

```js
module.exports = {
  clientId: "seu_client_id_aqui",
  clientSecret: "seu_client_secret_aqui",
  botUserId: "seu_bot_user_id_aqui",
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
│   ├── splash.html          # Tela de splash/loading
│   └── kirbyico.ico         # Ícone do app
├── src/
│   ├── Components/          # Componentes React (18 componentes)
│   ├── pages/               # Páginas (Inicio, Controles, Config)
│   │   ├── ConfigGeral.jsx      # Configurações gerais
│   │   ├── ConfigSorteio.jsx    # Configurações do sorteio
│   │   └── ConfigChatBot.jsx    # Comandos de resposta do chat
│   ├── assets/              # Imagens e sons
│   ├── blaze-api.js         # API da Blaze (auth, subscribers, chat)
│   └── main.jsx             # Entry point React
├── chatreader.js            # Leitor de chat via Socket.IO
├── commandsStore.js         # CRUD de perfis/comandos
├── commandsChatStore.js     # CRUD de comandos de reply do chat
├── sorteioStore.js          # Sistema de sorteio (raffle)
├── config.js                # Configurações do app
├── execute.js               # Execução de teclas/mouse (nut-js)
├── queue.js                 # Fila de comandos
├── logger.js                # Logs de sessão
├── blaze-credentials.js     # Credenciais da API (gitignored)
└── vite.config.js           # Config do Vite + Tailwind
```

## Comandos do bot

Os comandos de teclado/mouse são definidos via interface (aba Controles). Formato:

```json
{
  "!up": { "tecla": "Up", "delay": 1000 },
  "!down": { "tecla": "Down", "delay": 1000 }
}
```

- **Tecla:** nome da tecla a ser pressionada (ex: `Up`, `Down`, `Left`, `Right`, `a`-`z`, `space`, `Enter`, `Escape`, F1-F12, numpad, mouse clicks)
- **Delay:** tempo em milissegundos que a tecla fica pressionada

### Comandos de resposta automática

O bot pode responder automaticamente a comandos do chat com mensagens de texto (aba Configurações > Comandos do Chat):

```json
{
  "!howtoplay": { "type": "reply", "resposta": "Envie up, down, left ou right para se mover!" }
}
```

### Sorteio (Raffle)

Sistema de sorteio integrado ao chat (aba Configurações > Sorteio):
- Viewers acumulam pontos interagindo no chat
- Inscritos ganham pontos com multiplicador configurável
- Moderadores ativam o sorteio com o comando configurável (padrão: `!sorteio`)
- O vencedor é sorteado por peso (mais pontos = mais chance)

## Licença

MIT
