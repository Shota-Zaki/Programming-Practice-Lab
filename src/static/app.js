const viewPanels = [...document.querySelectorAll("[data-view-panel]")];
const viewControls = [...document.querySelectorAll("[data-view]")];
const sidebarNavigation = [...document.querySelectorAll(".sidebar-navigation [data-view]")];
const mobileNavigation = [...document.querySelectorAll(".mobile-navigation [data-view]")];
const brandLink = document.querySelector("[data-view-link]");
const sidebar = document.querySelector("#sidebar");
const menuButton = document.querySelector(".menu-button");
const mainContent = document.querySelector("#main-content");
const viewKicker = document.querySelector("#view-kicker");
const viewTitle = document.querySelector("#view-title");

const VIEW_STORAGE_KEY = "ppl.activeView";
const CODE_STORAGE_KEY = "ppl.exercise.task-input";
const ENV_STORAGE_KEY = "ppl.environment.checks";
const REFLECTION_STORAGE_KEY = "ppl.exercise.reflection";

const viewMetadata = {
  home: { kicker: "PROJECT LEARNING", title: "ホーム" },
  projects: { kicker: "PROJECT CATALOG", title: "プロジェクト" },
  "project-detail": { kicker: "PROJECT 01", title: "プロジェクト詳細" },
  roadmap: { kicker: "PROJECT 01", title: "学習工程" },
  lesson: { kicker: "PHASE 02", title: "教材" },
  exercise: { kicker: "EXERCISE 03", title: "演習" },
  result: { kicker: "EXERCISE RESULT", title: "演習結果" },
  review: { kicker: "REVIEW QUEUE", title: "復習" },
  history: { kicker: "LEARNING HISTORY", title: "学習履歴" },
  environment: { kicker: "LOCAL ENVIRONMENT", title: "開発環境" },
};

const validViews = new Set(viewPanels.map((panel) => panel.dataset.viewPanel));

function closeSidebar() {
  if (!sidebar || !menuButton) return;
  sidebar.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}

function updateNavigationState(viewName) {
  const primaryView =
    viewName === "project-detail" || viewName === "lesson" || viewName === "exercise" || viewName === "result"
      ? viewName === "project-detail"
        ? "projects"
        : viewName === "lesson" || viewName === "exercise" || viewName === "result"
          ? "roadmap"
          : viewName
      : viewName;

  for (const button of [...sidebarNavigation, ...mobileNavigation]) {
    if (button.dataset.view === primaryView) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  }
}

function showView(viewName, { focus = false, updateHistory = true } = {}) {
  const targetView = validViews.has(viewName) ? viewName : "home";

  for (const panel of viewPanels) {
    const active = panel.dataset.viewPanel === targetView;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  }

  const metadata = viewMetadata[targetView] ?? viewMetadata.home;
  if (viewKicker) viewKicker.textContent = metadata.kicker;
  if (viewTitle) viewTitle.textContent = metadata.title;

  updateNavigationState(targetView);
  localStorage.setItem(VIEW_STORAGE_KEY, targetView);

  if (updateHistory) {
    history.replaceState(null, "", `#${targetView}`);
  }

  closeSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (targetView === "exercise") {
    setWorkspaceTab("task");
  }

  if (focus) {
    requestAnimationFrame(() => {
      const heading = document.querySelector(`[data-view-panel="${targetView}"] h1`);
      if (heading instanceof HTMLElement) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      } else {
        mainContent?.focus({ preventScroll: true });
      }
    });
  }
}

for (const control of viewControls) {
  control.addEventListener("click", () => {
    const viewName = control.dataset.view;
    if (viewName) showView(viewName, { focus: true });
  });
}

brandLink?.addEventListener("click", (event) => {
  event.preventDefault();
  showView("home", { focus: true });
});

