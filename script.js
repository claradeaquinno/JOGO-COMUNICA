const DEFAULT_CATEGORIES = [
  { id: 'pessoas', label: 'Pessoas', emoji: '', custom: false },
  { id: 'necessidades', label: 'Necessidades', emoji: '', custom: false },
  { id: 'sentimentos', label: 'Sentimentos', emoji: '', custom: false },
  { id: 'atividades', label: 'Atividades', emoji: '', custom: false },
  { id: 'lugares', label: 'Lugares', emoji: '', custom: false },
  { id: 'acoes', label: 'Ações', emoji: '', custom: false }
];

const DEFAULT_WORDS = [


  {
    id: 'eu',
    label: 'Eu',
    emoji: '',
    description: 'Quem está falando',
    cat: 'pessoas'
  },

  {
    id: 'voce',
    label: 'Você',
    emoji: '',
    description: 'A pessoa com quem falo',
    cat: 'pessoas'
  },

  {
    id: 'mae',
    label: 'Mãe',
    emoji: '',
    description: 'Minha mãe',
    cat: 'pessoas'
  },

  {
    id: 'pai',
    label: 'Pai',
    emoji: '',
    description: 'Meu pai',
    cat: 'pessoas'
  },

  {
    id: 'professor',
    label: 'Professor',
    emoji: '',
    description: 'Meu professor',
    cat: 'pessoas'
  },

  {
    id: 'amigo',
    label: 'Amigo',
    emoji: '',
    description: 'Meu amigo',
    cat: 'pessoas'
  },


  

  {
    id: 'quero',
    label: 'Quero',
    emoji: '',
    description: 'Eu desejo algo',
    cat: 'acoes'
  },

  {
    id: 'preciso',
    label: 'Preciso',
    emoji: '',
    description: 'Eu preciso de algo',
    cat: 'acoes'
  },

  {
    id: 'estou',
    label: 'Estou',
    emoji: '',
    description: 'Como eu estou',
    cat: 'acoes'
  },

  {
    id: 'gosto',
    label: 'Gosto',
    emoji: '',
    description: 'Eu gosto de algo',
    cat: 'acoes'
  },

  {
    id: 'vou',
    label: 'Vou',
    emoji: '',
    description: 'Eu vou para algum lugar',
    cat: 'acoes'
  },


 

  {
    id: 'agua',
    label: 'Água',
    emoji: '',
    description: 'Quero beber',
    cat: 'necessidades'
  },

  {
    id: 'comida',
    label: 'Comida',
    emoji: '',
    description: 'Quero comer',
    cat: 'necessidades'
  },

  {
    id: 'banheiro',
    label: 'Banheiro',
    emoji: '',
    description: 'Preciso ir ao banheiro',
    cat: 'necessidades'
  },

  {
    id: 'dormir',
    label: 'Dormir',
    emoji: '',
    description: 'Quero dormir',
    cat: 'necessidades'
  },

  {
    id: 'descansar',
    label: 'Descansar',
    emoji: '',
    description: 'Quero descansar',
    cat: 'necessidades'
  },

  {
    id: 'ajuda',
    label: 'Ajuda',
    emoji: '',
    description: 'Preciso de ajuda',
    cat: 'necessidades'
  },



  {
    id: 'feliz',
    label: 'Feliz',
    emoji: '',
    description: 'Estou feliz',
    cat: 'sentimentos'
  },

  {
    id: 'triste',
    label: 'Triste',
    emoji: '',
    description: 'Estou triste',
    cat: 'sentimentos'
  },

  {
    id: 'cansado',
    label: 'Cansado',
    emoji: '',
    description: 'Estou cansado',
    cat: 'sentimentos'
  },

  {
    id: 'commedo',
    label: 'Com medo',
    emoji: '',
    description: 'Estou com medo',
    cat: 'sentimentos'
  },

  {
    id: 'comdor',
    label: 'Com dor',
    emoji: '',
    description: 'Estou com dor',
    cat: 'sentimentos'
  },

  {
    id: 'bem',
    label: 'Bem',
    emoji: '',
    description: 'Estou bem',
    cat: 'sentimentos'
  },



  {
    id: 'brincar',
    label: 'Brincar',
    emoji: '',
    description: 'Quero brincar',
    cat: 'atividades'
  },

  {
    id: 'jogar',
    label: 'Jogar',
    emoji: '',
    description: 'Quero jogar',
    cat: 'atividades'
  },

  {
    id: 'assistir',
    label: 'Assistir',
    emoji: '',
    description: 'Quero assistir',
    cat: 'atividades'
  },

  {
    id: 'desenhar',
    label: 'Desenhar',
    emoji: '',
    description: 'Quero desenhar',
    cat: 'atividades'
  },

  {
    id: 'passear',
    label: 'Passear',
    emoji: '',
    description: 'Quero passear',
    cat: 'atividades'
  },

  {
    id: 'musica',
    label: 'Música',
    emoji: '',
    description: 'Quero ouvir música',
    cat: 'atividades'
  },




  {
    id: 'casa',
    label: 'Casa',
    emoji: '',
    description: 'Minha casa',
    cat: 'lugares'
  },

  {
    id: 'escola',
    label: 'Escola',
    emoji: '',
    description: 'Minha escola',
    cat: 'lugares'
  },

  {
    id: 'quarto',
    label: 'Quarto',
    emoji: '',
    description: 'Meu quarto',
    cat: 'lugares'
  },

  {
    id: 'hospital',
    label: 'Hospital',
    emoji: '',
    description: 'Preciso ir ao hospital',
    cat: 'lugares'
  },

  {
    id: 'sair',
    label: 'Sair',
    emoji: '',
    description: 'Quero sair',
    cat: 'lugares'
  }
];




