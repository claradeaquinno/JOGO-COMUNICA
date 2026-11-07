(() => {
  "use strict";

  const categories = [
    { id: "basico", label: "Essencial", title: "Palavras úteis", words: [["🙋", "Eu"], ["✅", "Sim"], ["❌", "Não"], ["🙏", "Por favor"], ["💚", "Obrigado(a)"], ["❓", "Não entendi"], ["💬", "Quero falar"], ["🆘", "Preciso de ajuda"]] },
    { id: "necessidades", label: "Necessidades", title: "O que eu preciso", words: [["🚻", "Banheiro"], ["🥤", "Água"], ["🍽️", "Comida"], ["🛏️", "Descansar"], ["🧥", "Estou com frio"], ["🌡️", "Estou com calor"], ["🪑", "Mudar de posição"], ["🧼", "Quero me limpar"]] },
    { id: "sentimentos", label: "Sentimentos", title: "Como estou me sentindo", words: [["😊", "Feliz"], ["😢", "Triste"], ["😟", "Preocupado(a)"], ["😠", "Com raiva"], ["😴", "Com sono"], ["😣", "Desconfortável"], ["🤕", "Com dor"], ["💚", "Estou bem"]] },
    { id: "saude", label: "Saúde", title: "Saúde e cuidados", words: [["🩹", "Estou com dor"], ["💊", "Remédio"], ["🩺", "Preciso de um médico"], ["📍", "Dói aqui"], ["🩸", "Estou enjoado(a)"], ["🫁", "Está difícil respirar"], ["🆘", "É urgente"], ["⏸️", "Preciso de uma pausa"]] },
    { id: "pessoas", label: "Pessoas", title: "Pessoas e companhia", words: [["👩", "Mãe"], ["👨", "Pai"], ["👧", "Minha família"], ["🧑‍⚕️", "Enfermeiro(a)"], ["👨‍⚕️", "Médico(a)"], ["🤝", "Fique comigo"], ["📞", "Quero ligar"], ["👋", "Quero ficar sozinho(a)"]] },
    { id: "conversa", label: "Conversa", title: "Frases para conversar", words: [["👋", "Olá"], ["☀️", "Bom dia"], ["🙏", "Por favor"], ["💚", "Muito obrigado(a)"], ["❓", "Pode repetir?"], ["⏳", "Espere um pouco"], ["👍", "Está tudo certo"], ["👋", "Até logo"]] }
  ];

  const STORAGE_KEY = "minha-voz-preferencias-v1";
  const defaults = { sound: true };
  const loadPreferences = () => { try { return { ...defaults, sound: JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}").sound ?? defaults.sound }; } catch { return { ...defaults }; } };
  const preferences = loadPreferences();

  const categoryNav = document.getElementById("categories");
  const wordGrid = document.getElementById("wordGrid");
  const phrase = document.getElementById("phrase");
  const count = document.getElementById("wordCount");
  const phraseTitle = document.getElementById("phrase-title");
  const announce = document.getElementById("announcement");
  const words = [];
  let activeCategory = localStorage.getItem("minha-voz-categoria") || "basico";

  function say(message) { announce.textContent = message; }
  function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); document.getElementById("saveState").textContent = "Preferências salvas agora"; setTimeout(() => { document.getElementById("saveState").textContent = "Preferências salvas neste dispositivo"; }, 1800); }
  function renderPhrase() {
    phrase.replaceChildren(...words.map(word => { const chip = document.createElement("span"); chip.className = "phrase-word"; chip.textContent = word; return chip; }));
    const n = words.length; count.textContent = `${n} ${n === 1 ? "palavra" : "palavras"}`;
    phraseTitle.textContent = words.length ? words.join(" ") : "Toque nas palavras";
  }
  function addWord(word) { words.push(word); renderPhrase(); say(`${word} adicionado.`); }
  function clearWords() { words.length = 0; window.speechSynthesis?.cancel(); renderPhrase(); say("Mensagem limpa."); }
  function showCategory(id) {
    activeCategory = id; localStorage.setItem("minha-voz-categoria", id);
    const category = categories.find(item => item.id === id) || categories[0];
    document.getElementById("categoryTitle").textContent = category.title;
    categoryNav.querySelectorAll(".category").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.category === category.id)));
    wordGrid.replaceChildren();
    category.words.forEach(([symbol, label]) => {
      const button = document.createElement("button"); button.type = "button"; button.className = "word-card"; button.dataset.word = label; button.setAttribute("aria-label", label);
      const icon = document.createElement("span"); icon.className = "symbol"; icon.setAttribute("aria-hidden", "true"); icon.textContent = symbol;
      const text = document.createElement("span"); text.className = "label"; text.textContent = label; button.append(icon, text); button.addEventListener("click", () => addWord(label)); wordGrid.appendChild(button);
    });
  }

  categories.forEach(category => { const button = document.createElement("button"); button.type = "button"; button.className = "category"; button.dataset.category = category.id; button.textContent = category.label; button.setAttribute("aria-pressed", "false"); button.addEventListener("click", () => showCategory(category.id)); categoryNav.appendChild(button); });
  document.getElementById("speakButton").addEventListener("click", () => {
    if (!words.length) return say("Escolha algumas palavras primeiro.");
    if (!("speechSynthesis" in window)) return say("A voz não está disponível neste navegador.");
    window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(words.join(" ")); utterance.lang = "pt-BR"; utterance.rate = 0.88; window.speechSynthesis.speak(utterance); say("Falando sua mensagem.");
  });
  document.getElementById("backspaceButton").addEventListener("click", () => { if (words.length) words.pop(); renderPhrase(); say("Última palavra apagada."); });
  document.getElementById("clearButton").addEventListener("click", () => { if (!words.length) return say("A mensagem já está vazia."); if (window.confirm("Limpar toda a mensagem?")) clearWords(); else say("Mensagem mantida."); });

  const soundToggle = document.getElementById("soundToggle");
  soundToggle.checked = Boolean(preferences.sound);
  soundToggle.addEventListener("change", () => { preferences.sound = soundToggle.checked; persist(); });
  showCategory(activeCategory);
  renderPhrase();
})();
