export class ThemeService {
  static getThemeState(): boolean {
    return JSON.parse(localStorage.getItem('darkThemeState') || 'false');
  }

  static setThemeState(state: boolean): void {
    localStorage.setItem('darkThemeState', state.toString());
  }
}