const SUGGESTIONS = {

  eu: ['quero', 'preciso', 'estou', 'gosto', 'vou'],

  voce: ['quero', 'preciso', 'estou', 'gosto', 'vou'],

  mae: ['quero', 'preciso', 'estou', 'gosto', 'vou'],

  pai: ['quero', 'preciso', 'estou', 'gosto', 'vou'],

  quero: [
    'agua',
    'comida',
    'brincar',
    'dormir',
    'sair',
    'casa'
  ],

  preciso: [
    'agua',
    'comida',
    'banheiro',
    'dormir',
    'ajuda'
  ],

  estou: [
    'feliz',
    'triste',
    'cansado',
    'comdor',
    'commedo',
    'bem'
  ],

  gosto: [
    'brincar',
    'desenhar',
    'assistir',
    'passear',
    'musica'
  ],

  vou: [
    'casa',
    'escola',
    'passear',
    'dormir',
    'banheiro'
  ]
};




const CHALLENGES = [

  {
    emoji: '',
    prompt: 'Você está com sede. O que você quer dizer?',
    target: ['eu', 'quero', 'agua']
  },

  {
    emoji: '',
    prompt: 'Você está com fome.',
    target: ['eu', 'quero', 'comida']
  },

  {
    emoji: '',
    prompt: 'Você está cansado e quer descansar.',
    target: ['eu', 'estou', 'cansado']
  },

  {
    emoji: '',
    prompt: 'Você precisa ir ao banheiro.',
    target: ['eu', 'preciso', 'banheiro']
  },

  {
    emoji: '',
    prompt: 'Você quer se divertir um pouco.',
    target: ['eu', 'quero', 'brincar']
  }

];




let STATE = {

  screen: 'home',

  phrase: [],

  categoryOpen: null,

  challenge: null,

  toastTimer: null,

  data: {

    favWords: [],

    favPhrases: [],

    customWords: [],

    customCategories: [],

    profile: {
      name: '',
      stars: 0
    }

  }

};




function allCategories() {

  return DEFAULT_CATEGORIES.concat(
    STATE.data.customCategories
  );

}


function allWords() {

  return DEFAULT_WORDS.concat(
    STATE.data.customWords
  );

}


function wordById(id) {

  return allWords().find(
    word => word.id === id
  );

}




const STORAGE_KEY = 'comunica:data';


function loadData() {

  try {

    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {

      const parsed = JSON.parse(raw);

      STATE.data = {

        ...STATE.data,

        ...parsed,

        profile: {
          ...STATE.data.profile,
          ...(parsed.profile || {})
        }

      };

    }

  } catch (error) {

    console.error(
      'Erro ao carregar os dados:',
      error
    );

  }

  render();

}


function saveData() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(STATE.data)
    );

  } catch (error) {

    console.error(
      'Erro ao salvar os dados:',
      error
    );

  }

}




function showToast(message) {

  const toast =
    document.getElementById('toast');

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add('show');

  clearTimeout(STATE.toastTimer);

  STATE.toastTimer = setTimeout(() => {

    toast.classList.remove('show');

  }, 1800);

}




function speak(text) {

  if (!('speechSynthesis' in window)) {

    showToast(
      'A voz não é suportada neste navegador.'
    );

    return;

  }

  if (!text) return;

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang = 'pt-BR';

  const voices =
    window.speechSynthesis.getVoices();

  const ptVoice =
    voices.find(voice =>
      voice.lang &&
      voice.lang.toLowerCase().startsWith('pt')
    );

  if (ptVoice) {

    utterance.voice = ptVoice;

  }

  window.speechSynthesis.cancel();

  window.speechSynthesis.speak(
    utterance
  );

}



function go(screen, extra = {}) {

  STATE.screen = screen;

  Object.assign(
    STATE,
    extra
  );

  render();

  window.scrollTo(
    0,
    0
  );

}



function addWordToPhrase(word) {

  STATE.phrase.push(word);

  render();

}


