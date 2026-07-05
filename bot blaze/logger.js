const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function getLogsDir() {
  if (app.isPackaged) {
    return path.join(path.dirname(app.getPath('exe')), 'logs');
  }
  return path.join(process.cwd(), 'logs');
}

function ensureLogsDir() {
  const dir = getLogsDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function formatarDuracao(ms) {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const s = segundos % 60;
  const m = minutos % 60;
  const h = horas;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const min = String(data.getMinutes()).padStart(2, '0');
  const seg = String(data.getSeconds()).padStart(2, '0');
  return `${dia}/${mes}/${ano} ${hora}:${min}:${seg}`;
}

function formatarNumero(n) {
  return n.toLocaleString('pt-BR');
}

function gerarConteudoLog(startTime, stats) {
  const inicio = new Date(startTime);
  const termino = new Date();
  const duracao = termino.getTime() - inicio.getTime();
  const usuarios = [...stats.uniqueUsers].sort();

  const linhas = [
    `Início:               ${formatarData(inicio)}`,
    `Término:              ${formatarData(termino)}`,
    `Duração:              ${formatarDuracao(duracao)}`,
    '',
    `Comandos executados:  ${formatarNumero(stats.cmdExecuted)}`,
    `Mensagens no chat:    ${formatarNumero(stats.totalMessages)}`,
    `Usuários únicos:      ${formatarNumero(stats.uniqueUsers.size)}`,
    '',
    'Usuários que participaram:',
    ...usuarios.map(u => `  - ${u}`)
  ];

  return linhas.join('\n');
}

function nomeArquivoLog(startTime) {
  const data = new Date(startTime);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const min = String(data.getMinutes()).padStart(2, '0');
  const seg = String(data.getSeconds()).padStart(2, '0');
  return `${dia}-${mes}-${ano}_${hora}-${min}-${seg}.txt`;
}

async function writeLogFile(startTime, stats) {
  const dir = ensureLogsDir();
  const nome = nomeArquivoLog(startTime);
  const caminho = path.join(dir, nome);
  const conteudo = gerarConteudoLog(startTime, stats);
  fs.writeFileSync(caminho, conteudo, 'utf8');
  console.log(`[LOG] Arquivo de log criado: ${caminho}`);
}

module.exports = { writeLogFile };
