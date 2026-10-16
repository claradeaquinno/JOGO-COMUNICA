const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = __dirname;
const MAX_BODY_BYTES = 64 * 1024;

function loadLocalEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || Object.hasOwn(process.env, match[1])) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

loadLocalEnv();

const PORT = Number(process.env.PORT) || 4173;
const HOST = process.env.HOST || '127.0.0.1';
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

function sendJson(response, status, value) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(value));
}

async function readJsonBody(request) {
  const chunks = [];
  let byteLength = 0;
  for await (const chunk of request) {
    byteLength += chunk.length;
    if (byteLength > MAX_BODY_BYTES) {
      const error = new Error('Corpo da requisição muito grande.');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('JSON inválido.');
    error.status = 400;
    throw error;
  }
}

async function proxyGemini(request, response) {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    sendJson(response, 503, { error: { message: 'Gemini não configurado neste servidor.' } });
    return;
  }
  if (!request.headers['content-type']?.toLowerCase().includes('application/json')) {
    sendJson(response, 415, { error: { message: 'Envie a requisição como application/json.' } });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(request);
  } catch (error) {
    sendJson(response, error.status || 400, { error: { message: error.message } });
    return;
  }
  if (!Array.isArray(payload?.contents) || !payload.contents.length) {
    sendJson(response, 400, { error: { message: 'A requisição precisa conter contents.' } });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({ contents: payload.contents, generationConfig: payload.generationConfig || {} }),
      signal: controller.signal
    });
    const responseBody = await upstream.text();
    response.writeHead(upstream.status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(responseBody);
  } catch (error) {
    sendJson(response, 502, { error: { message: error.name === 'AbortError' ? 'Tempo limite do Gemini excedido.' : 'Não foi possível conectar ao Gemini.' } });
  } finally {
    clearTimeout(timeout);
  }
}

async function serveStatic(request, response, pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    sendJson(response, 400, { error: { message: 'Caminho inválido.' } });
    return;
  }
  const segments = decodedPath.split(/[\\/]+/).filter(Boolean);
  if (segments.some(segment => segment.startsWith('.')) || segments.includes('server.js') || segments.includes('CONFIGURAR-GEMINI.md')) {
    sendJson(response, 404, { error: { message: 'Arquivo não encontrado.' } });
    return;
  }
  if (decodedPath === '/') decodedPath = '/index.html';
  const filePath = path.resolve(ROOT, `.${decodedPath}`);
  if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${path.sep}`)) {
    sendJson(response, 403, { error: { message: 'Acesso negado.' } });
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      sendJson(response, 404, { error: { message: 'Arquivo não encontrado.' } });
      return;
    }
    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff'
    });
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (url.pathname === '/api/gemini/status') {
    if (request.method !== 'GET') {
      sendJson(response, 405, { error: { message: 'Método não permitido.' } });
      return;
    }
    sendJson(response, 200, { configured: Boolean(process.env.GEMINI_API_KEY) });
    return;
  }
  if (url.pathname === '/api/gemini') {
    if (request.method !== 'POST') {
      sendJson(response, 405, { error: { message: 'Método não permitido.' } });
      return;
    }
    await proxyGemini(request, response);
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendJson(response, 405, { error: { message: 'Método não permitido.' } });
    return;
  }
  await serveStatic(request, response, url.pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`ComunicA disponível em http://${HOST}:${PORT}`);
  console.log(process.env.GEMINI_API_KEY ? 'Gemini configurado no servidor.' : 'Gemini sem chave; o teclado usará sugestões locais.');
});