menuButton?.addEventListener("click", () => {
  if (!sidebar) return;
  const willOpen = !sidebar.classList.contains("is-open");
  sidebar.classList.toggle("is-open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSidebar();
});

const projectSearch = document.querySelector("#project-search");
const projectFilterButtons = [...document.querySelectorAll("[data-project-filter]")];
const projectItems = [...document.querySelectorAll("[data-project-tags]")];
const catalogEmpty = document.querySelector("#catalog-empty");
let activeProjectFilter = "all";

function updateProjectCatalog() {
  const query = projectSearch?.value.trim().toLowerCase() ?? "";
  let visibleCount = 0;

  for (const item of projectItems) {
    const tags = (item.dataset.projectTags ?? "").toLowerCase();
    const text = item.textContent?.toLowerCase() ?? "";
    const filterMatches = activeProjectFilter === "all" || tags.includes(activeProjectFilter);
    const queryMatches = query === "" || tags.includes(query) || text.includes(query);
    const visible = filterMatches && queryMatches;
    item.hidden = !visible;
    if (visible) visibleCount += 1;
  }

  if (catalogEmpty) catalogEmpty.hidden = visibleCount > 0;
}

projectSearch?.addEventListener("input", updateProjectCatalog);

for (const button of projectFilterButtons) {
  button.addEventListener("click", () => {
    activeProjectFilter = button.dataset.projectFilter ?? "all";
    for (const candidate of projectFilterButtons) {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    }
    updateProjectCatalog();
  });
}

const knowledgeButton = document.querySelector("#check-knowledge");
const knowledgeResult = document.querySelector("#knowledge-result");

knowledgeButton?.addEventListener("click", () => {
  const selected = document.querySelector('input[name="knowledge"]:checked');
  if (!knowledgeResult) return;

  if (!(selected instanceof HTMLInputElement)) {
    knowledgeResult.textContent = "回答を選択してください。";
    return;
  }

  if (selected.value === "correct") {
    knowledgeResult.textContent = "正解です。入力欄の現在値は event.target.value から取得します。";
  } else {
    knowledgeResult.textContent = "もう一度確認してください。値そのものを指すプロパティが必要です。";
  }
});

for (const button of document.querySelectorAll("[data-copy-code]")) {
  button.addEventListener("click", async () => {
    const code = button.closest(".code-sample")?.querySelector("code")?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "コピー済み";
      setTimeout(() => {
        button.textContent = "コピー";
      }, 1600);
    } catch {
      button.textContent = "選択してコピー";
    }
  });
}

const workspaceTabs = [...document.querySelectorAll("[data-workspace-tab]")];
const workspacePanels = [...document.querySelectorAll("[data-workspace-panel]")];

function setWorkspaceTab(tabName) {
  const target = workspacePanels.some((panel) => panel.dataset.workspacePanel === tabName)
    ? tabName
    : "task";

  for (const tab of workspaceTabs) {
    tab.setAttribute("aria-selected", String(tab.dataset.workspaceTab === target));
  }

  for (const panel of workspacePanels) {
    panel.classList.toggle("is-mobile-active", panel.dataset.workspacePanel === target);
  }
}

for (const tab of workspaceTabs) {
  tab.addEventListener("click", () => {
    setWorkspaceTab(tab.dataset.workspaceTab ?? "task");
  });
}

setWorkspaceTab("task");

const editor = document.querySelector("#code-editor");
const runButton = document.querySelector("#run-code");
const resetButton = document.querySelector("#reset-code");
const saveButton = document.querySelector("#save-code");
const saveStatus = document.querySelector("#save-status");
const resultStatus = document.querySelector("#result-status");
const resultMessage = document.querySelector("#result-message");
const testItems = [...document.querySelectorAll("[data-test]")];
const consoleOutput = document.querySelector("#console-output");
const clearOutput = document.querySelector("#clear-output");
const initialCode = editor instanceof HTMLTextAreaElement ? editor.value : "";

let saveTimer;

function setSaveStatus(message) {
  if (!saveStatus) return;
  saveStatus.textContent = message;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveStatus.textContent = "自動保存";
  }, 1400);
}

function persistCode() {
  if (!(editor instanceof HTMLTextAreaElement)) return;
  localStorage.setItem(CODE_STORAGE_KEY, editor.value);
  setSaveStatus("保存済み");
}

function setTestResult(testName, passed) {
  const item = testItems.find((candidate) => candidate.dataset.test === testName);
  if (!item) return;

  item.classList.toggle("is-pass", passed);
  item.classList.toggle("is-fail", !passed);
  const symbol = item.querySelector("span");
  if (symbol) symbol.textContent = passed ? "✓" : "×";
}

