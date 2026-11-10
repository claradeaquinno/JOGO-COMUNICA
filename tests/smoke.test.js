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
      assert.ok(fs.existsSync(path.resolve(root, page, resource.split(/[?#]/)[0])), `${page}: ${resource}`);
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


test('argola visual divide o coração entre gosto e não gosto e mantém as categorias', () => {
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
  assert.deepEqual(rings[0].teclas.map(key => key.dataset.setorVisual), ['comida', 'sentimentos', 'gosto', 'nao-gosto', 'lugares']);
  for (const key of rings[0].teclas) {
    assert.ok(key.attributes['aria-label']);
    assert.match(key.innerHTML, /<svg/);
    if (key.dataset.valor) continue;
    vm.runInContext('abrirSetorVisual(' + JSON.stringify(key.dataset.setorVisual) + ')', context);
    assert.ok(rings[1].palavras.length > 0);
    assert.ok(rings[1].palavras.length <= 10);
  }
  assert.equal(opened, 2);
  assert.equal(rings[0].teclas[2].dataset.valor, 'gosto');
  assert.equal(rings[0].teclas[3].dataset.valor, 'não gosto');
  assert.match(rings[0].teclas[3].innerHTML, /M12 12 53 53/);
  const selectSource = html.slice(html.indexOf('function selecionarPalavra(tecla)'), html.indexOf('function direcaoDoAngulo(angulo)'));
  const typed = [];
  let hidden = 0;
  Object.assign(context, {
    adicionarPalavra(text) { typed.push(text); },
    esconderAnelSugestoes() { hidden++; context.sugestoesVisiveis = false; },
    focarTecla(ring, index) { assert.equal(ring, 0); assert.ok([1, 2, 3].includes(index)); },
    atualizarSugestoesNoAnel() { assert.fail('Botões diretos não devem gerar sugestões'); }
  });
  vm.runInContext(selectSource, context);
  for (const initiallyOpen of [false, true]) {
    for (const index of [1, 2, 3]) {
      context.sugestoesVisiveis = initiallyOpen;
      context.selecionarPalavra(rings[0].teclas[index]);
      assert.equal(context.sugestoesVisiveis, false);
    }
  }
  assert.deepEqual(typed, ['Eu', 'gosto', 'não gosto', 'Eu', 'gosto', 'não gosto']);
  assert.equal(hidden, 6);
  assert.equal(opened, 2, 'Botões diretos não abrem a argola externa');
  for (const page of ['adulto', 'infantil']) {
    assert.ok(!fs.readFileSync(path.join(root, page, 'index.html'), 'utf8').includes('const SETORES_VISUAIS'));
  }
});

test('sugestões externas mostram pictogramas e preservam a palavra selecionada', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'infantil-nao-letrado/pictogramas.js'), 'utf8'), context);
  for (const word of ['água', 'comida', 'maçã', 'banana', 'suco', 'leite', 'casa', 'escola', 'parque', 'banheiro', 'hospital', 'quarto', 'feliz', 'triste', 'com medo', 'com dor', 'mãe', 'pai', 'gosto', 'brincar']) {
    assert.match(context.pictogramaSugestao(word), /<svg/ , word);
  }
  assert.equal(context.pictogramaSugestao('<script>'), '');
  for (const word of ['quero', 'Quero', 'ajuda', 'preciso de ajuda', 'pode ajudar']) assert.equal(context.pictogramaSugestao(word), '');
  const html = fs.readFileSync(path.join(root, 'infantil-nao-letrado/index.html'), 'utf8');
  const source = html.slice(html.indexOf('function atualizarTextoDasTeclas('), html.indexOf('// ==== Integração opcional com Gemini'));
  const button = () => ({dataset:{}, classList:{add(){},remove(){}}, replaceChildren(){this.innerHTML='';this.children=[];}, setAttribute(key,value){this[key]=value;}, appendChild(node){this.children.push(node);}});
  const rings = [{teclas:[button()]}, {teclas:[button(),button()]}];
  let closed = false;
  Object.assign(context, {aneis:rings,
    criarTeclasDoAnel(ring, count) { ring.teclas = Array.from({length:count}, button); },
    esconderAnelSugestoes() { closed = true; }
  });
  vm.runInContext(source, context);
  context.atualizarTextoDasTeclas(rings[1], ['água', 'escola']);
  assert.match(rings[1].teclas[0].innerHTML, /<svg/);
  assert.match(rings[1].teclas[1].innerHTML, /<svg/);
  assert.equal(rings[1].teclas[0].dataset.valor, 'água');
  assert.equal(rings[1].teclas[0].children.length, 0, 'Sem legenda de texto');
  context.atualizarTextoDasTeclas(rings[1], ['água', 'palavra sem figura', 'escola']);
  assert.equal(rings[1].teclas.length, 2);
  assert.deepEqual(Array.from(rings[1].palavras), ['água', 'escola']);
  context.atualizarTextoDasTeclas(rings[1], ['palavra sem figura']);
  assert.equal(rings[1].teclas.length, 0);
  assert.equal(closed, true);
});

test('limpar restaura os setores visuais e remove sugestões antigas', () => {
  const html = fs.readFileSync(path.join(root, 'infantil-nao-letrado/index.html'), 'utf8');
  const source = html.slice(html.indexOf('function voltarConfiguracaoInicial()'), html.indexOf('// Posiciona os botões do menu lateral'));
  const rings = [{teclas:[]}, {teclas:[{}], palavras:['gosto']}];
  let visual = 0;
  const context = vm.createContext({
    aneis:rings, valor:{textContent:''}, sugestoesVisiveis:true, teclaAtiva:{}, sugestaoSelecionadaBarra:'gosto',
    esconderAnelSugestoes(){context.sugestoesVisiveis=false;},
    criarTeclasDoAnel(ring,count){ring.teclas=Array.from({length:count},()=>({}));},
    atualizarAnelPalavrasChave(){visual++;}, atualizarFrasesProntas(){},
    focarTecla(ring,index){assert.equal(ring,0);assert.equal(index,0);}
  });
  vm.runInContext(source+';voltarConfiguracaoInicial();',context);
  assert.equal(visual,1);
  assert.equal(context.sugestoesVisiveis,false);
  assert.equal(rings[1].teclas.length,0);
  assert.equal(rings[1].palavras.length,0);
  assert.equal(context.teclaAtiva,null);
  assert.equal(context.sugestaoSelecionadaBarra,'');
});

test('alimentos recebem quero ou de, preservando negação e edições posteriores', async () => {
  const html = fs.readFileSync(path.join(root, 'infantil-nao-letrado/index.html'), 'utf8');
  const source = html.slice(html.indexOf('function ehAlimentoVisual('), html.indexOf('// Esta versão mantém a seleção por figuras'));
  let resolveCorrection;
  let requested;
  const context = vm.createContext({
    valor:{textContent:'Eu'}, normalizarPalavra:s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),
    allWords:()=>[], atualizarFrasesProntas(){},
    corrigirComGemini(text, instruction) { requested = [text,instruction]; return new Promise(resolve => {resolveCorrection=resolve;}); }
  });
  vm.runInContext(source,context);
  context.adicionarPalavra('maçã');
  assert.equal(context.valor.textContent,'Eu quero maçã');
  assert.equal(requested[0],'Eu maçã');
  assert.match(requested[1],/quero/);
  context.valor.textContent='';
  resolveCorrection('Eu quero maçã.');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(context.valor.textContent,'');
  context.valor.textContent='Eu gosto';
  context.adicionarPalavra('maçã');
  assert.equal(context.valor.textContent,'Eu gosto de maçã');
  context.valor.textContent='Eu não gosto';
  context.adicionarPalavra('banana');
  assert.equal(context.valor.textContent,'Eu não gosto de banana');
  context.corrigirComGemini=async()=>null;
  context.valor.textContent='Eu';
  context.adicionarPalavra('água');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(context.valor.textContent,'Eu quero água');
  context.valor.textContent='Eu';
  context.adicionarPalavra('casa');
  assert.equal(context.valor.textContent,'Eu casa');
  context.valor.textContent='Eu gosto de';
  context.adicionarPalavra('maçã');
  assert.equal(context.valor.textContent,'Eu gosto de maçã');
  context.valor.textContent='Eu não gosto de';
  context.adicionarPalavra('banana');
  assert.equal(context.valor.textContent,'Eu não gosto de banana');
  for (const [base, lugar, expected] of [
    ['Eu gosto', 'parque', 'Eu gosto de ir ao parque'],
    ['Eu não gosto', 'escola', 'Eu não gosto de ir à escola'],
    ['Eu gosto de', 'casa', 'Eu gosto de ir para casa'],
    ['Eu não gosto de', 'hospital', 'Eu não gosto de ir ao hospital'],
    ['Eu gosto', 'banheiro', 'Eu gosto de ir ao banheiro']
  ]) {
    context.valor.textContent=base;
    context.adicionarPalavra(lugar);
    assert.equal(context.valor.textContent,expected);
  }
});

test('concluir fecha a argola antes da API e não sobrescreve edição posterior', async () => {
  const html = fs.readFileSync(path.join(root, 'infantil-nao-letrado/index.html'), 'utf8');
  const source = html.slice(html.indexOf('async function concluirFraseCircular()'), html.indexOf('function focarInicio()'));
  let resolveCorrection;
  let closed = false;
  const context = vm.createContext({
    valor:{textContent:'Eu quero maçã'},
    voltarConfiguracaoInicial(){closed=true;}, canonicalizarNomesPersonalizados:s=>s,
    corrigirComGemini:()=>new Promise(resolve=>{resolveCorrection=resolve;}),
    corrigirComLanguageTool:async s=>s
  });
  vm.runInContext(source,context);
  const pending=context.concluirFraseCircular();
  assert.equal(closed,true,'Fecha sem esperar a API');
  context.valor.textContent='';
  resolveCorrection('Eu quero maçã.');
  await pending;
  assert.equal(context.valor.textContent,'');
  context.valor.textContent='Eu quero água';
  const completed=context.concluirFraseCircular();
  resolveCorrection('Eu quero água.');
  await completed;
  assert.equal(context.valor.textContent,'Eu quero água.');
});
