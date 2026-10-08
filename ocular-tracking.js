(() => {
  'use strict';

  const STORAGE_KEY = 'comunica:ocular-settings-v1';
  const WEBGAZER_URL = 'https://webgazer.cs.brown.edu/webgazer.js';
  const DEFAULTS = { enabled: false, dwellMs: 1200, sound: true };
  const CAMERA_CONSTRAINTS = {
    audio: false,
    video: {
      facingMode: { ideal: 'user' },
      width: { ideal: 640 },
      height: { ideal: 480 }
    }
  };
  const GAZE_SAMPLE_LIMIT = 7;
  const GAZE_SMOOTHING = 0.1;
  const GAZE_DEADZONE_PX = 3.5;
  const GAZE_MAX_STEP_PX = 18;
  const readSettings = () => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch (_) { return { ...DEFAULTS }; }
  };
  const settings = readSettings();
  const state = {
    ...settings,
    webgazer: null,
    starting: null,
    running: false,
    calibrated: false,
    calibrationActive: false,
    calibrationIndex: 0,
    x: null,
    y: null,
    lastPredictionAt: 0,
    gazeSamples: [],
    candidate: null,
    candidateSince: 0,
    candidateTimer: 0,
    lockedCenter: null,
    pauseOnHide: false
  };

  const calibrationGrid = [[8, 10], [50, 10], [92, 10], [8, 50], [50, 50], [92, 50], [8, 90], [50, 90], [92, 90]];
  const points = calibrationGrid.flatMap(point => [point, point]);
  let statusNode;
  let floatingButton;
  let gazeCursor;
  let calibrationOverlay;
  let calibrationPoint;
  let calibrationText;
  let calibrationProgress;
  let settingsObserver;
  let statusTimer = 0;

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled: state.enabled, dwellMs: state.dwellMs, sound: state.sound }));
    } catch (_) { /* O controle continua nesta sessão se o armazenamento estiver indisponível. */ }
  }

  function setStatus(message) {
    if (statusNode) {
      statusNode.textContent = message;
      statusNode.classList.add('ocular-status-visible');
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => statusNode.classList.remove('ocular-status-visible'), 5000);
    }
    const settingsStatus = document.getElementById('ocularSettingsStatus');
    if (settingsStatus) settingsStatus.textContent = message;
  }

  function syncControls() {
    if (floatingButton) {
      floatingButton.textContent = state.running ? '👁 Controle ocular: ligado' : state.enabled ? '👁 Retomar controle ocular' : '👁 Ativar controle ocular';
      floatingButton.setAttribute('aria-pressed', String(state.running));
      floatingButton.dataset.active = String(state.running);
      floatingButton.title = state.running ? 'Desligar controle ocular e liberar a câmera' : 'Ativar ou retomar controle ocular';
      floatingButton.setAttribute('aria-label', state.running ? 'Desativar controle ocular e liberar a câmera' : state.enabled ? 'Retomar controle ocular' : 'Ativar controle ocular');
    }
    const toggle = document.getElementById('ocularEnabledToggle');
    if (toggle) toggle.checked = Boolean(state.enabled);
    const range = document.getElementById('ocularDwellRange');
    const output = document.getElementById('ocularDwellValue');
    if (range) range.value = String(state.dwellMs);
    if (output) output.textContent = `${(state.dwellMs / 1000).toFixed(1).replace('.', ',')} s`;
    const calibrate = document.getElementById('ocularCalibrateButton');
    if (calibrate) calibrate.disabled = !state.running;
  }

  function appendStylesheet() {
    if (document.getElementById('ocularControlsStyles')) return;
    const link = document.createElement('link');
    link.id = 'ocularControlsStyles';
    link.rel = 'stylesheet';
    link.href = new URL('ocular-controls.css', location.href).href;
    document.head.appendChild(link);
  }

  function buildGlobalControls() {
    appendStylesheet();

    floatingButton = document.createElement('button');
    floatingButton.id = 'ocularFloatingButton';
    floatingButton.type = 'button';
    floatingButton.className = 'ocular-floating-control';
    floatingButton.setAttribute('aria-label', 'Ativar controle ocular');
    floatingButton.addEventListener('click', toggleControl);
    document.body.appendChild(floatingButton);

    statusNode = document.createElement('div');
    statusNode.id = 'ocularLiveStatus';
    statusNode.className = 'ocular-live-status';
    statusNode.setAttribute('role', 'status');
    statusNode.setAttribute('aria-live', 'polite');
    document.body.appendChild(statusNode);

    gazeCursor = document.createElement('div');
    gazeCursor.id = 'ocularGazeCursor';
    gazeCursor.className = 'ocular-gaze-cursor';
    gazeCursor.setAttribute('aria-hidden', 'true');
    gazeCursor.hidden = true;
    gazeCursor.innerHTML = '<span></span>';
    document.body.appendChild(gazeCursor);

    calibrationOverlay = document.createElement('div');
    calibrationOverlay.id = 'ocularCalibrationOverlay';
    calibrationOverlay.className = 'ocular-calibration-overlay';
    calibrationOverlay.hidden = true;
    calibrationOverlay.innerHTML = `
      <section class="ocular-calibration-message" role="status" aria-live="polite">
        <strong>Calibrar controle ocular</strong>
        <span id="ocularCalibrationText">Olhe para o centro do ponto e toque ou clique nele.</span>
        <span id="ocularCalibrationProgress">Ponto 1 de 9</span>
      </section>
      <button id="ocularCalibrationPoint" class="ocular-calibration-point" type="button" aria-label="Confirmar ponto de calibração"></button>
      <button id="ocularCancelCalibration" class="ocular-calibration-cancel" type="button">Cancelar calibração</button>`;
    document.body.appendChild(calibrationOverlay);
    calibrationPoint = document.getElementById('ocularCalibrationPoint');
    calibrationText = document.getElementById('ocularCalibrationText');
    calibrationProgress = document.getElementById('ocularCalibrationProgress');
    calibrationPoint.addEventListener('click', advanceCalibration);
    document.getElementById('ocularCancelCalibration').addEventListener('click', cancelCalibration);

    syncControls();
  }

  function findSettingsPanel() {
    const app = document.getElementById('app');
    if (!app) { document.body.classList.remove('ocular-on-settings'); return null; }
    const title = [...app.querySelectorAll('.topbar-title, h1, h2')]
      .find(node => node.textContent.trim().toLocaleLowerCase('pt-BR') === 'configurações');
    if (!title) { document.body.classList.remove('ocular-on-settings'); return null; }
    const panel = app.querySelector('.settings-panel') || app.querySelector('.form-block') || app.querySelector('.screen');
    document.body.classList.toggle('ocular-on-settings', Boolean(panel));
    return panel;
  }

  function injectSettingsControl() {
    const panel = findSettingsPanel();
    if (!panel || panel.querySelector('#ocularSettingsBlock')) return;

    const block = document.createElement('section');
    block.id = 'ocularSettingsBlock';
    block.className = 'ocular-settings-block';
    block.setAttribute('aria-labelledby', 'ocularSettingsHeading');
    block.innerHTML = `
      <h2 id="ocularSettingsHeading" class="ocular-settings-heading">Controle ocular</h2>
      <div class="settings-row ocular-settings-toggle-row">
        <div>
          <div class="settings-label">Usar o olhar para selecionar</div>
          <div class="settings-desc" id="ocularEnabledDescription">Ativa a câmera e permite selecionar botões olhando para eles. Ao ativar, autorize a câmera e faça a calibração.</div>
        </div>
        <label class="switch" aria-label="Ativar controle ocular">
          <input id="ocularEnabledToggle" type="checkbox" aria-describedby="ocularEnabledDescription">
          <span class="switch-track"></span>
        </label>
      </div>
      <div class="ocular-setting-detail">
        <label for="ocularDwellRange"><span class="settings-label">Tempo do olhar</span><span class="settings-desc">Tempo que o olhar precisa ficar sobre um controle para selecioná-lo.</span></label>
        <div class="ocular-dwell-control"><input id="ocularDwellRange" type="range" min="600" max="3000" step="100"><output id="ocularDwellValue" for="ocularDwellRange"></output></div>
      </div>
      <div class="settings-row ocular-calibration-row">
        <div><div class="settings-label">Calibração</div><div class="settings-desc">Refaça os nove pontos se a seleção ficar imprecisa.</div></div>
        <button id="ocularCalibrateButton" class="ocular-calibrate-button" type="button">Calibrar olhar</button>
      </div>
      <p id="ocularSettingsStatus" class="ocular-settings-status" role="status" aria-live="polite"></p>
      <p class="ocular-privacy-note">A análise é feita neste navegador. As imagens da câmera não são enviadas pelo app; a calibração não é guardada após fechar a sessão. Requer HTTPS ou localhost.</p>`;
    panel.appendChild(block);
    document.getElementById('ocularSettingsStatus').textContent = state.enabled
      ? 'Controle ocular ativado. Se a câmera não conectar, toque no botão flutuante para retomá-la.'
      : 'Controle ocular desligado. Toque e teclado continuam disponíveis.';

    const toggle = document.getElementById('ocularEnabledToggle');
    toggle.checked = Boolean(state.enabled);
    toggle.addEventListener('change', async () => {
      state.enabled = toggle.checked;
      persist();
      syncControls();
      if (state.enabled) {
        const ok = await startTracking();
        if (!ok) {
          state.enabled = false;
          persist();
          syncControls();
        }
      } else {
        await stopTracking('Controle ocular desligado; a câmera foi liberada.');
        syncControls();
      }
    });

    const range = document.getElementById('ocularDwellRange');
    range.value = String(state.dwellMs);
    range.addEventListener('input', () => {
      state.dwellMs = Number(range.value);
      clearCandidate();
      persist();
      syncControls();
    });
    document.getElementById('ocularCalibrateButton').addEventListener('click', startCalibration);
    syncControls();
  }

  function observeSettingsScreen() {
    injectSettingsControl();
    const app = document.getElementById('app');
    if (!app || settingsObserver) return;
    settingsObserver = new MutationObserver(injectSettingsControl);
    settingsObserver.observe(app, { childList: true, subtree: true });
  }

  function loadWebGazer() {
    if (window.webgazer) return Promise.resolve(window.webgazer);
    if (window.__comunicaWebgazerLoad) return window.__comunicaWebgazerLoad;
    window.__comunicaWebgazerLoad = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = WEBGAZER_URL;
      script.async = true;
      script.onload = () => window.webgazer ? resolve(window.webgazer) : reject(new Error('A biblioteca de rastreamento não inicializou.'));
      script.onerror = () => reject(new Error('Não foi possível carregar a biblioteca ocular. Verifique a conexão com a internet.'));
      document.head.appendChild(script);
    });
    return window.__comunicaWebgazerLoad;
  }

  async function requestCameraAccess() {
    const getUserMedia = navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices);
    if (!getUserMedia) {
      const error = new Error('Este navegador não disponibilizou acesso à câmera.');
      error.name = 'SecurityError';
      throw error;
    }

    let stream;
    try {
      try {
        stream = await getUserMedia(CAMERA_CONSTRAINTS);
      } catch (error) {
        // Algumas câmeras não aceitam restrições ideais; tente a configuração mínima.
        if (error?.name !== 'OverconstrainedError') throw error;
        stream = await getUserMedia({ audio: false, video: true });
      }
    } finally {
      stream?.getTracks?.().forEach(track => track.stop());
      if (stream) await new Promise(resolve => setTimeout(resolve, 120));
    }
  }

  function withTimeout(promise, timeoutMs, message) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        const error = new Error(message);
        error.name = 'TimeoutError';
        reject(error);
      }, timeoutMs);
    });
    return Promise.race([Promise.resolve(promise), timeout]).finally(() => clearTimeout(timer));
  }

  function cameraErrorMessage(error) {
    if (/biblioteca|conexão com a internet|rastreamento ocular/i.test(String(error?.message || ''))) {
      return 'Não foi possível carregar a biblioteca do rastreamento ocular. Verifique a conexão com a internet e tente novamente.';
    }
    switch (error?.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return 'A permissão da câmera foi negada. Permita a câmera no cadeado da barra de endereço e toque novamente no controle ocular.';
      case 'NotFoundError':
        return 'Nenhuma câmera foi encontrada neste dispositivo. Conecte uma câmera e tente novamente.';
      case 'NotReadableError':
        return 'A câmera está ocupada por outro aplicativo. Feche chamadas ou programas que usam a câmera e tente novamente.';
      case 'OverconstrainedError':
        return 'A câmera não atende às configurações disponíveis neste dispositivo.';
      case 'SecurityError':
      case 'TypeError':
        return 'O navegador bloqueou a câmera. Abra o Comunica por HTTPS ou por http://localhost (não use o arquivo aberto diretamente).';
      case 'TimeoutError':
        return 'A câmera demorou para iniciar. Verifique a permissão e tente novamente.';
      default:
        return error?.message
          ? `Não foi possível abrir a câmera: ${error.message}`
          : 'Não foi possível abrir a câmera. Verifique a permissão do navegador e tente novamente.';
    }
  }

  function clearCandidate() {
    if (state.candidateTimer) clearTimeout(state.candidateTimer);
    state.candidateTimer = 0;
    state.candidate?.classList.remove('ocular-gaze-hover');
    state.candidate = null;
    state.candidateSince = 0;
    if (gazeCursor) gazeCursor.style.setProperty('--ocular-progress', '0');
  }

  function getInteractiveTarget(x, y) {
    const raw = document.elementFromPoint(x, y);
    if (!(raw instanceof Element)) return null;
    let target = raw.closest('button:not([disabled]), a[href], [role="button"], [data-go], .switch');
    if (!target || target.id === 'ocularFloatingButton') return null;
    if (target.closest('#ocularCalibrationOverlay') || target.closest('#ocularSettingsBlock')?.querySelector('input[type="range"]') === target) return null;
    if (target.closest('[hidden], [aria-hidden="true"]') || target.getAttribute('aria-disabled') === 'true') return null;
    if (!target.isConnected || target.getClientRects().length === 0) return null;
    return target;
  }

  function playConfirmation() {
    if (!state.sound) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 740;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.13);
      oscillator.onended = () => context.close();
    } catch (_) { /* O som é opcional. */ }
  }

  function getMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  }

  function smoothGaze(data) {
    const rawX = Math.max(0, Math.min(innerWidth - 1, data.x));
    const rawY = Math.max(0, Math.min(innerHeight - 1, data.y));
    state.gazeSamples.push({ x: rawX, y: rawY });
    if (state.gazeSamples.length > GAZE_SAMPLE_LIMIT) state.gazeSamples.shift();

    const medianX = getMedian(state.gazeSamples.map(sample => sample.x));
    const medianY = getMedian(state.gazeSamples.map(sample => sample.y));
    if (state.x == null || state.y == null) return { x: medianX, y: medianY };

    const deltaX = medianX - state.x;
    const deltaY = medianY - state.y;
    const stepX = Math.max(-GAZE_MAX_STEP_PX, Math.min(GAZE_MAX_STEP_PX, deltaX * GAZE_SMOOTHING));
    const stepY = Math.max(-GAZE_MAX_STEP_PX, Math.min(GAZE_MAX_STEP_PX, deltaY * GAZE_SMOOTHING));
    return {
      x: Math.abs(deltaX) <= GAZE_DEADZONE_PX ? state.x : state.x + stepX,
      y: Math.abs(deltaY) <= GAZE_DEADZONE_PX ? state.y : state.y + stepY
    };
  }

  function activateTarget(target) {
    if (!target || !target.isConnected || !state.running || !state.calibrated || state.calibrationActive) return;
    const rect = target.getBoundingClientRect();
    const fresh = performance.now() - state.lastPredictionAt < 450;
    const stillOnTarget = state.x >= rect.left && state.x <= rect.right && state.y >= rect.top && state.y <= rect.bottom;
    if (!fresh || !stillOnTarget || document.hidden) {
      clearCandidate();
      return;
    }
    state.lockedCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, since: performance.now() };
    clearCandidate();
    target.click();
    playConfirmation();
  }

  function onGaze(data) {
    if (!data || !Number.isFinite(data.x) || !Number.isFinite(data.y)) return;
    const smoothed = smoothGaze(data);
    state.x = smoothed.x;
    state.y = smoothed.y;
    state.lastPredictionAt = performance.now();

    if (gazeCursor && state.running && state.calibrated && !state.calibrationActive) {
      gazeCursor.hidden = false;
      gazeCursor.style.left = `${state.x}px`;
      gazeCursor.style.top = `${state.y}px`;
    }
    if (!state.running || !state.calibrated || state.calibrationActive || document.hidden) return;

    if (state.lockedCenter) {
      const distance = Math.hypot(state.x - state.lockedCenter.x, state.y - state.lockedCenter.y);
      if (distance < 115 || performance.now() - state.lockedCenter.since < 550) return;
      state.lockedCenter = null;
    }

    const target = getInteractiveTarget(state.x, state.y);
    if (target !== state.candidate) {
      clearCandidate();
      if (!target) return;
      state.candidate = target;
      state.candidateSince = performance.now();
      target.classList.add('ocular-gaze-hover');
      state.candidateTimer = setTimeout(() => activateTarget(target), state.dwellMs);
      return;
    }
    if (state.candidate && gazeCursor) {
      gazeCursor.style.setProperty('--ocular-progress', String(Math.min(1, (performance.now() - state.candidateSince) / state.dwellMs)));
    }
  }

  function updateCalibrationPoint() {
    const [x, y] = points[state.calibrationIndex];
    calibrationPoint.style.left = `${x}%`;
    calibrationPoint.style.top = `${y}%`;
    calibrationPoint.setAttribute('aria-label', `Confirmar ponto ${state.calibrationIndex + 1} de ${points.length}`);
    calibrationProgress.textContent = `Ponto ${state.calibrationIndex + 1} de ${points.length}`;
    calibrationText.textContent = 'Olhe para o centro do ponto e toque ou clique nele.';
  }

  function startCalibration() {
    if (!state.running) {
      setStatus('Ative o controle ocular nas configurações antes de calibrar.');
      return;
    }
    clearCandidate();
    state.x = null;
    state.y = null;
    state.gazeSamples.length = 0;
    state.calibrated = false;
    state.calibrationActive = true;
    state.calibrationIndex = 0;
    document.body.classList.add('ocular-calibrating');
    calibrationOverlay.hidden = false;
    gazeCursor.hidden = true;
    updateCalibrationPoint();
    setStatus('Calibração iniciada. Confirme cada um dos nove pontos duas vezes, olhando para o centro.');
  }

  function advanceCalibration() {
    if (!state.calibrationActive) return;
    state.calibrationIndex += 1;
    if (state.calibrationIndex < points.length) {
      updateCalibrationPoint();
      return;
    }
    state.calibrationActive = false;
    state.calibrated = true;
    calibrationOverlay.hidden = true;
    document.body.classList.remove('ocular-calibrating');
    gazeCursor.hidden = false;
    setStatus('Calibração concluída. Olhe para um controle até o indicador completar para selecioná-lo.');
  }

  function cancelCalibration() {
    state.calibrationActive = false;
    calibrationOverlay.hidden = true;
    document.body.classList.remove('ocular-calibrating');
    gazeCursor.hidden = true;
    setStatus(state.running ? 'Câmera ativa. Para selecionar pelo olhar, conclua a calibração.' : 'Calibração cancelada.');
  }

  async function stopTracking(message = 'Controle ocular desligado; a câmera foi liberada.') {
    clearCandidate();
    state.running = false;
    state.calibrated = false;
    state.calibrationActive = false;
    state.x = null;
    state.y = null;
    state.gazeSamples.length = 0;
    state.lockedCenter = null;
    if (gazeCursor) gazeCursor.hidden = true;
    if (calibrationOverlay) calibrationOverlay.hidden = true;
    document.body.classList.remove('ocular-calibrating');
    const webgazer = state.webgazer || window.webgazer;
    if (webgazer) {
      try {
        if (typeof webgazer.end === 'function') await webgazer.end();
        else webgazer.pause?.();
      } catch (_) { /* Continua tentando liberar as faixas de câmera. */ }
      document.querySelectorAll('#webgazerVideoFeed, #webgazerVideoContainer video').forEach(video => {
        video.srcObject?.getTracks?.().forEach(track => track.stop());
      });
      try { webgazer.showVideoPreview?.(false); } catch (_) { /* Método opcional entre versões. */ }
    }
    setStatus(message);
    syncControls();
  }

  async function startTracking() {
    if (state.running) return true;
    if (state.starting) return state.starting;
    const loopbackHost = /^(?:127(?:\.\d{1,3}){3}|\[::1\]|::1)$/i.test(location.hostname);
    const webgazerSecureHost = location.protocol === 'https:'
      || (location.protocol === 'http:' && (location.hostname === 'localhost' || (loopbackHost && window.isSecureContext)));
    if (!webgazerSecureHost || !navigator.mediaDevices?.getUserMedia) {
      setStatus('O WebGazer exige HTTPS ou servidor local seguro. No desenvolvimento, abra http://localhost:PORTA. O modo de toque continua disponível.');
      return false;
    }
    state.starting = (async () => {
      setStatus('Carregando rastreamento ocular. O navegador solicitará permissão para a câmera.');
      try {
        // Solicita a permissão no gesto do usuário e separa falhas da câmera de falhas do WebGazer.
        await withTimeout(requestCameraAccess(), 12000, 'A câmera demorou para responder.');
        setStatus('Câmera autorizada. Preparando o rastreamento ocular…');
        const webgazer = await loadWebGazer();
        state.webgazer = webgazer;
        window.saveDataAcrossSessions = false;
        webgazer.setGazeListener(onGaze);
        try { webgazer.applyKalmanFilter?.(true); } catch (_) { /* Compatível com versões sem esse método. */ }
        const nativeAlert = window.alert;
        const isSecureLoopback = location.protocol === 'http:' && loopbackHost && window.isSecureContext;
        // Versões antigas do WebGazer alertam para qualquer host diferente de "localhost", inclusive loopback seguro.
        if (isSecureLoopback && typeof nativeAlert === 'function') {
          const filteredAlert = function (message, ...args) {
            if (/webgazer works only over https/i.test(String(message))) {
              setStatus('Servidor local seguro detectado. Ignorei o aviso antigo do WebGazer e continuei a inicialização.');
              return;
            }
            return nativeAlert.apply(window, [message, ...args]);
          };
          window.alert = filteredAlert;
          try { await withTimeout(Promise.resolve(webgazer.begin()), 20000, 'O rastreamento ocular demorou para iniciar.'); }
          finally { if (window.alert === filteredAlert) window.alert = nativeAlert; }
        } else {
          await withTimeout(Promise.resolve(webgazer.begin()), 20000, 'O rastreamento ocular demorou para iniciar.');
        }
        state.running = true;
        state.calibrated = false;
        try { webgazer.showPredictionPoints?.(false); } catch (_) { /* Usamos o cursor acessível abaixo. */ }
        try { webgazer.showVideoPreview?.(true); } catch (_) { /* O rastreamento funciona sem miniatura. */ }
        document.querySelectorAll('#webgazerVideoFeed, #webgazerVideoContainer video').forEach(video => { video.hidden = false; });
        syncControls();
        startCalibration();
        return true;
      } catch (error) {
        console.error('Falha ao iniciar o controle ocular:', error?.stack || error);
        await stopTracking('Controle ocular desligado. Toque e teclado continuam disponíveis.');
        setStatus(`${cameraErrorMessage(error)} Você ainda pode usar toque, teclado ou varredura.`);
        return false;
      } finally {
        state.starting = null;
        syncControls();
      }
    })();
    return state.starting;
  }

  async function toggleControl() {
    if (state.enabled || state.running) {
      state.enabled = false;
      persist();
      await stopTracking();
      syncControls();
      return;
    }
    state.enabled = true;
    persist();
    syncControls();
    if (!await startTracking()) {
      state.enabled = false;
      persist();
      syncControls();
    }
  }

  function tryResumePreviouslyEnabledControl() {
    if (!state.enabled) return;
    const message = 'Controle ocular ativado nas configurações. Se a câmera não reconectar, toque no botão flutuante para retomá-lo.';
    if (statusNode) statusNode.textContent = message;
    const settingsStatus = document.getElementById('ocularSettingsStatus');
    if (settingsStatus) settingsStatus.textContent = message;
    if (!navigator.permissions?.query) return;
    navigator.permissions.query({ name: 'camera' }).then(permission => {
      if (permission.state === 'granted' && state.enabled) startTracking();
    }).catch(() => { /* Alguns navegadores não expõem a consulta de permissão da câmera. */ });
  }

  function initialize() {
    if (!document.body || !document.head) return;
    buildGlobalControls();
    observeSettingsScreen();
    const initialMessage = state.enabled
      ? 'Controle ocular ativado nas configurações. Se necessário, toque no botão flutuante para retomá-lo.'
      : 'Controle ocular desligado. Ative-o nas configurações; toque e teclado continuam disponíveis.';
    if (statusNode) statusNode.textContent = initialMessage;
    const settingsStatus = document.getElementById('ocularSettingsStatus');
    if (settingsStatus) settingsStatus.textContent = initialMessage;
    tryResumePreviouslyEnabledControl();

    document.addEventListener('visibilitychange', () => {
      if (!state.webgazer || !state.running) return;
      if (document.hidden) {
        state.pauseOnHide = true;
        clearCandidate();
        try { state.webgazer.pause?.(); } catch (_) { /* API opcional. */ }
      } else if (state.pauseOnHide) {
        state.pauseOnHide = false;
        try { state.webgazer.resume?.(); } catch (_) { /* API opcional. */ }
      }
    });
    window.addEventListener('pagehide', () => {
      document.querySelectorAll('#webgazerVideoFeed, #webgazerVideoContainer video').forEach(video => {
        video.srcObject?.getTracks?.().forEach(track => track.stop());
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
