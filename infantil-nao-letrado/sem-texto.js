(() => {
  'use strict';

  const selector = 'button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"]';
  // Oculta somente letras e números; emojis, setas, imagens e símbolos continuam visíveis.
  const hasText = /[\p{L}\p{N}]/u;
  const textRuns = /([\p{L}\p{M}\p{N}\p{P}\p{Z}\s]+)/gu;

  function hideButtonText() {
    document.querySelectorAll(selector).forEach(button => {
      if (button.matches('input')) {
        if (button.value && !button.getAttribute('aria-label')) button.setAttribute('aria-label', button.value);
        button.style.color = 'transparent';
        return;
      }
      const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (node.parentElement.closest('.visual-button-text, [data-visible-caption], script, style, svg, [aria-hidden="true"]')) return NodeFilter.FILTER_REJECT;
          return hasText.test(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        const fragment = document.createDocumentFragment();
        node.textContent.split(textRuns).forEach(part => {
          if (!part) return;
          if (hasText.test(part)) {
            const hidden = document.createElement('span');
            hidden.className = 'visual-button-text';
            hidden.textContent = part;
            fragment.append(hidden);
          } else fragment.append(document.createTextNode(part));
        });
        node.replaceWith(fragment);
      });
      // A legenda oculta continua disponível a leitores de tela como nome do botão.
      if (!button.hasAttribute('aria-label')) {
        const label = button.textContent.trim().replace(/\s+/g, ' ');
        if (label) button.setAttribute('aria-label', label);
      }
    });
  }

  const observer = new MutationObserver(() => {
    observer.disconnect();
    hideButtonText();
    observe();
  });
  function observe() {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  hideButtonText();
  observe();
})();