function eraseLast() {

  if (STATE.phrase.length > 0) {

    STATE.phrase.pop();

  }

  render();

}


function clearPhrase() {

  STATE.phrase = [];

  render();

}


function currentPhraseText() {

  return STATE.phrase
    .map(word => word.label)
    .join(' ');

}




function favoritePhrase() {

  if (STATE.phrase.length === 0) {

    showToast(
      'Monte uma frase primeiro.'
    );

    return;

  }

  const text =
    currentPhraseText();

  if (
    !STATE.data.favPhrases.includes(text)
  ) {

    STATE.data.favPhrases.push(text);

    saveData();

    showToast(
      'Frase adicionada aos favoritos '
    );

  } else {

    showToast(
      'Essa frase já está nos favoritos.'
    );

  }

  render();

}




function render() {

  const app =
    document.getElementById('app');

  if (!app) return;

  let html = '';

  switch (STATE.screen) {

    case 'home':
      html = renderHome();
      break;

    case 'build':
      html = renderBuild();
      break;

    case 'categories':
      html = renderCategories();
      break;

    case 'categoryDetail':
      html = renderCategoryDetail();
      break;

    case 'favorites':
      html = renderFavorites();
      break;

    case 'personalize':
      html = renderPersonalize();
      break;

    case 'challenge':
      html = renderChallenge();
      break;

    case 'profile':
      html = renderProfile();
      break;

    case 'about':
      html = renderAbout();
      break;

    default:
      html = renderHome();

  }

  app.innerHTML = html;

  attachHandlers();

}


function renderHome() {

  return `

    <div class="topbar">

      <div></div>

      <button
        class="icon-btn"
        data-go="profile"
        title="Perfil"
      >
        
      </button>

    </div>


    <section class="brand-intro" aria-labelledby="home-title">
      <h1 id="home-title">ComunicA</h1>
      <p>Comunicação simples, clara e no seu ritmo.</p>
    </section>


    <div class="menu">

      <div
        class="menu-btn primary"
        data-go="build"
      >

        <div class="menu-emoji">
          
        </div>

        <div class="menu-text">

          <div class="menu-title">
            COMEÇAR A COMUNICAR
          </div>

          <div class="menu-sub">
            Monte sua frase
          </div>

        </div>

        <div class="menu-arrow">
          ›
        </div>

      </div>


      <div
        class="menu-btn"
        data-go="favorites"
      >

        <div class="menu-emoji">
          
        </div>

        <div class="menu-text">

          <div class="menu-title">
            FAVORITOS
          </div>

          <div class="menu-sub">
            Frases e palavras favoritas
          </div>

        </div>

        <div class="menu-arrow">
          ›
        </div>

      </div>


      <div
        class="menu-btn"
        data-go="categories"
      >

        <div class="menu-emoji">
          
        </div>

        <div class="menu-text">

          <div class="menu-title">
            CATEGORIAS
          </div>

          <div class="menu-sub">
            Palavras organizadas por temas
          </div>

        </div>

        <div class="menu-arrow">
          ›
        </div>

      </div>


      <div
        class="menu-btn"
        data-go="personalize"
      >

        <div class="menu-emoji">
          
        </div>

        <div class="menu-text">

          <div class="menu-title">
            PERSONALIZAR
          </div>

          <div class="menu-sub">
            Adicione suas próprias palavras
          </div>

        </div>

        <div class="menu-arrow">
          ›
        </div>

      </div>


      <div
        class="menu-btn"
        data-go="challenge"
      >

        <div class="menu-emoji">
          
        </div>

        <div class="menu-text">

          <div class="menu-title">
            DESAFIO DA COMUNICAÇÃO
          </div>

          <div class="menu-sub">
            Aprenda brincando
          </div>

        </div>

        <div class="menu-arrow">
          ›
        </div>

      </div>

    </div>


    <div
      class="about-link"
      data-go="about"
    >
      Sobre o Comunica
    </div>

  `;

}


function wordCardHtml(word, selected = false) {

  return `

    <div
      class="word-card ${selected ? 'selected' : ''}"
      data-word="${word.id}"
    >

      <div class="emoji">
        ${word.emoji}
      </div>

      <div class="label">
        ${word.label}
      </div>

      <div class="description">
        ${word.description || 'Toque para adicionar'}
      </div>

    </div>

  `;

}


