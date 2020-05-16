import { Router, Route } from 'react-router-dom';
import { history } from '../../helpers/history';
import Header from './components/Header/Header';
import NewWords from './components/NewWords/NewWords';
import { PrivateRoute } from '../PrivateRoute/PrivateRoute';
import TodayWords from './components/TodayWords/TodayWords';
import LogIn from './components/LogIn/LogIn';
import UserContext from './contexts/userContext';
import React, {
  useCallback,
  useEffect,
  useState,
  FunctionComponent,
  useContext,
} from 'react';
import { AuthService } from '../../services/authService';
import SignUp from './components/SignUp/SignUp';
import axios, { AxiosResponse } from 'axios';
import WordsCountContext from './contexts/wordsCountContext';
import { WordsService } from '../../services/wordsService';
import { DefaultToaster } from '../../helpers/DefaultToaster';
import SavedWords from './components/SavedWords/SavedWords';
import { IWordsCountState } from './contexts/states/wordsCountState';
import { Spinner } from '@blueprintjs/core';
import { IRefreshTokenResponse } from '../../services/types/auth/refreshToken/refreshTokenResponse';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { Global, css } from '@emotion/core';

export const Ricorda: FunctionComponent = () => {
  const { user, setUser } = useContext(UserContext);
  const [wordsCount, setWordsCount] = useState<IWordsCountState>({
    count: null,
    loading: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const refreshAuthLogic = (failedRequest: any) =>
      axios
        .post('/auth/refresh_token', {}, { withCredentials: true })
        .then(async (refreshToken: AxiosResponse<IRefreshTokenResponse>) => {
          if (refreshToken.data.ok) {
            setUser({ token: refreshToken.data.accessToken });

            failedRequest.response.config.headers[
              'Authorization'
            ] = `Bearer ${refreshToken.data.accessToken}`;

            return Promise.resolve();
          } else {
            DefaultToaster.show({
              message: 'Session expired. You need to log in.',
              icon: 'error',
              intent: 'danger',
            });

            return Promise.reject('session expired');
          }
        });

    createAuthRefreshInterceptor(axios, refreshAuthLogic);
  }, [setUser]);

  useEffect(() => {
    if (!user.token) {
      setWordsCount({ count: null, loading: false });
    }
  }, [user.token]);

  let logout: () => void = useCallback(async () => {
    setLoading(true);
    await AuthService.logOut();

    setLoading(false);
    setUser({ token: null });

    history.push('/login');
  }, [setUser]);

  useEffect(() => {
    axios.interceptors.response.use(
      (resp) => {
        return resp;
      },
      async (error) => {
        if (error === 'session expired') {
          logout();
          return Promise.reject();
        }

        if (error.response.status === 403) {
          history.push(`/signup/verify/?email=${error.response.data.email}`);

          return Promise.reject(error.response);
        }

        if (error.response) {
          DefaultToaster.show({
            message: error.response.data,
            icon: 'error',
            intent: 'danger',
          });
        }

        return Promise.reject(error.response);
      }
    );
  }, [logout]);

  useEffect(() => {
    async function initRicorda(): Promise<void> {
      if (!user.token) {
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

      // When only updated access token.
      // No need to fetch words count, as it already fetched.
      if (wordsCount.count !== null) {
        return;
      }

      try {
        setWordsCount({ count: null, loading: true });
        let count: number = await WordsService.getWordsCount();
        setWordsCount({ count: count, loading: false });
      } catch (e) {
        setWordsCount({ count: null, loading: false });
      }
    }

    initRicorda();
  }, [user, wordsCount.count]);

  return (
    <WordsCountContext.Provider value={{ wordsCount, setWordsCount }}>
      <Global
        styles={css`
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
      <Router history={history}>
        {loading && <Spinner className={'loading-spinner'} />}
        <div>
          <Header logout={logout} />
          <Route exact path={'/'} component={NewWords} />
          <PrivateRoute exact path={'/today-words'} component={TodayWords} />
          <PrivateRoute exact path={'/saved-words'} component={SavedWords} />
          <Route
            exact
            path={'/login'}
            render={(props) => <LogIn {...props} userToken={user.token} />}
          />
          <Route
            path={'/signup'}
            render={(props) => <SignUp {...props} userToken={user.token} />}
          />
        </div>
      </Router>
    </WordsCountContext.Provider>
  );
};
