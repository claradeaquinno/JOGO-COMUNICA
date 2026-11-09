const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawn } = require('node:child_process');
const { test } = require('node:test');
const root = path.resolve(__dirname, '..');

test('as três versões contêm scripts válidos e recursos locais existentes', () => {
  for (const page of ['adulto', 'infantil', 'infantil-nao-letrado']) {
    const html = fs.readFileSync(path.join(root, page, 'index.html'), 'utf8');
    assert.match(html, /id="app"/);
    for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
      new vm.Script(match[1], { filename: page });
    }
    for (const match of html.matchAll(/(?:src=["']|url\(['"]?)([^\s'"`)<>]+)/g)) {
      const resource = match[1];
      if (/^(https?:|data:|#)/.test(resource) || resource.includes('${')) continue;
      assert.ok(fs.existsSync(path.resolve(root, page, resource)), `${page}: ${resource}`);
    }
  }
});

test('servidor abre versões, redireciona pastas e protege arquivos internos', async () => {
  const port = 14000 + Math.floor(Math.random() * 20000);
  const child = spawn(process.execPath, ['server.js'], {
    cwd: root, env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' }, stdio: ['ignore', 'pipe', 'pipe']
  });
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Servidor não iniciou')), 5000);
      child.once('error', reject);
      child.once('exit', code => { clearTimeout(timeout); reject(new Error(`Servidor encerrou: ${code}`)); });
      child.stdout.once('data', () => { clearTimeout(timeout); resolve(); });
    });
    const base = `http://127.0.0.1:${port}`;
    for (const route of ['/', '/adulto/', '/infantil/', '/infantil-nao-letrado/']) {
      const response = await fetch(base + route);
      assert.equal(response.status, 200, route);
      assert.match(await response.text(), /<html/);
    }
    const redirect = await fetch(base + '/infantil?teste=1', { redirect: 'manual' });
    assert.equal(redirect.status, 308);
    assert.equal(redirect.headers.get('location'), '/infantil/?teste=1');
    for (const route of ['/.env', '/.git/config', '/server.js', '/%ZZ']) {
      assert.ok((await fetch(base + route)).status >= 400, route);
    }
    assert.equal((await fetch(base + '/adulto/', { method: 'HEAD' })).status, 200);
    assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
  } finally {
    child.kill();
  }
});


test('argola visual contém quatro setores e abre opções sem inserir o nome da categoria', () => {
  const html = fs.readFileSync(path.join(root, 'infantil-nao-letrado/index.html'), 'utf8');
  const source = html.slice(html.indexOf('const SETORES_VISUAIS ='), html.indexOf('function palavrasPersonalizadasPorGenero'));
  const makeRing = () => ({ teclas: [], palavras: [] });
  const rings = [makeRing(), makeRing()];
  let opened = 0;
  const context = vm.createContext({
    aneis: rings,
    criarTeclasDoAnel(ring, count) {
      ring.teclas = Array.from({ length: count }, () => ({ dataset: {}, attributes: {}, setAttribute(key, value) { this.attributes[key] = value; } }));
    },
    allWords: () => [{ cat: 'comida', label: 'Água' }, { cat: 'pessoas', label: 'Mãe' }],
    atualizarTextoDasTeclas(ring, words) { ring.palavras = words; },
    mostrarAnelSugestoes() { opened++; },
    focarTecla(ring, index) { assert.equal(ring, 1); assert.equal(index, 0); }
  });
  vm.runInContext(source + '; atualizarAnelPalavrasChave();', context);
  assert.deepEqual(rings[0].teclas.map(key => key.dataset.setorVisual), ['comida', 'sentimentos', 'pessoas', 'lugares']);
  for (const key of rings[0].teclas) {
    assert.ok(key.attributes['aria-label']);
    assert.match(key.innerHTML, /<svg/);
    vm.runInContext('abrirSetorVisual(' + JSON.stringify(key.dataset.setorVisual) + ')', context);
    assert.ok(rings[1].palavras.length > 0);
    assert.ok(rings[1].palavras.length <= 10);
  }
  assert.equal(opened, 4);
  for (const page of ['adulto', 'infantil']) {
    assert.ok(!fs.readFileSync(path.join(root, page, 'index.html'), 'utf8').includes('const SETORES_VISUAIS'));
  }
});
