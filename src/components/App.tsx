import React, { useState } from 'react';
import './App.css';
import { Ricorda } from './Ricorda/Ricorda';
import ThemeContext from './Ricorda/contexts/themeContext';
import { ThemeService } from '../services/themeService';

function App() {
  const [theme, setTheme] = useState({
    isDarkTheme: ThemeService.getThemeState(),
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`app-root ${theme.isDarkTheme ? 'bp3-dark' : ''}`}>
        <Ricorda />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
