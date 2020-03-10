import { Route, Router } from 'react-router-dom';
import { history } from '../../helpers/history';
import { Header } from './Header';
import { NewWords } from './NewWords';
import { PrivateRoute } from '../PrivateRoute';
import { TodayWords } from './TodayWords';
import { Login } from './LogIn';
import { UserContext } from './contexts/userContext';
import React, { useCallback, useState } from 'react';
import { authService } from '../../services/authService';
import { SignUp } from './SignUp';

export const Ricorda = function({ toggleDarkTheme }) {
  const [user, setUser] = useState(authService.getUserToken());

  let logout = useCallback(() => {
    authService.logout();

    setUser(null);

    history.push('/login');
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
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
    </UserContext.Provider>
  );
};
