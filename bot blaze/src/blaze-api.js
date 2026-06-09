const path = require("path");
const fs = require("fs");
const { app } = require("electron");
const credenciais = require("./blaze-credentials");

const API_AUTH = "https://blaze.stream";
const API_V1 = "https://api.blaze.stream/v1";

let token = null;
let channelId = null;
let cacheInterval = null;
const subsCache = new Set();

function getTokenPath() {
  return path.join(app.getPath("userData"), "blaze-app-token.json");
}

function carregarToken() {
  try {
    return JSON.parse(fs.readFileSync(getTokenPath(), "utf-8"));
  } catch {
    return null;
  }
}

function salvarToken(dados) {
  token = dados;
  fs.writeFileSync(getTokenPath(), JSON.stringify(token, null, 2));
}

async function apiGet(path) {
  const res = await fetch(`${API_V1}${path}`, {
    headers: {
      authorization: `Bearer ${token.accessToken}`,
      "client-id": credenciais.clientId,
      accept: "application/json",
    },
  });
  return { status: res.status, data: await res.json() };
}

async function gerarAppToken() {
  const res = await fetch(`${API_AUTH}/bapi/oauth2/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      clientId: credenciais.clientId,
      clientSecret: credenciais.clientSecret,
      grantType: "client_credentials",
    }),
  });
  const data = await res.json();
  if (res.status !== 200) throw new Error(`Falha ao gerar App Token: ${JSON.stringify(data)}`);
  salvarToken({ ...data, expiresAt: Date.now() + data.expiresIn * 1000 });
}

async function garantirToken() {
  const salvo = carregarToken();
  if (salvo && Date.now() < salvo.expiresAt) {
    token = salvo;
    return;
  }
  await gerarAppToken();
}

async function resolverSlug(slug) {
  const { status, data } = await apiGet(`/users/profile?username=${encodeURIComponent(slug)}`);
  if (status !== 200 || !data.success) {
    throw new Error(`Falha ao resolver slug "${slug}": ${JSON.stringify(data)}`);
  }
  return data.data.userId;
}

async function buscarSubscribersChat() {
  if (!channelId) return;

  const { status, data } = await apiGet(
    `/chats/messages?channelId=${channelId}&limit=100`
  );
  if (status !== 200 || !data.success) return;

  for (const msg of data.data.messages) {
    if (msg.sender?.isSubscriber) {
      subsCache.add(msg.sender.displayName.toLowerCase());
    }
  }
}

async function atualizarCache(slug) {
  try {
    await garantirToken();
    if (!channelId) channelId = await resolverSlug(slug);
    await buscarSubscribersChat();
    console.log(`[CACHE] ${subsCache.size} subscribers conhecidos`);
  } catch (err) {
    console.error("[CACHE] Erro:", err.message);
  }
}

async function iniciarCache(slug) {
  pararCache();
  await atualizarCache(slug);
  cacheInterval = setInterval(() => atualizarCache(slug), 30000);
}

function pararCache() {
  if (cacheInterval) {
    clearInterval(cacheInterval);
    cacheInterval = null;
  }
  subsCache.clear();
  channelId = null;
  token = null;
}

function isSubscriber(nomeUsuario) {
  return subsCache.has(nomeUsuario.toLowerCase());
}

module.exports = { iniciarCache, pararCache, isSubscriber, garantirToken, resolverSlug, apiGet };
