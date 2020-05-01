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
import { DefaultToaster } from './models/DefaultToster';
import SavedWords from './components/SavedWords/SavedWords';
import { IWordsCountState } from './contexts/models/wordsCountState';
import { Spinner } from '@blueprintjs/core';
import { IRefreshTokenResponse } from '../../services/types/auth/refreshToken/refreshTokenResponse';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

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

            return Promise.reject('session exprired');
          }
        });

    createAuthRefreshInterceptor(axios, refreshAuthLogic);
  }, [setUser]);

  let logout: () => void = useCallback(async () => {
    setLoading(true);
    await AuthService.logOut();

    setLoading(false);
    setUser({ token: null });
    setWordsCount({ count: null, loading: false });

    history.push('/login');
  }, [setUser]);

  useEffect(() => {
    axios.interceptors.response.use(
      (resp) => {
        return resp;
      },
      async (error) => {
        if (error === 'session exprired') {
          logout();
          return Promise.reject();
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

      // When just updated access token.
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
      <Router history={history}>
        {loading && <Spinner className={'spinner'} />}
        <div>
          <Header history={history} logout={logout} />
          <Route exact path={'/'} component={NewWords} />
          <PrivateRoute exact path={'/today-words'} component={TodayWords} />
          <PrivateRoute exact path={'/saved-words'} component={SavedWords} />
          <Route exact path={'/login'} component={LogIn} />
          <Route exact path={'/signup'} component={SignUp} />
        </div>
      </Router>
    </WordsCountContext.Provider>
  );
};
