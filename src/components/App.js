import React, { useCallback, useState } from 'react';
import './App.css';
import { Ricorda } from './Ricorda';
import { darkThemeService } from '../services/darkThemeService';

function App() {
  const [isDarkTheme, setDarkTheme] = useState(
    darkThemeService.getThemeState()
  );

  const toggleDarkTheme = useCallback(() => {
    setDarkTheme(!isDarkTheme);
  }, [isDarkTheme]);

  return (
    <div className={`app-root ${isDarkTheme ? 'bp3-dark' : ''}`}>
      <Ricorda toggleDarkTheme={toggleDarkTheme} />
    </div>
  );
}

export default App;
