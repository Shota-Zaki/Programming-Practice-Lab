const optionButtons = Array.from(document.querySelectorAll('[data-option]'));
const optionPanels = Array.from(document.querySelectorAll('[data-option-panel]'));

function showScreen(panel, screenName) {
  const buttons = panel.querySelectorAll('[data-screen]');
  const screens = panel.querySelectorAll('[data-screen-panel]');

  buttons.forEach((button) => {
    button.setAttribute('aria-selected', String(button.dataset.screen === screenName));
  });

  screens.forEach((screen) => {
    screen.hidden = screen.dataset.screenPanel !== screenName;
  });
}

function showOption(optionName) {
  optionButtons.forEach((button) => {
    button.setAttribute('aria-selected', String(button.dataset.option === optionName));
  });

  optionPanels.forEach((panel) => {
    const selected = panel.dataset.optionPanel === optionName;
    panel.hidden = !selected;
    if (selected) showScreen(panel, 'home');
  });
}

optionButtons.forEach((button) => {
  button.addEventListener('click', () => showOption(button.dataset.option));
});

optionPanels.forEach((panel) => {
  panel.querySelectorAll('[data-screen]').forEach((button) => {
    button.addEventListener('click', () => showScreen(panel, button.dataset.screen));
  });
});

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});

showOption('a');
