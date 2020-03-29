import { Router, Route } from 'react-router-dom';
import { history } from '../../helpers/history';
import { Header } from './components/Header/Header';
import { NewWords } from './components/NewWords/NewWords';
import { PrivateRoute } from '../PrivateRoute';
import { TodayWords } from './components/TodayWords/TodayWords';
import { Login } from './components/LogIn/LogIn';
import { UserContext } from './contexts/userContext';
import React, { useCallback, useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { SignUp } from './components/SignUp/SignUp';
import axios from 'axios';
import { WordsCountContext } from './contexts/wordsCountContext';
import { wordsService } from '../../services/wordsService';
import { DefaultToaster } from './models/DefaultToster';
import config from '../../config';

export const Ricorda = function({ toggleDarkTheme }) {
  const [user, setUser] = useState(authService.getUserToken());
  const [wordsCount, setWordsCount] = useState({ count: null, loading: false });

  useEffect(() => {
    async function initRicorda() {
      if (!user) {
        return;
      }

      try {
        setWordsCount({ count: null, loading: true });
        let count = await wordsService.getWordsCount();
        setWordsCount({ count: count, loading: false });
      } catch (e) {
        setWordsCount({ count: null, loading: false });
      }
    }

    initRicorda();
  }, [user]);

  let logout = useCallback(() => {
    authService.logout();

    setUser(null);
    setWordsCount({ count: null, loading: false });

    history.push('/login');
  }, []);

  axios.defaults.baseURL = config.apiUrl;

  axios.interceptors.response.use(
    resp => {
      return resp;
    },
    error => {
      if (error.response.status === 401) {
        logout();
        window.location.reload();
      }

      DefaultToaster.show({
        message: error.response.data,
        icon: 'error',
        intent: 'danger'
      });

      return Promise.reject(error.response);
    }
  );

  return (
    <UserContext.Provider value={[user, setUser]}>
      <WordsCountContext.Provider value={[wordsCount, setWordsCount]}>
        <Router history={history}>
          <div>
            <Header
              history={history}
              logout={logout}
              user={user}
              toggleDarkTheme={toggleDarkTheme}
            />
            <Route exact path={'/'} component={NewWords} />
            <PrivateRoute exact path={'/today-words'} component={TodayWords} />
            <Route exact path={'/login'} component={Login} />
            <Route exact path={'/signup'} component={SignUp} />
          </div>
        </Router>
      </WordsCountContext.Provider>
    </UserContext.Provider>
  );
};
