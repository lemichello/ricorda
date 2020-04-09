import React from 'react';
import { darkThemeService } from '../../../services/darkThemeService';

export const ThemeContext = React.createContext({
  isDarkTheme: darkThemeService.getThemeState()
});
