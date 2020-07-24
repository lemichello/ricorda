/** @jsx jsx */

import { useState, useEffect } from 'react';
import { Ricorda } from './Ricorda/Ricorda';
import axios from 'axios';
import ThemeContext from './Ricorda/contexts/themeContext';
import { ThemeService } from '../services/themeService';
import config from '../config';
import { AuthService } from '../services/authService';
import { Spinner } from '@blueprintjs/core';
import { IUser } from '../apiModels/user';
import { IRefreshTokenResponse } from '../services/types/auth/refreshToken/refreshTokenResponse';
import UserContext from './Ricorda/contexts/userContext';
import { jsx, css, Global } from '@emotion/core';
import { AccountService } from '../services/accountService';

function App() {
  const [theme, setTheme] = useState({
    isDarkTheme: ThemeService.getThemeState(),
  });
  const [user, setUser] = useState<IUser>({
    token: '',
    registrationType: null,
    translationLanguage: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.baseURL = config.apiUrl;

    async function fetchAccessToken(): Promise<void> {
      let resp: IRefreshTokenResponse = await AuthService.refreshAccessToken();

      if (!resp.ok) {
        await AuthService.logOut();

        setUser({
          token: null,
          registrationType: null,
          translationLanguage: null,
        });
        setLoading(false);

        return;
      }

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${resp.accessToken}`;

      const userInfo: Pick<
        IUser,
        'registrationType' | 'translationLanguage'
      > = await AccountService.getUserInfo();

      setUser({
        token: resp.accessToken,
        registrationType: userInfo.registrationType,
        translationLanguage: userInfo.translationLanguage,
      });
      setLoading(false);
    }

    fetchAccessToken();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Global
          styles={css`
            * {
              box-sizing: border-box;
            }

            body > #root > div {
              min-height: 100vh;
            }

            .navigation-link {
              text-decoration: none !important;
              color: inherit !important;
              width: 100%;
              white-space: nowrap;
            }

            .loading-spinner {
              position: fixed;
              top: 50%;
              left: 50%;
            }
          `}
        />
        <div
          className={`${theme.isDarkTheme ? 'bp3-dark' : ''}`}
          css={css`
            &.bp3-dark {
              background-color: #30404d;
            }
          `}
        >
          {loading && <Spinner className={'loading-spinner'} />}
          {!loading && <Ricorda />}
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
