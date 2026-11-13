const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

test('sênior visual representa cada categoria e mantém termos desconhecidos sem figuras enganosas', () => {
  const context = vm.createContext({ document: { addEventListener() {} } });
  for (const file of ['infantil-nao-letrado/pictogramas.js', 'senior-nao-letrado/visual.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  }
  for (const category of ['pessoas', 'necessidades', 'comida', 'sentimentos', 'atividades', 'lugares', 'acoes']) {
    assert.match(context.seniorFigura(category), /<svg|<img/, category);
  }
  assert.equal(context.seniorFigura('palavra sem imagem'), '');
  for (const word of ['eu', 'você', 'quero', 'preciso', 'estou', 'gosto', 'vou', 'mãe', 'pai']) {
    const figure = context.seniorFigura(word);
    assert.match(figure, /aria-hidden="true"/);
    for (const match of figure.matchAll(/src="([^"]+)"/g)) {
      assert.ok(fs.existsSync(path.resolve(root, 'senior-nao-letrado', match[1])));
    }
  }
});