function renderBuild() {

  const last =
    STATE.phrase[
      STATE.phrase.length - 1
    ];


  let suggestedIds;

  if (last) {

    suggestedIds =
      SUGGESTIONS[last.id];

  } else {

    suggestedIds = [
      'eu',
      'voce',
      'mae',
      'pai'
    ];

  }


  let words;

  let sectionLabel;


  if (suggestedIds) {

    words =
      suggestedIds
        .map(wordById)
        .filter(Boolean);

    sectionLabel =
      last
        ? 'Sugestões para você'
        : 'Escolha quem fala';

  } else {

    words =
      allWords().filter(
        word =>
          word.cat !== 'acoes' &&
          word.cat !== 'pessoas'
      );

    sectionLabel =
      'Escolha uma palavra';

  }


  const chipHtml =
    STATE.phrase.length

      ? STATE.phrase
          .map(word => `

            <span class="phrase-chip">
              ${word.emoji}
              ${word.label}
            </span>

          `)
          .join('')

      : `

        <span class="phrase-placeholder">
          Toque nas palavras abaixo para montar sua frase...
        </span>

      `;


  return `

    <div class="topbar">

      <button
        class="icon-btn"
        data-go="home"
      >
        ←
      </button>

      <div class="topbar-title">
        Comunicar
      </div>

      <button
        class="icon-btn"
        data-go="personalize"
      >
        
      </button>

    </div>


    <div class="screen">

      <div class="section-label">
        MINHA FRASE
      </div>


      <div class="phrase-bar">

        ${chipHtml}

      </div>


      <button
        class="speak-btn"
        id="speakBtn"
        ${STATE.phrase.length ? '' : 'disabled'}
      >
         FALAR
      </button>


      <div class="action-row">

        <button
          class="btn-erase"
          id="eraseBtn"
        >
          ⌫ Apagar
        </button>

        <button
          class="btn-clear"
          id="clearBtn"
        >
           Limpar
        </button>

        <button
          class="btn-fav"
          id="favPhraseBtn"
        >
           Favoritar
        </button>

      </div>


      <div class="section-label">
        ${sectionLabel.toUpperCase()}
      </div>


      <div class="word-grid">

        ${words
          .map(word =>
            wordCardHtml(word, false)
          )
          .join('')}

      </div>


      <div style="margin-top:16px;">

        <div
          class="back-link"
          data-go="categories"
        >
           Ver todas as categorias
        </div>

      </div>

    </div>

  `;

}




function renderCategories() {

  const categories =
    allCategories();


  return `

    <div class="topbar">

      <button
        class="icon-btn"
        data-go="home"
      >
        ←
      </button>

      <div class="topbar-title">
        Categorias
      </div>

      <div style="width:44px"></div>

    </div>


    <div class="screen">

      <div class="cat-grid">

        ${categories
          .map(category => {

            const count =
              allWords()
                .filter(
                  word =>
                    word.cat === category.id
                )
                .length;


            return `

              <div
                class="cat-card"
                data-category="${category.id}"
              >

                <span class="emoji">
                  ${category.emoji}
                </span>

                <div class="label">
                  ${category.label}
                </div>

                <div class="count">
                  ${count} palavras
                </div>

              </div>

            `;

          })
          .join('')}

      </div>

    </div>

  `;

}




function renderCategoryDetail() {

  const category =
    allCategories().find(
      item =>
        item.id === STATE.categoryOpen
    );


  const words =
    allWords().filter(
      word =>
        word.cat === STATE.categoryOpen
    );


  return `

    <div class="topbar">

      <button
        class="icon-btn"
        data-go="categories"
      >
        ←
      </button>

      <div class="topbar-title">

        ${
          category
            ? `${category.emoji} ${category.label}`
            : 'Categoria'
        }

      </div>

      <div style="width:44px"></div>

    </div>


    <div class="screen">

      <div class="section-label">
        TOQUE PARA ADICIONAR À FRASE
      </div>


      <div class="word-grid">

        ${words
          .map(word =>
            wordCardHtml(word, false)
          )
          .join('')}

      </div>


      ${
        STATE.phrase.length

          ? `

            <div style="margin-top:18px;">

              <div class="section-label">
                MINHA FRASE
              </div>

              <div class="phrase-bar">

                ${STATE.phrase
                  .map(word => `

                    <span class="phrase-chip">
                      ${word.emoji}
                      ${word.label}
                    </span>

                  `)
                  .join('')}

              </div>


              <button
                class="speak-btn"
                id="speakBtn"
              >
                 FALAR
              </button>

            </div>

          `

          : ''
      }

    </div>

  `;

}




