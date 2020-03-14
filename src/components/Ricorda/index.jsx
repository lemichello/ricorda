import { Route, Router } from 'react-router-dom';
import { history } from '../../helpers/history';
import { Header } from './Header';
import { NewWords } from './NewWords';
import { PrivateRoute } from '../PrivateRoute';
import { TodayWords } from './TodayWords';
import { Login } from './LogIn';
import { UserContext } from './contexts/userContext';
import React, { useCallback, useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { SignUp } from './SignUp';
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

    history.push('/login');
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
