function getThemeState() {
  return JSON.parse(localStorage.getItem('darkThemeState') || false);
}

function setThemeState(state) {
  localStorage.setItem('darkThemeState', state.toString());
}

export const darkThemeService = {
  getThemeState,
  setThemeState
};