function renderFavorites() {

  const favWordObjects =
    STATE.data.favWords
      .map(wordById)
      .filter(Boolean);


  return `

    <div class="topbar">

      <button
        class="icon-btn"
        data-go="home"
      >
        ←
      </button>

      <div class="topbar-title">
        Favoritos
      </div>

      <div style="width:44px"></div>

    </div>


    <div class="screen">

      <div class="section-label">
        FRASES FAVORITAS
      </div>


      ${
        STATE.data.favPhrases.length === 0

          ? `

            <div class="empty-state">

              Nenhuma frase favoritada ainda.

              <br>

              Monte uma frase e toque em
               Favoritar.

            </div>

          `

          : STATE.data.favPhrases
              .map(
                (phrase, index) => `

                  <div class="fav-item">

                    <div class="txt">
                       ${phrase}
                    </div>

                    <button
                      data-speak="${phrase}"
                    >
                      
                    </button>

                    <button
                      class="fav-remove"
                      data-remove-phrase="${index}"
                    >
                      ✕
                    </button>

                  </div>

                `
              )
              .join('')
      }


      <div
        class="section-label"
        style="margin-top:18px;"
      >
        PALAVRAS FAVORITAS
      </div>


      ${
        favWordObjects.length === 0

          ? `

            <div class="empty-state">
              Nenhuma palavra favorita ainda.
            </div>

          `

          : `

            <div class="word-grid">

              ${favWordObjects
                .map(word =>
                  wordCardHtml(word, false)
                )
                .join('')}

            </div>

          `
      }

    </div>

  `;

}



function renderPersonalize() {

  const customWordsHtml =
    STATE.data.customWords
      .map(word => `

        <span class="custom-chip">

          ${word.emoji}
          ${word.label}

          <span
            class="x"
            data-del-word="${word.id}"
          >
            ✕
          </span>

        </span>

      `)
      .join('')

      ||

      `
        <span
          style="
            color:var(--text-muted);
            font-weight:600;
            font-size:13px;
          "
        >
          Nenhuma palavra personalizada ainda.
        </span>
      `;


  const customCategoriesHtml =
    STATE.data.customCategories
      .map(category => `

        <span class="custom-chip">

          ${category.emoji}
          ${category.label}

          <span
            class="x"
            data-del-cat="${category.id}"
          >
            ✕
          </span>

        </span>

      `)
      .join('')

      ||

      `
        <span
          style="
            color:var(--text-muted);
            font-weight:600;
            font-size:13px;
          "
        >
          Nenhuma categoria personalizada ainda.
        </span>
      `;


  const categoryOptions =
    allCategories()
      .map(
        category => `

          <option value="${category.id}">
            ${category.emoji} ${category.label}
          </option>

        `
      )
      .join('');


  const emojiChoices = [
    '⭐',
    '🎈',
    '⚽',
    '📱',
    '🧦',
    '🧴',
    '🚗',
    '🐶',
    '🐱',
    '📖',
    '🍰',
    '🎧',
    '🧩',
    '🛁'
  ];


  return `

    <div class="topbar">

      <button
        class="icon-btn"
        data-go="home"
      >
        ←
      </button>

      <div class="topbar-title">
        Personalizar
      </div>

      <div style="width:44px"></div>

    </div>


    <div class="screen">


      <!-- ADICIONAR PALAVRA -->

      <div class="form-block">

        <h3>
           Adicionar palavra
        </h3>


        <div class="form-row">

          <input
            type="text"
            id="newWordLabel"
            placeholder="Ex: Bola"
          >


          <select id="newWordCat">

            ${categoryOptions}

          </select>

        </div>


        <div
          class="emoji-row"
          id="emojiRowWord"
        >

          ${emojiChoices
            .map(
              (emoji, index) => `

                <div
                  class="emoji-pick ${
                    index === 0
                      ? 'chosen'
                      : ''
                  }"
                  data-emoji="${emoji}"
                >
                  ${emoji}
                </div>

              `
            )
            .join('')}

        </div>


        <button
          class="submit-btn"
          id="addWordBtn"
        >
          Adicionar palavra
        </button>


        <div class="custom-list">

          ${customWordsHtml}

        </div>

      </div>


      <!-- CRIAR CATEGORIA -->

      <div class="form-block">

        <h3>
           Criar categoria
        </h3>


        <div class="form-row">

          <input
            type="text"
            id="newCatLabel"
            placeholder="Ex: Minhas coisas"
          >

        </div>


        <div
          class="emoji-row"
          id="emojiRowCat"
        >

          ${emojiChoices
            .map(
              (emoji, index) => `

                <div
                  class="emoji-pick ${
                    index === 0
                      ? 'chosen'
                      : ''
                  }"
                  data-emoji="${emoji}"
                >
                  ${emoji}
                </div>

              `
            )
            .join('')}

        </div>


        <button
          class="submit-btn"
          id="addCatBtn"
        >
          Criar categoria
        </button>


        <div class="custom-list">

          ${customCategoriesHtml}

        </div>

      </div>


    </div>

  `;

}




