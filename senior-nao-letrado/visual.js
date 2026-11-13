/* Adaptação visual do perfil Sênior; os dados e controles seguem a versão letrada. */
function seniorFigura(termo) {
  const normal = String(termo || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const aliases = { pessoas: 'pessoa', necessidades: 'agua', sentimentos: 'feliz', atividades: 'brincar', lugares: 'casa', acoes: 'passear', ele: 'pessoa', ela: 'pessoa', nos: 'abraco', eles: 'abraco', elas: 'abraco', preciso: 'agua', estou: 'feliz', gosto: 'coracao', vou: 'passear', sair: 'passear', comdor: 'dor', commedo: 'medo', cansado: 'cansado' };
  const imagens = { eu: 'icone-eu', voce: 'icone-voce', quero: 'icone-quero', preciso: 'icone-preciso', estou: 'icone-estou', gosto: 'icone-gosto', vou: 'icone-vou', mae: 'icone-mae', pai: 'icone-pai', professor: 'icone-professor', amigo: 'icone-amigo', ajuda: 'icone-pessoa' };
  if (imagens[normal]) return `<img class="senior-pictograma" src="../assets/imagens/${imagens[normal]}.png" alt="" aria-hidden="true">`;
  return pictogramaSugestao(aliases[normal] || normal);
}

function updateSeniorVisual() {
  const app = document.getElementById('app');
  if (!app) return;
  const challenge = app.querySelector('.challenge-card');
  if (challenge && !challenge.querySelector('.senior-listen')) {
    const listen = document.createElement('button');
    listen.type = 'button';
    listen.className = 'senior-listen';
    listen.setAttribute('aria-label', 'Ouvir o desafio');
    listen.innerHTML = '<img class="senior-action-image" src="../assets/imagens/icone_falar_comunica.png" alt="" aria-hidden="true">';
    listen.addEventListener('click', () => speak(challenge.querySelector('p')?.textContent.trim() || ''));
    challenge.append(listen);
  }
  app.querySelectorAll('.cat-card, .word-card, .carousel-card[data-pick], .tecla:not(.personalize-letter-key), .phrase-chip').forEach(card => {
    if (card.querySelector('.senior-figura')) return;
    const category = card.getAttribute('data-category');
    const word = wordById(card.getAttribute('data-word') || card.getAttribute('data-pick'));
    const label = card.querySelector('.label')?.textContent.trim() || card.textContent.trim();
    const figura = seniorFigura(category || word?.label || label);
    if (!figura) return; // Não representa palavras desconhecidas com uma figura incorreta.
    const span = document.createElement('span');
    span.className = 'senior-figura';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = figura;
    card.prepend(span);
    card.classList.add('senior-ilustrado');
    if (!card.getAttribute('aria-label')) card.setAttribute('aria-label', label);
  });
  const actions = { limpar: 'icone_limpar_comunica', excluir: 'icone_excluir_comunica', recarregar: 'icone_recarregar_comunica', voltarInicio: 'icone_voltar_comunica', falar: 'icone_falar_comunica', concluir: 'icone_concluir_comunica_v2', speakBtn: 'icone_falar_comunica', clearBtn: 'icone_limpar_comunica', eraseBtn: 'icone_excluir_comunica', confirmBtn: 'icone_concluir_comunica_v2' };
  Object.entries(actions).forEach(([id, image]) => {
    const button = document.getElementById(id);
    if (!button || button.querySelector('img')) return;
    if (!button.getAttribute('aria-label')) button.setAttribute('aria-label', button.textContent.trim());
    button.innerHTML = `<img class="senior-action-image" src="../assets/imagens/${image}.png" alt="" aria-hidden="true">`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const observer = new MutationObserver(() => {
    observer.disconnect();
    updateSeniorVisual();
    observer.observe(app, { childList: true, subtree: true });
  });
  observer.observe(app, { childList: true, subtree: true });
  updateSeniorVisual();
  // A fala por foco permite reconhecer as opções antes de ativá-las.
  app.addEventListener('focusin', event => {
    const control = event.target.closest('.menu-btn, .cat-card, .word-card, .carousel-card, .tecla');
    if (control) speak(control.getAttribute('aria-label') || control.querySelector('.label, .menu-title')?.textContent.trim() || control.textContent.trim());
  });
});
