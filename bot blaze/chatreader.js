const { io } = require('socket.io-client');
const { loadCommands } = require('./commandsStore');
const { loadChatCommands } = require('./commandsChatStore');
const { carregarConfig } = require('./config');
const { iniciarCache, pararCache, isSubscriber } = require('./src/subscriber-check');
const { garantirToken, resolverSlug, getAccessToken, sendChatMessage } = require('./src/blaze-api');
const sorteioStore = require('./sorteioStore');
const credenciais = require('./src/blaze-credentials');

const API_V1 = 'https://api.blaze.stream/v1';


const mensagens = [];
const mensagensVistas = new Set();
let totalChatMessages = 0;
let uniqueUsers = new Set();
let counting = false;


let socket = null;
let sessionId = null;
let channelId = null;


async function startChatReader() {
  mensagensVistas.clear();
  totalChatMessages = 0;
  uniqueUsers = new Set();
  console.log('[CHAT] Iniciando leitor via Socket.IO...');

  if (socket)
    return;

  const config = carregarConfig();

  const slug = new URL(config.url).pathname.replace(/^\//, '').split('/')[0];
  iniciarCache(slug);

  await garantirToken();
  channelId = await resolverSlug(slug);
  console.log(`[CHAT] Resolvido channelId: ${channelId}`);

  socket = io('https://blaze.stream', {
    path: '/ws',
    transports: ['websocket'],
  });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout: Socket.IO nao conectou em 15s'));
    }, 15000);

    socket.on('connect', () => {
      console.log('[SOCKET] Conectado');
    });

    socket.on('eventsub', async (message) => {
      const { metadata, payload } = message;

      if (metadata.messageType === 'session_welcome') {
        sessionId = payload.sessionId;
        console.log(`[SOCKET] sessionId: ${sessionId}`);

        try {
          const tokenAcesso = getAccessToken();
          const res = await fetch(`${API_V1}/events/subscriptions`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${tokenAcesso}`,
              'client-id': credenciais.clientId,
            },
            body: JSON.stringify({
              type: 'channel.chat.message',
              version: '1',
              sessionId,
              condition: { channelId },
            }),
          });
          if (res.status !== 200) {
            const data = await res.json();
            throw new Error(`Falha subscription: ${JSON.stringify(data)}`);
          }
          console.log('[EVENTSUB] Subscription ativa para channel.chat.message');
          clearTimeout(timeout);
          resolve();
        } catch (err) {
          clearTimeout(timeout);
          reject(err);
        }
        return;
      }

      if (metadata.subscriptionType !== 'channel.chat.message')
        return;

      const sender = payload.sender;
      if (!sender)
        return;

      const msgId = payload.messageId;
      if (mensagensVistas.has(msgId))
        return;
      mensagensVistas.add(msgId);

      console.log(`[CHAT] ${sender.displayName}: ${payload.message}`);

      const comandos = loadCommands();
      const chatComandos = loadChatCommands();
      const msgLower = payload.message.toLowerCase().trim();
      const msgSemPrefixo = msgLower.startsWith('!') ? msgLower.slice(1) : msgLower;

      if (counting) {
        totalChatMessages++;
        uniqueUsers.add(sender.username.toLowerCase());
      }

      const sorteioCfg = sorteioStore.carregarSorteioConfig();
      const subscriber = sender.isSubscriber || false;
      if (sender.id !== credenciais.botUserId) {
        sorteioStore.registrarInteracao(sender.username, subscriber);
      }

      if (msgLower === sorteioCfg.comando || msgSemPrefixo === sorteioCfg.comando.replace('!', '')) {
        const isMod = (sender.roles && sender.roles.includes('moderator')) || sender.isOwner;
        if (!isMod) {
          try {
            await sendChatMessage(channelId, 'Apenas moderadores podem usar este comando.');
          } catch (err) {
            console.error(`[SORTEIO] Erro ao enviar mensagem: ${err.message}`);
          }
          return;
        }

        const vencedor = sorteioStore.sortear();
        if (!vencedor) {
          try {
            await sendChatMessage(channelId, 'Nenhum participante no sorteio.');
          } catch (err) {
            console.error(`[SORTEIO] Erro ao enviar mensagem: ${err.message}`);
          }
          return;
        }

        const mensagemFinal = sorteioCfg.mensagem.replace('${user}', `@${vencedor}`);
        try {
          await sendChatMessage(channelId, mensagemFinal);
          console.log(`[SORTEIO] Vencedor: ${vencedor}`);
        } catch (err) {
          console.error(`[SORTEIO] Erro ao enviar mensagem: ${err.message}`);
        }

        sorteioStore.resetarPontos();
        return;
      }

      const cfg = carregarConfig();

      let isUserSubscriber = sender.isSubscriber || false;

      if (cfg.submode && !isUserSubscriber) {
        isUserSubscriber = isSubscriber(sender.username);
      }

      if (cfg.submode && !isUserSubscriber) {
        console.log(`[BLOQUEADO] ${sender.displayName} -> ${payload.message} (nao e sub)`);
        return;
      }

      const chatComando = chatComandos[msgLower] || chatComandos[msgSemPrefixo];
      if (chatComando && chatComando.type === 'reply') {
        try {
          await sendChatMessage(channelId, chatComando.resposta);
          console.log(`[REPLY] Resposta enviada para ${sender.displayName}: "${chatComando.resposta}"`);
        } catch (err) {
          console.error(`[REPLY] Erro ao enviar resposta: ${err.message}`);
        }
        return;
      }

      const comando = comandos[msgLower] || comandos[msgSemPrefixo];
      if (!comando)
        return;

      const mensagem = {
        uuid: payload.messageId,
        timestamp: new Date(payload.createdAt).getTime() || Date.now(),
        usuario: sender.displayName || sender.username,
        mensagem: payload.message,
        subscriber: isUserSubscriber,
      };

      mensagens.push(mensagem);
    });

    socket.on('connect_error', (err) => {
      console.error('[SOCKET] Erro de conexao:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('[SOCKET] Desconectado:', reason);
    });
  });
}


async function stopChatReader() {
  mensagensVistas.clear();
  pararCache();

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  sessionId = null;
  channelId = null;
}

function getTotalChatMessages() {
  return totalChatMessages;
}

function getUniqueUsers() {
  return uniqueUsers;
}

function setCounting(enabled) {
  counting = enabled;
}

module.exports = {
  startChatReader,
  stopChatReader,
  mensagens,
  totalChatMessages,
  uniqueUsers,
  getTotalChatMessages,
  getUniqueUsers,
  setCounting
};
