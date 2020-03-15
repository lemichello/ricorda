import { Route, Router } from 'react-router-dom';
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

export const Ricorda = function({ toggleDarkTheme }) {
  const [user, setUser] = useState(authService.getUserToken());
  const [wordsCount, setWordsCount] = useState(null);

  useEffect(() => {
    async function initRicorda() {
      if (!user) {
        return;
      }

      try {
        let count = await wordsService.getWordsCount(user);
        setWordsCount(count);
      } catch (e) {
        DefaultToaster.show({
          message: e.data,
          intent: 'danger',
          icon: 'error'
        });
      }
    }

    initRicorda();
  }, [user]);

  let logout = useCallback(() => {
    authService.logout();

    setUser(null);
    setWordsCount(null);

    history.push('/ricorda/login');
  }, []);

  axios.interceptors.response.use(
    resp => {
      return resp;
    },
    error => {
      if (error.response.status === 401) {
        logout();
        window.location.reload();
      }

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
            <Route exact path={'/ricorda'} component={NewWords} />
            <PrivateRoute
              exact
              path={'/ricorda/today-words'}
              component={TodayWords}
            />
            <Route exact path={'/ricorda/login'} component={Login} />
            <Route exact path={'/ricorda/signup'} component={SignUp} />
          </div>
        </Router>
      </WordsCountContext.Provider>
    </UserContext.Provider>
  );
};
