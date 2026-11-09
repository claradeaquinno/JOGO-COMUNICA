
(() => {
  const icons = {limpar:'🗑️', excluir:'⌫', recarregar:'🔄', voltar:'↩️', falar:'🔊', concluir:'✅', salvar:'💾', selecionar:'✅', apagar:'⌫'};
  function update() {
    document.querySelectorAll('.menu-btn, .word-card, .cat-card, button, [role="button"]').forEach(button => {
      if (button.closest('.form-block, .info-block') || button.matches('.tecla, .botao-alfabeto')) return;
      const label = button.textContent.trim();
      if (!button.getAttribute('aria-label') && label) button.setAttribute('aria-label', label);
      button.querySelectorAll('.menu-text, .label, .description, .count').forEach(el => el.classList.add('sem-texto-label'));
      if (button.children.length || !/[a-zá-ú]/i.test(label)) return;
      const icon = icons[label.toLowerCase()] || (button.id.includes('fav') ? '⭐' : null);
      if (!icon) return;
      button.textContent = icon;
      button.classList.add('sem-texto-icone');
    });
  }
  const app = document.getElementById('app');
  if (app) new MutationObserver(update).observe(app, {childList:true, subtree:true});
  update();
})();
