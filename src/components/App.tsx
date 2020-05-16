import React, { useState, useEffect } from 'react';
import { Ricorda } from './Ricorda/Ricorda';
import axios from 'axios';
import ThemeContext from './Ricorda/contexts/themeContext';
import { ThemeService } from '../services/themeService';
import './App.css';
import config from '../config';
import { AuthService } from '../services/authService';
import { Spinner } from '@blueprintjs/core';
import { IUser } from '../apiModels/user';

import { IRefreshTokenResponse } from '../services/types/auth/refreshToken/refreshTokenResponse';
import UserContext from './Ricorda/contexts/userContext';

function App() {
  const [theme, setTheme] = useState({
    isDarkTheme: ThemeService.getThemeState(),
  });
  const [user, setUser] = useState<IUser>({
    token: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.baseURL = config.apiUrl;

    async function fetchAccessToken(): Promise<void> {
      let resp: IRefreshTokenResponse = await AuthService.refreshAccessToken();

      if (!resp.ok) {
        await AuthService.logOut();
      }

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${resp.accessToken}`;

      setUser({ token: resp.accessToken });
      setLoading(false);
    }

    fetchAccessToken();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <div className={`app-root ${theme.isDarkTheme ? 'bp3-dark' : ''}`}>
          {loading && <Spinner className={'loading-spinner'} />}
          {!loading && <Ricorda />}
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
