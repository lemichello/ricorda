import { Route, Router } from 'react-router-dom';
import { history } from '../../helpers/history';
import { Header } from './components/Header';
import { NewWords } from './components/NewWords';
import { PrivateRoute } from '../PrivateRoute';
import { TodayWords } from './components/TodayWords';
import { Login } from './components/LogIn';
import { UserContext } from './contexts/userContext';
import React, { useCallback, useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { SignUp } from './components/SignUp';
import axios from 'axios';
import { WordsCountContext } from './contexts/wordsCountContext';
import { wordsService } from '../../services/wordsService';

export const Ricorda = function({ toggleDarkTheme }) {
  const [user, setUser] = useState(authService.getUserToken());
  const [wordsCount, setWordsCount] = useState(null);

  useEffect(() => {
    async function initRicorda() {
      if (!user) {
        return;
      }

      let count = await wordsService.getWordsCount(user);

      setWordsCount(count);
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
            <PrivateRoute exact path={'/ricorda/today-words'} component={TodayWords} />
            <Route exact path={'/ricorda/login'} component={Login} />
            <Route exact path={'/ricorda/signup'} component={SignUp} />
          </div>
        </Router>
      </WordsCountContext.Provider>
    </UserContext.Provider>
  );
};
