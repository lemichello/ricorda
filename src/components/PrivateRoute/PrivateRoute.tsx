import React, { FunctionComponent } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import UserContext from '../Ricorda/contexts/userContext';

interface IProps extends RouteProps {
  component: any;
}

export const PrivateRoute: FunctionComponent<IProps> = ({
  component: Component,
  ...rest
}) => {
  return (
    <UserContext.Consumer>
      {({ user }) => (
        <Route
          {...rest}
          render={(props) => {
            if (!user.token) {
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
