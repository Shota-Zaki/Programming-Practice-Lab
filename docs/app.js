const viewPanels = [...document.querySelectorAll("[data-view-panel]")];
const viewControls = [...document.querySelectorAll("[data-view]")];
const navigationButtons = [...document.querySelectorAll(".primary-navigation [data-view]")];
const brandLink = document.querySelector("[data-view-link]");
const menuButton = document.querySelector(".menu-button");
const primaryNavigation = document.querySelector(".primary-navigation");
const editor = document.querySelector("#code-editor");
const runButton = document.querySelector("#run-code");
const resetButton = document.querySelector("#reset-code");
const resultStatus = document.querySelector("#result-status");
const resultMessage = document.querySelector("#result-message");
const testItems = [...document.querySelectorAll("[data-test]")];

const VIEW_STORAGE_KEY = "ppl.activeView";
const CODE_STORAGE_KEY = "ppl.exercise.task-input";
const validViews = new Set(viewPanels.map((panel) => panel.dataset.viewPanel));
const initialCode = editor?.value ?? "";

function closeMenu() {
  if (!menuButton || !primaryNavigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  primaryNavigation.classList.remove("is-open");
}

function showView(viewName, { focus = false } = {}) {
  const targetView = validViews.has(viewName) ? viewName : "home";

  for (const panel of viewPanels) {
    const isActive = panel.dataset.viewPanel === targetView;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  }

  for (const button of navigationButtons) {
    if (button.dataset.view === targetView) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  }

  localStorage.setItem(VIEW_STORAGE_KEY, targetView);
  history.replaceState(null, "", `#${targetView}`);
  closeMenu();

  const activeHeading = document.querySelector(
    `[data-view-panel="${targetView}"] h1`,
  );

  if (focus && activeHeading instanceof HTMLElement) {
    activeHeading.tabIndex = -1;
    activeHeading.focus({ preventScroll: true });
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

for (const control of viewControls) {
  control.addEventListener("click", () => {
    showView(control.dataset.view, { focus: true });
  });
}

brandLink?.addEventListener("click", (event) => {
  event.preventDefault();
  showView("home", { focus: true });
});

menuButton?.addEventListener("click", () => {
  if (!primaryNavigation) return;
  const willOpen = !primaryNavigation.classList.contains("is-open");
  primaryNavigation.classList.toggle("is-open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

function setTestResult(testName, passed) {
  const item = testItems.find((candidate) => candidate.dataset.test === testName);
  if (!item) return;

  item.classList.toggle("is-pass", passed);
  item.classList.toggle("is-fail", !passed);

  const symbol = item.querySelector("span");
  if (symbol) symbol.textContent = passed ? "✓" : "×";
}

function gradeExercise() {
  if (!editor || !resultStatus || !resultMessage) return;

  const code = editor.value;
  const results = {
    state: /useState\s*<\s*string\s*>\s*\(/.test(code),
    setter: /setTitle\s*\(/.test(code),
    value: /setTitle\s*\(\s*event\.target\.value\s*\)/.test(code),
  };

  for (const [testName, passed] of Object.entries(results)) {
    setTestResult(testName, passed);
  }

  const passedCount = Object.values(results).filter(Boolean).length;
  const allPassed = passedCount === Object.keys(results).length;

  resultStatus.textContent = allPassed ? "合格" : `${passedCount} / 3 合格`;
  resultStatus.style.color = allPassed ? "#66d69b" : "#f1c75b";
  resultMessage.textContent = allPassed
    ? "すべての確認条件を満たしました。次の演習へ進める状態です。"
    : "未達成の条件があります。入力値を状態更新関数へ渡しているか確認してください。";

  localStorage.setItem(CODE_STORAGE_KEY, code);
}

runButton?.addEventListener("click", gradeExercise);

resetButton?.addEventListener("click", () => {
  if (!editor || !resultStatus || !resultMessage) return;

  editor.value = initialCode;
  localStorage.removeItem(CODE_STORAGE_KEY);
  resultStatus.textContent = "未実行";
  resultStatus.style.color = "";
  resultMessage.textContent =
    "コードを実行すると、条件ごとの結果が表示されます。";

  for (const item of testItems) {
    item.classList.remove("is-pass", "is-fail");
    const symbol = item.querySelector("span");
    if (symbol) symbol.textContent = "○";
  }

  editor.focus();
});

if (editor) {
  const savedCode = localStorage.getItem(CODE_STORAGE_KEY);
  if (savedCode) editor.value = savedCode;

  editor.addEventListener("input", () => {
    localStorage.setItem(CODE_STORAGE_KEY, editor.value);
  });

  editor.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;

    event.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.setRangeText("  ", start, end, "end");
  });
}

const hashView = window.location.hash.replace("#", "");
const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
showView(validViews.has(hashView) ? hashView : savedView ?? "home");
