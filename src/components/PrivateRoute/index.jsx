import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { UserContext } from '../Ricorda/contexts/userContext';

export const PrivateRoute = function({ component: Component, ...rest }) {
  return (
    <UserContext.Consumer>
      {([user]) => (
        <Route
          {...rest}
          render={props => {
            if (!user) {
              return (
                <Redirect
                  to={{ pathname: '/login', state: { from: props.location } }}
                />
              );
            }

            return <Component {...props} />;
          }}
        />
      )}
    </UserContext.Consumer>
  );
};