function renderChallenge() {

  if (!STATE.challenge) {

    STATE.challenge =
      CHALLENGES[
        Math.floor(
          Math.random() *
          CHALLENGES.length
        )
      ];

    STATE.phrase = [];

  }


  const challenge =
    STATE.challenge;


  const done =
    STATE.phrase.length > 0 &&
    STATE.phrase
      .map(word => word.id)
      .join(',') ===
    challenge.target.join(',');


  const targetWords =
    allWords()
      .filter(
        word =>
          challenge.target.includes(
            word.id
          )
      );


  const targetCategories =
    new Set(
      targetWords.map(
        word => word.cat
      )
    );


  const distractors =
    allWords()
      .filter(
        word =>
          targetCategories.has(
            word.cat
          ) &&
          !challenge.target.includes(
            word.id
          )
      )
      .slice(0, 3);


  let options =
    targetWords
      .concat(distractors);


  options =
    options.sort(
      () => Math.random() - 0.5
    );


  return `

    <div class="topbar">

      <button
        class="icon-btn"
        data-go="home"
      >
        ←
      </button>

      <div class="topbar-title">
        Desafio
      </div>

      <div style="width:44px"></div>

    </div>


    <div class="screen">


      <div class="stars">
         ${STATE.data.profile.stars}
        estrelas
      </div>


      <div class="challenge-card">

        <div class="emoji">
          ${challenge.emoji}
        </div>

        <p>
          ${challenge.prompt}
        </p>

      </div>


      <div class="section-label">
        MINHA FRASE
      </div>


      <div class="phrase-bar">

        ${
          STATE.phrase.length

            ? STATE.phrase
                .map(word => `

                  <span class="phrase-chip">
                    ${word.emoji}
                    ${word.label}
                  </span>

                `)
                .join('')

            : `

              <span class="phrase-placeholder">
                Monte a frase certa...
              </span>

            `
        }

      </div>


      <div class="action-row">

        <button
          class="btn-erase btn-comunica"
          id="eraseBtn"
        >
           Apagar
        </button>

        <button
          class="btn-clear btn-comunica"
          id="clearBtn"
        >
           Limpar
        </button>

      </div>


      <div class="section-label btn-comunica">
        MONTE A RESPOSTA
      </div>


      <div class="word-grid">

        ${options
          .map(word =>
            wordCardHtml(word, false)
          )
          .join('')}

      </div>


      ${
        done

          ? `

            <button
              class="speak-btn"
              id="challengeWinBtn"
            >
               Muito bem! Ganhar estrela
            </button>

          `

          : `

            <button
              class="speak-btn"
              id="speakBtn"
              ${
                STATE.phrase.length
                  ? ''
                  : 'disabled'
              }
            >
               Ouvir minha frase
            </button>

          `
      }


      <div
        class="back-link"
        style="margin-top:14px;"
        id="skipChallenge"
      >
        ↻ Tentar outro desafio
      </div>


    </div>

  `;

}




function renderProfile() {

  const profile =
    STATE.data.profile;


  return `

    <div class="topbar">

      <button
        class="icon-btn"
        data-go="home"
      >
        ←
      </button>

      <div class="topbar-title">
        Meu ComunicA
      </div>

      <div style="width:44px"></div>

    </div>


    <div class="screen">


      <div class="form-block">

        <h3>
          Nome
        </h3>


        <div class="form-row">

          <input
            type="text"
            id="profileName"
            placeholder="Como você se chama?"
            value="${profile.name || ''}"
          >

        </div>


        <button
          class="submit-btn"
          id="saveNameBtn"
        >
          Salvar nome
        </button>

      </div>


      <div class="info-block">

        <div class="profile-stat">

          <span>
             Estrelas conquistadas
          </span>

          <span>
            ${profile.stars}
          </span>

        </div>


        <div class="profile-stat">

          <span>
             Frases favoritas
          </span>

          <span>
            ${STATE.data.favPhrases.length}
          </span>

        </div>


        <div class="profile-stat">

          <span>
             Palavras favoritas
          </span>

          <span>
            ${STATE.data.favWords.length}
          </span>

        </div>


        <div
          class="profile-stat"
          style="border-bottom:none;"
        >

          <span>
             Categorias criadas
          </span>

          <span>
            ${STATE.data.customCategories.length}
          </span>

        </div>

      </div>


    </div>

  `;

}




function renderAbout() {

  return `

    <div class="topbar">

      <button
        class="icon-btn"
        data-go="home"
      >
        ←
      </button>

      <div class="topbar-title">
        Sobre
      </div>

      <div style="width:44px"></div>

    </div>


    <div class="screen">


      <div class="info-block">

        <strong>
          ComunicA
        </strong>

        é um aplicativo de
        Comunicação Alternativa e Aumentativa
        (CAA).

        Ele ajuda pessoas a montar frases
        tocando em palavras e imagens,
        e depois ouvir a frase em voz alta.

      </div>


      <div class="info-block">

        Toque em
        <strong>
          Começar a comunicar
        </strong>

        para montar frases, explore as
        <strong>
          Categorias
        </strong>

        para encontrar palavras por tema,
        guarde o que mais usa em
        <strong>
          Favoritos
        </strong>

        e crie suas próprias palavras em
        <strong>
          Personalizar
        </strong>.

      </div>


    </div>

  `;

}



