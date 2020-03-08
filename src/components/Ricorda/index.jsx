import { Route, Router } from 'react-router-dom';
import { history } from '../../helpers/history';
import { Header } from './Header';
import { NewWords } from './NewWords';
import { PrivateRoute } from '../PrivateRoute';
import { TodayWords } from '../TodayWords';
import { Login } from './Login';
import { UserContext } from './contexts/userContext';
import React, { useCallback, useState } from 'react';
import { authService } from '../../services/authService';

export const Ricorda = function() {
  const user = useState(authService.getUserToken());

  let logout = useCallback(() => {
    authService.logout();

    user[1](null);

    history.push('/login');
  }, [user]);

  return (
    <UserContext.Provider value={user}>
      <Router history={history}>
        <div>
          <Header logout={logout} user={user[0]} />
          <Route exact path={'/'} component={NewWords} />
          <PrivateRoute exact path={'/today-words'} component={TodayWords} />
          <Route exact path={'/login'} component={Login} />
        </div>
      </Router>
    </UserContext.Provider>
  );
};