function gradeExercise() {
  if (!(editor instanceof HTMLTextAreaElement) || !resultStatus || !resultMessage) return;

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
  resultStatus.style.color = allPassed ? "#1d6b4c" : "#aa6d16";
  resultMessage.textContent = allPassed
    ? "すべての確認条件を満たしました。次の教材へ進めます。"
    : "未達成の条件があります。条件ごとの結果と出力を確認してください。";

  if (consoleOutput) {
    const lines = [
      "$ npm test",
      "",
      `${results.state ? "PASS" : "FAIL"}  state has explicit string type`,
      `${results.setter ? "PASS" : "FAIL"}  state setter is called`,
      `${results.value ? "PASS" : "FAIL"}  input value is passed`,
      "",
      `Tests: ${passedCount} passed, ${3 - passedCount} failed`,
      "Time: 42ms",
    ];
    consoleOutput.textContent = lines.join("\n");
  }

  persistCode();
  setWorkspaceTab("result");
}

runButton?.addEventListener("click", gradeExercise);

resetButton?.addEventListener("click", () => {
  if (!(editor instanceof HTMLTextAreaElement) || !resultStatus || !resultMessage) return;

  editor.value = initialCode;
  localStorage.removeItem(CODE_STORAGE_KEY);
  resultStatus.textContent = "未実行";
  resultStatus.style.color = "";
  resultMessage.textContent = "コードを実行すると、条件ごとの結果が表示されます。";

  for (const item of testItems) {
    item.classList.remove("is-pass", "is-fail");
    const symbol = item.querySelector("span");
    if (symbol) symbol.textContent = "○";
  }

  if (consoleOutput) consoleOutput.textContent = "実行待ち...";
  setSaveStatus("初期状態");
  editor.focus();
});

saveButton?.addEventListener("click", persistCode);

clearOutput?.addEventListener("click", () => {
  if (consoleOutput) consoleOutput.textContent = "出力を消去しました。";
});

if (editor instanceof HTMLTextAreaElement) {
  const savedCode = localStorage.getItem(CODE_STORAGE_KEY);
  if (savedCode) editor.value = savedCode;

  editor.addEventListener("input", () => {
    localStorage.setItem(CODE_STORAGE_KEY, editor.value);
    setSaveStatus("保存中...");
  });

  editor.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.setRangeText("  ", start, end, "end");
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      gradeExercise();
    }
  });
}

const reflectionButtons = [...document.querySelectorAll("[data-reflection]")];
const reflectionStatus = document.querySelector("#reflection-status");
const reflectionMessages = {
  easy: "「理解できた」として記録しました。次回の復習間隔を長めにします。",
  normal: "「少し迷った」として記録しました。数日以内に短い確認を追加します。",
  hard: "「復習したい」として記録しました。今日の復習キューへ追加します。",
};

function selectReflection(value) {
  for (const button of reflectionButtons) {
    button.classList.toggle("is-selected", button.dataset.reflection === value);
  }

  if (reflectionStatus && value in reflectionMessages) {
    reflectionStatus.textContent = reflectionMessages[value];
  }

  if (value) localStorage.setItem(REFLECTION_STORAGE_KEY, value);
}

for (const button of reflectionButtons) {
  button.addEventListener("click", () => {
    selectReflection(button.dataset.reflection ?? "");
  });
}

selectReflection(localStorage.getItem(REFLECTION_STORAGE_KEY) ?? "");

const osButtons = [...document.querySelectorAll("[data-os]")];
const setupHeadingOs = document.querySelector(".setup-heading > span");
const osLabels = { windows: "Windows", macos: "macOS", linux: "Linux" };

for (const button of osButtons) {
  button.addEventListener("click", () => {
    for (const candidate of osButtons) {
      candidate.setAttribute("aria-selected", String(candidate === button));
    }
    const os = button.dataset.os ?? "windows";
    if (setupHeadingOs) setupHeadingOs.textContent = osLabels[os] ?? "Windows";
  });
}