function attachHandlers() {



  document
    .querySelectorAll('[data-go]')
    .forEach(element => {

      element.addEventListener(
        'click',
        () => {

          const target =
            element.getAttribute(
              'data-go'
            );


          const menuTexts = {

            build:
              'Começar a comunicar',

            favorites:
              'Favoritos',

            categories:
              'Categorias',

            personalize:
              'Personalizar',

            challenge:
              'Desafio da comunicação',

            profile:
              'Perfil',

            about:
              'Sobre o Comunica'

          };


          if (menuTexts[target]) {

            speak(
              menuTexts[target]
            );

          }


          if (target === 'challenge') {

            STATE.challenge = null;

          }


          go(target);

        }
      );

    });



  document
    .querySelectorAll('[data-word]')
    .forEach(element => {

      element.addEventListener(
        'click',
        () => {

          const word =
            wordById(
              element.getAttribute(
                'data-word'
              )
            );


          if (!word) return;


          speak(word.label);

          addWordToPhrase(word);

        }
      );

    });



  document
    .querySelectorAll('[data-category]')
    .forEach(element => {

      element.addEventListener(
        'click',
        () => {

          const categoryId =
            element.getAttribute(
              'data-category'
            );


          const category =
            allCategories().find(
              item =>
                item.id === categoryId
            );


          if (category) {

            speak(
              category.label
            );

          }


          go(
            'categoryDetail',
            {
              categoryOpen:
                categoryId
            }
          );

        }
      );

    });



  const speakBtn =
    document.getElementById(
      'speakBtn'
    );


  if (speakBtn) {

    speakBtn.addEventListener(
      'click',
      () => {

        const text =
          currentPhraseText();


        if (text) {

          speak(text);

        }

      }
    );

  }



  const eraseBtn =
    document.getElementById(
      'eraseBtn'
    );


  if (eraseBtn) {

    eraseBtn.addEventListener(
      'click',
      () => {

        speak('Apagar');

        eraseLast();

      }
    );

  }


  

  const clearBtn =
    document.getElementById(
      'clearBtn'
    );


  if (clearBtn) {

    clearBtn.addEventListener(
      'click',
      () => {

        speak(
          'Limpar frase'
        );

        clearPhrase();

      }
    );

  }


  const favPhraseBtn =
    document.getElementById(
      'favPhraseBtn'
    );


  if (favPhraseBtn) {

    favPhraseBtn.addEventListener(
      'click',
      () => {

        if (
          STATE.phrase.length > 0
        ) {

          speak('Favoritado');

        }

        favoritePhrase();

      }
    );

  }


  

  document
    .querySelectorAll('[data-speak]')
    .forEach(element => {

      element.addEventListener(
        'click',
        event => {

          event.stopPropagation();

          speak(
            element.getAttribute(
              'data-speak'
            )
          );

        }
      );

    });


  

  document
    .querySelectorAll(
      '[data-remove-phrase]'
    )
    .forEach(element => {

      element.addEventListener(
        'click',
        event => {

          event.stopPropagation();


          const index =
            parseInt(
              element.getAttribute(
                'data-remove-phrase'
              ),
              10
            );


          if (
            Number.isNaN(index)
          ) {

            return;

          }


          STATE.data.favPhrases.splice(
            index,
            1
          );


          saveData();

          render();

        }
      );

    });


  
  document
    .querySelectorAll(
      '#emojiRowWord .emoji-pick'
    )
    .forEach(element => {

      element.addEventListener(
        'click',
        () => {

          document
            .querySelectorAll(
              '#emojiRowWord .emoji-pick'
            )
            .forEach(item => {

              item.classList.remove(
                'chosen'
              );

            });


          element.classList.add(
            'chosen'
          );

        }
      );

    });


  

  document
    .querySelectorAll(
      '#emojiRowCat .emoji-pick'
    )
    .forEach(element => {

      element.addEventListener(
        'click',
        () => {

          document
            .querySelectorAll(
              '#emojiRowCat .emoji-pick'
            )
            .forEach(item => {

              item.classList.remove(
                'chosen'
              );

            });


          element.classList.add(
            'chosen'
          );

        }
      );

    });


  

  const addWordBtn =
    document.getElementById(
      'addWordBtn'
    );


  if (addWordBtn) {

    addWordBtn.addEventListener(
      'click',
      () => {

        const input =
          document.getElementById(
            'newWordLabel'
          );


        const category =
          document.getElementById(
            'newWordCat'
          );


        if (!input || !category) {

          return;

        }


        const label =
          input.value.trim();


        const cat =
          category.value;


        const chosen =
          document.querySelector(
            '#emojiRowWord .chosen'
          );


        const emoji =
          chosen
            ? chosen.getAttribute(
                'data-emoji'
              )
            : '';


        if (!label) {

          showToast(
            'Digite uma palavra'
          );

          speak(
            'Digite uma palavra'
          );

          return;

        }


        const id =
          'c_' +
          label
            .toLowerCase()
            .normalize('NFD')
            .replace(
              /[\u0300-\u036f]/g,
              ''
            )
            .replace(
              /[^a-z0-9]+/g,
              '_'
            ) +
          '_' +
          Date.now();


        STATE.data.customWords.push({

          id,

          label,

          emoji,

          description:
            `Toque para usar "${label}"`,

          cat

        });


        saveData();


        showToast(
          'Palavra adicionada!'
        );


        speak(label);


        render();

      }
    );

  }


  

  const addCatBtn =
    document.getElementById(
      'addCatBtn'
    );


  if (addCatBtn) {

    addCatBtn.addEventListener(
      'click',
      () => {

        const input =
          document.getElementById(
            'newCatLabel'
          );


        if (!input) return;


        const label =
          input.value.trim();


        const chosen =
          document.querySelector(
            '#emojiRowCat .chosen'
          );


        const emoji =
          chosen
            ? chosen.getAttribute(
                'data-emoji'
              )
            : '';


        if (!label) {

          showToast(
            'Digite um nome de categoria'
          );

          speak(
            'Digite uma categoria'
          );

          return;

        }


        const id =
          'cc_' +
          label
            .toLowerCase()
            .normalize('NFD')
            .replace(
              /[\u0300-\u036f]/g,
              ''
            )
            .replace(
              /[^a-z0-9]+/g,
              '_'
            ) +
          '_' +
          Date.now();


        STATE.data.customCategories.push({

          id,

          label,

          emoji,

          custom: true

        });


        saveData();


        showToast(
          'Categoria criada!'
        );


        speak(label);


        render();

      }
    );

  }


  

  document
    .querySelectorAll(
      '[data-del-word]'
    )
    .forEach(element => {

      element.addEventListener(
        'click',
        event => {

          event.stopPropagation();


          const id =
            element.getAttribute(
              'data-del-word'
            );


          STATE.data.customWords =
            STATE.data.customWords.filter(
              word =>
                word.id !== id
            );


          STATE.data.favWords =
            STATE.data.favWords.filter(
              wordId =>
                wordId !== id
            );


          saveData();

          render();

        }
      );

    });



  document
    .querySelectorAll(
      '[data-del-cat]'
    )
    .forEach(element => {

      element.addEventListener(
        'click',
        event => {

          event.stopPropagation();


          const id =
            element.getAttribute(
              'data-del-cat'
            );


          STATE.data.customCategories =
            STATE.data.customCategories.filter(
              category =>
                category.id !== id
            );


          STATE.data.customWords =
            STATE.data.customWords.filter(
              word =>
                word.cat !== id
            );


          saveData();

          render();

        }
      );

    });


  

  const saveNameBtn =
    document.getElementById(
      'saveNameBtn'
    );


  if (saveNameBtn) {

    saveNameBtn.addEventListener(
      'click',
      () => {

        const input =
          document.getElementById(
            'profileName'
          );


        if (!input) return;


        STATE.data.profile.name =
          input.value.trim();


        saveData();


        showToast(
          'Nome salvo!'
        );


        speak(
          'Nome salvo'
        );

      }
    );

  }


  

  const challengeWinBtn =
    document.getElementById(
      'challengeWinBtn'
    );


  if (challengeWinBtn) {

    challengeWinBtn.addEventListener(
      'click',
      () => {

        STATE.data.profile.stars += 1;


        saveData();


        speak(
          'Muito bem! Você ganhou uma estrela!'
        );


        showToast(
          ' Muito bem! +1 estrela'
        );


        STATE.challenge = null;

        STATE.phrase = [];


        render();

      }
    );

  }


 

  const skipChallenge =
    document.getElementById(
      'skipChallenge'
    );


  if (skipChallenge) {

    skipChallenge.addEventListener(
      'click',
      () => {

        STATE.challenge = null;

        STATE.phrase = [];


        render();

      }
    );

  }

}

loadData();

/* ---------- Música somente no primeiro clique do cadastro ---------- */
function iniciarMusicaNoCadastro() {
  const musica = document.getElementById('appMusic');

  if (!musica) {
    console.error('Áudio #appMusic não encontrado no HTML.');
    return;
  }

  musica.loop = true;
  musica.volume = 0.35;

  musica.play()
    .then(() => {
      console.log('Música iniciada no cadastro.');
    })
    .catch((erro) => {
      console.error('Não foi possível iniciar a música:', erro);
    });
}

function configurarMusicaNoCadastro() {
  const botaoCadastro = document.getElementById('saveNameBtn');

  if (!botaoCadastro) {
    console.warn('Botão #saveNameBtn não encontrado.');
    return;
  }

  botaoCadastro.addEventListener(
    'click',
    iniciarMusicaNoCadastro,
    { once: true }
  );
}

configurarMusicaNoCadastro();
