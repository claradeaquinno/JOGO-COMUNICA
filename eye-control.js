(() => {
  "use strict";

  const HOLD_MS = 1200;
  const RELEASE_MS = 300;
  const SELECTOR = [
    "#gazeToggle",
    "#gazeScrollUp",
    "#gazeScrollDown",
    "#app button:not([disabled])",
    "#app [role='button']",
    "#app [role='switch']",
    "#app [data-go]",
    "#app [data-word]",
    "#app [data-category]",
    "#app [data-pick]",
    "#app a[href]",
    "#app input:not([disabled]):not([type='hidden'])",
    "#app select:not([disabled])",
    "#app textarea:not([disabled])",
    "#app label.switch",
    "#app label:has(input[type='checkbox']), #app label:has(input[type='radio'])",
    ".confirm-dialog input:not([disabled]):not([type='hidden'])",
    ".confirm-dialog textarea:not([disabled])",
    ".confirm-dialog select:not([disabled])",
    ".confirm-dialog button:not([disabled])",
    "#gazeKeyboard button:not([disabled])",
    "#gazeSelectMenu button:not([disabled])",
    "#gazeRangePanel button:not([disabled])",
    "#splashScreen",
    "#splashScreen button:not([disabled])"
  ].join(",");

  function boot() {
    const video = document.getElementById("video");
    const gazeToggle = document.getElementById("gazeToggle");
    const gazeStatus = document.getElementById("status");
    const gazeError = document.getElementById("error");
    const gazeDock = document.getElementById("gazeDock");
    if (!video || !gazeToggle || !gazeStatus || !gazeError || !gazeDock) {
      console.warn("EyeGestures: elementos de integração ausentes no HTML.");
      return;
    }

    let tracker = null;
    let controlsEnabled = false;
    let lastTarget = null;
    let lastTargetKey = "";
    let targetSince = 0;
    let selectedKey = "";
    let locked = false;
    let outsideSince = 0;
    let differentTargetSince = 0;
    let openTextInput = null;
    let originalReadOnly = null;
    let virtualKeyboard = null;
    let selectMenu = null;
    let rangePanel = null;

    const cursor = document.createElement("div");
    cursor.id = "gazeDwellMarker";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);

    const style = document.createElement("style");
    style.textContent = `
      #cursor, #calib_cursor, #gazeDwellMarker { pointer-events: none !important; }
      #gazeDwellMarker {
        position: fixed; z-index: 10002; width: 42px; height: 42px;
        border: 4px solid #f4c542; border-radius: 50%;
        background: conic-gradient(#f4c542 var(--gaze-progress, 0%), rgba(255,255,255,.28) 0);
        box-shadow: 0 0 0 2px #fff, 0 2px 9px rgba(0,0,0,.45);
        transform: translate(-50%, -50%); display: none;
      }
      #gazeDock {
        position: fixed; z-index: 10001; left: 50%; bottom: 10px;
        transform: translateX(-50%); display: flex; align-items: center;
        justify-content: center; flex-wrap: wrap; gap: 8px;
        width: min(760px, calc(100vw - 20px)); padding: 9px 12px;
        border: 2px solid #103d5d; border-radius: 16px;
        background: rgba(255,255,255,.97); color: #103d5d;
        box-shadow: 0 3px 16px rgba(0,0,0,.3);
        font: 700 14px/1.3 Arial, sans-serif;
      }
      #gazeDock button, #gazeKeyboard button, #gazeSelectMenu button {
        min-height: 44px; min-width: 48px; padding: 8px 12px;
        border: 0; border-radius: 10px; background: #103d5d;
        color: #fff; font: inherit; cursor: pointer; touch-action: manipulation;
      }
      #gazeDock button:focus-visible, #gazeKeyboard button:focus-visible,
      #gazeSelectMenu button:focus-visible { outline: 4px solid #f4c542; outline-offset: 2px; }
      #status { flex: 1 1 100%; text-align: center; }
      #error { display: none; flex: 1 1 100%; color: #9b111e; text-align: center; }
      #logoDivEyeGestures { bottom: 94px !important; }
      #gazeKeyboard, #gazeSelectMenu {
        position: fixed; z-index: 10000; left: 50%; bottom: 104px;
        transform: translateX(-50%); width: min(720px, calc(100vw - 18px));
        max-height: min(48vh, 430px); overflow: auto; padding: 12px;
        border: 3px solid #103d5d; border-radius: 16px;
        background: #fff; color: #103d5d; box-shadow: 0 3px 18px rgba(0,0,0,.38);
        font: 700 16px/1.3 Arial, sans-serif;
      }
      #gazeKeyboard .gaze-key-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; margin: 6px 0; }
      #gazeKeyboard .gaze-key-row button { flex: 1 1 42px; }
      #gazeKeyboard .gaze-key-row .wide { flex: 2 1 85px; }
      #gazeSelectMenu .gaze-option-list { display: grid; grid-template-columns: repeat(auto-fit,minmax(130px,1fr)); gap: 8px; }
      #gazeSelectMenu h2, #gazeKeyboard h2 { margin: 0 0 8px; font-size: 18px; }
      #gazeRangePanel {
        position: fixed; z-index: 10000; left: 50%; bottom: 104px;
        transform: translateX(-50%); width: min(720px, calc(100vw - 18px));
        padding: 12px; border: 3px solid #103d5d; border-radius: 16px;
        background: #fff; color: #103d5d; box-shadow: 0 3px 18px rgba(0,0,0,.38);
        font: 700 16px/1.3 Arial, sans-serif;
      }
      #gazeRangePanel button {
        min-height: 44px; min-width: 48px; padding: 8px 12px;
        border: 0; border-radius: 10px; background: #103d5d;
        color: #fff; font: inherit; cursor: pointer;
      }
      @media (max-width: 520px) {
        #gazeDock { gap: 5px; padding: 7px; }
        #gazeDock button { min-width: 42px; padding: 7px; }
        #status { font-size: 12px; }
        #gazeKeyboard, #gazeSelectMenu { bottom: 118px; }
      }
    `;
    document.head.appendChild(style);

    gazeToggle.addEventListener("click", async () => {
      gazeError.style.display = "none";
      gazeError.textContent = "";

      if (!tracker) {
        if (typeof EyeGestures === "undefined") {
          showError("EyeGestures não carregou. Verifique sua conexão e os scripts no HTML.");
          return;
        }
        if (!window.isSecureContext) {
          showError("A câmera requer HTTPS ou localhost. Abra o app por um endereço seguro.");
          return;
        }
        if (!navigator.mediaDevices?.getUserMedia) {
          showError("Este navegador não disponibiliza acesso à câmera.");
          return;
        }

        try {
         
          controlsEnabled = true;
          updateToggle();
          tracker = new EyeGestures("video", onGaze);
          tracker.start();
          setStatus("Câmera ligada. Siga os 25 pontos da calibração.");
        } catch (error) {
          controlsEnabled = false;
          updateToggle();
          console.error("Falha ao iniciar EyeGestures:", error);
          showError(error?.message || "Não foi possível iniciar a câmera.");
        }
        return;
      }

      controlsEnabled = !controlsEnabled;
      resetDwell();
      closeVirtualKeyboard(false);
      closeSelectMenu();
      closeRangePanel();
      updateToggle();
      setStatus(
        controlsEnabled
          ? "Controle pelo olhar ativado. Fixe o olhar em um controle."
          : "Controle pausado. A câmera continua ligada para você poder reativar com o olhar."
      );
    });

    document.getElementById("gazeScrollUp")?.addEventListener("click", () => {
      window.scrollBy({ top: -Math.max(280, window.innerHeight * 0.72), behavior: "smooth" });
    });
    document.getElementById("gazeScrollDown")?.addEventListener("click", () => {
      window.scrollBy({ top: Math.max(280, window.innerHeight * 0.72), behavior: "smooth" });
    });

    function setStatus(message) {
      gazeStatus.textContent = message;
    }
    function showError(message) {
      gazeError.textContent = message;
      gazeError.style.display = "block";
      setStatus("Não foi possível ativar o controle ocular.");
    }
    function updateToggle() {
      gazeToggle.textContent = controlsEnabled
        ? "Pausar controle ocular"
        : tracker
          ? "Retomar controle ocular"
          : "Ativar controle pelo olhar";
      gazeToggle.setAttribute("aria-pressed", String(controlsEnabled));
    }
    function resetDwell() {
      lastTarget = null;
      lastTargetKey = "";
      targetSince = 0;
      outsideSince = 0;
      differentTargetSince = 0;
      cursor.style.display = "none";
      cursor.style.setProperty("--gaze-progress", "0%");
    }
    function keyFor(element) {
      return element.dataset.gazeTarget || element.id || element.dataset.go ||
        element.dataset.word || element.dataset.category || element.dataset.pick ||
        element.getAttribute("aria-label") ||
        `${element.tagName}:${(element.textContent || element.value || "").trim().replace(/\s+/g, " ").slice(0, 80)}`;
    }
    function visible(element) {
      if (!element || element.matches(":disabled, [aria-disabled='true']")) return false;
      if (element.closest("[hidden], [aria-hidden='true']")) return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }
    function targetAt(x, y) {
      const hit = document.elementFromPoint(x, y);
      if (!hit) return null;
      const target = hit.closest(SELECTOR);
      if (!visible(target)) return null;

      // No modo pausado, somente o botão para retomar responde ao olhar.
      if (!controlsEnabled && target.id !== "gazeToggle") return null;
      // Esconde qualquer controle encoberto por um diálogo que não seja ele mesmo.
      const modal = document.querySelector(".confirm-dialog, #gazeKeyboard, #gazeSelectMenu, #gazeRangePanel");
      if (modal && !modal.contains(target) && target.id !== "gazeToggle") return null;
      return target;
    }
    function onGaze(point, isCalibrating) {
      if (!Array.isArray(point) || point.length < 2) return;
      const x = Number(point[0]);
      const y = Number(point[1]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;

      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      cursor.style.display = "block";

      if (isCalibrating) {
        gazeDock.style.display = "none";
        resetDwell();
        setStatus("Calibrando: siga os pontos vermelhos do EyeGestures.");
        return;
      }

      gazeDock.style.display = "flex";

      const target = targetAt(x, y);
      if (!target) {
        lastTarget = null;
        lastTargetKey = "";
        targetSince = 0;
        differentTargetSince = 0;
        outsideSince ||= Date.now();
        if (locked && Date.now() - outsideSince >= RELEASE_MS) {
          locked = false;
          selectedKey = "";
        }
        cursor.style.setProperty("--gaze-progress", "0%");
        if (controlsEnabled) setStatus("Olhe para um botão, cartão ou campo e mantenha o olhar.");
        return;
      }

      outsideSince = 0;
      const key = keyFor(target);
      if (target !== lastTarget || key !== lastTargetKey) {
        lastTarget = target;
        lastTargetKey = key;
        targetSince = Date.now();
        differentTargetSince = 0;
      }

      if (locked) {
        if (key === selectedKey) {
          cursor.style.setProperty("--gaze-progress", "100%");
          setStatus("Selecionado. Desvie o olhar para escolher novamente.");
          return;
        }
        differentTargetSince ||= Date.now();
        if (Date.now() - differentTargetSince < RELEASE_MS) return;
        locked = false;
        selectedKey = "";
      }

      const elapsed = Date.now() - targetSince;
      const progress = Math.min(100, elapsed / HOLD_MS * 100);
      cursor.style.setProperty("--gaze-progress", `${progress}%`);
      setStatus(`Fixe o olhar para selecionar (${Math.floor(progress)}%).`);

      if (elapsed < HOLD_MS) return;
      locked = true;
      selectedKey = key;
      activate(target);
    }
    function activate(target) {
      if (target.id === "gazeToggle") {
        target.click();
        return;
      }
      if (target.id === "gazeScrollUp" || target.id === "gazeScrollDown") {
        target.click();
        return;
      }
      if (target.id === "splashScreen") {
        target.click();
        return;
      }
      if (target.matches("input[type='range']")) {
        openRangePanel(target);
        return;
      }
      if (target.matches("input:not([type='checkbox']):not([type='radio']):not([type='range']), textarea")) {
        openKeyboard(target);
        return;
      }
      if (target.matches("select")) {
        openSelectMenu(target);
        return;
      }
      target.click();
    }
    function dispatchInput(input) {
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    function openKeyboard(input) {
      if (virtualKeyboard) closeVirtualKeyboard(true);
      closeSelectMenu();
      openTextInput = input;
      originalReadOnly = input.readOnly;
      input.readOnly = true;
      input.focus({ preventScroll: true });

      virtualKeyboard = document.createElement("div");
      virtualKeyboard.id = "gazeKeyboard";
      virtualKeyboard.setAttribute("role", "dialog");
      virtualKeyboard.setAttribute("aria-label", "Teclado virtual");
      const heading = document.createElement("h2");
      heading.textContent = `Digite em: ${input.getAttribute("aria-label") || input.placeholder || "campo de texto"}`;
      virtualKeyboard.appendChild(heading);

      const rows = input.type === "number"
        ? [["1","2","3"],["4","5","6"],["7","8","9"],["0","-","."]]
        : [
            ["q","w","e","r","t","y","u","i","o","p"],
            ["a","s","d","f","g","h","j","k","l"],
            ["z","x","c","v","b","n","m"],
            ["á","é","í","ó","ú","ã","õ","ç","â","ê","ô"]
          ];
      rows.forEach(row => {
        const rowEl = document.createElement("div");
        rowEl.className = "gaze-key-row";
        row.forEach(label => rowEl.appendChild(makeKey(label, () => insertText(label))));
        virtualKeyboard.appendChild(rowEl);
      });

      const actions = document.createElement("div");
      actions.className = "gaze-key-row";
      actions.appendChild(makeKey("Maiúscula", () => insertText("SHIFT"), "wide"));
      actions.appendChild(makeKey("Espaço", () => insertText(" "), "wide"));
      actions.appendChild(makeKey("Apagar", backspace, "wide"));
      actions.appendChild(makeKey("Limpar", clearText, "wide"));
      actions.appendChild(makeKey("Concluir", () => closeVirtualKeyboard(true), "wide"));
      virtualKeyboard.appendChild(actions);
      document.body.appendChild(virtualKeyboard);
      resetDwell();
      setStatus("Teclado virtual aberto. Olhe para as letras; escolha Concluir ao terminar.");
    }
    function makeKey(label, action, className = "") {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.setAttribute("aria-label", label);
      if (className) button.classList.add(className);
      button.addEventListener("click", action);
      return button;
    }
    function insertText(text) {
      if (!openTextInput) return;
      if (text === "SHIFT") {
        virtualKeyboard?.querySelectorAll(".gaze-key-row button").forEach(button => {
          if (button.textContent.length === 1) button.textContent = button.textContent === button.textContent.toLowerCase()
            ? button.textContent.toUpperCase() : button.textContent.toLowerCase();
        });
        return;
      }
      const input = openTextInput;
      const value = String(input.value || "");
      const start = Number.isInteger(input.selectionStart) ? input.selectionStart : value.length;
      const end = Number.isInteger(input.selectionEnd) ? input.selectionEnd : value.length;
      if (typeof input.setRangeText === "function" && input.type !== "number") {
        input.setRangeText(text, start, end, "end");
      } else {
        input.value = value.slice(0, start) + text + value.slice(end);
      }
      dispatchInput(input);
      input.focus({ preventScroll: true });
    }
    function backspace() {
      if (!openTextInput) return;
      const input = openTextInput;
      const value = String(input.value || "");
      let start = Number.isInteger(input.selectionStart) ? input.selectionStart : value.length;
      let end = Number.isInteger(input.selectionEnd) ? input.selectionEnd : value.length;
      if (start === end && start > 0) start -= 1;
      if (typeof input.setRangeText === "function" && input.type !== "number") {
        input.setRangeText("", start, end, "end");
      } else {
        input.value = value.slice(0, start) + value.slice(end);
      }
      dispatchInput(input);
      input.focus({ preventScroll: true });
    }
    function clearText() {
      if (!openTextInput) return;
      openTextInput.value = "";
      dispatchInput(openTextInput);
      openTextInput.focus({ preventScroll: true });
    }
    function closeVirtualKeyboard(restoreFocus) {
      if (virtualKeyboard) virtualKeyboard.remove();
      virtualKeyboard = null;
      if (openTextInput) {
        openTextInput.readOnly = Boolean(originalReadOnly);
        if (restoreFocus) openTextInput.focus({ preventScroll: true });
      }
      openTextInput = null;
      originalReadOnly = null;
      resetDwell();
    }
    function openSelectMenu(select) {
      closeVirtualKeyboard(false);
      closeSelectMenu();
      selectMenu = document.createElement("div");
      selectMenu.id = "gazeSelectMenu";
      selectMenu.setAttribute("role", "dialog");
      selectMenu.setAttribute("aria-label", "Escolha uma opção");
      const heading = document.createElement("h2");
      heading.textContent = select.getAttribute("aria-label") || "Escolha uma opção";
      selectMenu.appendChild(heading);
      const list = document.createElement("div");
      list.className = "gaze-option-list";
      Array.from(select.options).forEach(option => {
        if (option.disabled) return;
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = option.textContent.trim();
        button.setAttribute("aria-label", option.textContent.trim());
        button.addEventListener("click", () => {
          select.value = option.value;
          dispatchInput(select);
          closeSelectMenu();
        });
        list.appendChild(button);
      });
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = "Fechar";
      cancel.addEventListener("click", closeSelectMenu);
      selectMenu.appendChild(list);
      selectMenu.appendChild(cancel);
      document.body.appendChild(selectMenu);
      resetDwell();
      setStatus("Lista aberta. Olhe para a opção desejada.");
    }
    function closeSelectMenu() {
      selectMenu?.remove();
      selectMenu = null;
    }

    function openRangePanel(input) {
      closeVirtualKeyboard(false);
      closeSelectMenu();
      closeRangePanel();
      rangePanel = document.createElement("div");
      rangePanel.id = "gazeRangePanel";
      rangePanel.setAttribute("role", "dialog");
      rangePanel.setAttribute("aria-label", input.getAttribute("aria-label") || "Ajuste de valor");

      const heading = document.createElement("h2");
      heading.textContent = input.getAttribute("aria-label") || "Ajuste de valor";
      rangePanel.appendChild(heading);
      const value = document.createElement("p");
      value.id = "gazeRangeValue";
      rangePanel.appendChild(value);

      const row = document.createElement("div");
      row.className = "gaze-key-row";
      const step = Number(input.step) > 0 ? Number(input.step) : 1;
      const min = input.min === "" ? 0 : Number(input.min);
      const max = input.max === "" ? 100 : Number(input.max);
      const apply = next => {
        input.value = String(Math.min(max, Math.max(min, next)));
        dispatchInput(input);
        value.textContent = input.value;
      };
      const minus = makeKey("Diminuir", () => apply(Number(input.value) - step), "wide");
      const plus = makeKey("Aumentar", () => apply(Number(input.value) + step), "wide");
      const done = makeKey("Concluir", closeRangePanel, "wide");
      row.append(minus, plus, done);
      rangePanel.appendChild(row);
      value.textContent = input.value;
      document.body.appendChild(rangePanel);
      resetDwell();
      setStatus("Ajuste aberto. Olhe para Diminuir ou Aumentar; depois Concluir.");
    }

    function closeRangePanel() {
      rangePanel?.remove();
      rangePanel = null;
    }

    // Atualiza o estado visual do botão fixo após qualquer uso.
    updateToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