for (const button of document.querySelectorAll("[data-copy-command]")) {
  button.addEventListener("click", async () => {
    const command = "node --version\nnpm --version";
    try {
      await navigator.clipboard.writeText(command);
      button.textContent = "コピー済み";
      setTimeout(() => {
        button.textContent = "コピー";
      }, 1600);
    } catch {
      button.textContent = "選択してコピー";
    }
  });
}

const environmentChecks = [...document.querySelectorAll("[data-env-check]")];
const environmentState = document.querySelector(".environment-state strong");

function loadEnvironmentChecks() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(ENV_STORAGE_KEY) ?? "{}");
  } catch {
    saved = {};
  }

  for (const checkbox of environmentChecks) {
    if (!(checkbox instanceof HTMLInputElement)) continue;
    const key = checkbox.dataset.envCheck;
    if (key && key in saved) checkbox.checked = Boolean(saved[key]);
  }
}

function saveEnvironmentChecks() {
  const values = {};

  for (const checkbox of environmentChecks) {
    if (!(checkbox instanceof HTMLInputElement)) continue;
    const key = checkbox.dataset.envCheck;
    if (key) values[key] = checkbox.checked;
  }

  localStorage.setItem(ENV_STORAGE_KEY, JSON.stringify(values));
  const completed = Object.values(values).filter(Boolean).length;
  if (environmentState) environmentState.textContent = `${completed} / 5確認済み`;
}

loadEnvironmentChecks();
saveEnvironmentChecks();

for (const checkbox of environmentChecks) {
  checkbox.addEventListener("change", saveEnvironmentChecks);
}

const verifyEnvironmentButton = document.querySelector("#verify-environment");
const nodeInput = document.querySelector("#node-input");
const npmInput = document.querySelector("#npm-input");
const nodeVersion = document.querySelector("#node-version");
const npmVersion = document.querySelector("#npm-version");
const environmentResult = document.querySelector("#environment-result");
const environmentLog = document.querySelector("#environment-log");

verifyEnvironmentButton?.addEventListener("click", () => {
  const nodeValue = nodeInput instanceof HTMLInputElement ? nodeInput.value.trim() : "";
  const npmValue = npmInput instanceof HTMLInputElement ? npmInput.value.trim() : "";
  const nodePass = /^v?24\./.test(nodeValue);
  const npmPass = /^11\./.test(npmValue);

  if (nodeVersion) nodeVersion.textContent = nodeValue || "未入力";
  if (npmVersion) npmVersion.textContent = npmValue || "未入力";

  const rows = [...document.querySelectorAll(".requirement-table > div")].slice(1);
  const states = [nodePass, npmPass];

  rows.forEach((row, index) => {
    const badge = row.querySelector("b");
    if (!badge) return;
    badge.classList.remove("pending", "pass", "fail");
    badge.classList.add(states[index] ? "pass" : "fail");
    badge.textContent = states[index] ? "OK" : "要確認";
  });

  if (environmentResult) {
    environmentResult.textContent =
      nodePass && npmPass
        ? "推奨バージョンを確認しました。次のDocker確認へ進めます。"
        : "推奨バージョンと一致しません。既存環境を上書きせず、分離して導入してください。";
    environmentResult.style.color = nodePass && npmPass ? "#1d6b4c" : "#a44444";
  }

  if (environmentLog) {
    environmentLog.textContent = [
      `$ node --version`,
      nodeValue || "command not found",
      `$ npm --version`,
      npmValue || "command not found",
      "",
      nodePass && npmPass ? "Environment check passed." : "Environment check needs attention.",
    ].join("\n");
  }

  const nodeCheckbox = environmentChecks.find((item) => item.dataset.envCheck === "node");
  if (nodeCheckbox instanceof HTMLInputElement) {
    nodeCheckbox.checked = nodePass && npmPass;
    saveEnvironmentChecks();
  }
});

const hashView = window.location.hash.replace("#", "");
const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
const initialView = validViews.has(hashView) ? hashView : validViews.has(savedView) ? savedView : "home";
showView(initialView, { updateHistory: false });

window.addEventListener("hashchange", () => {
  const nextView = window.location.hash.replace("#", "");
  if (validViews.has(nextView)) showView(nextView, { updateHistory: false });
});
