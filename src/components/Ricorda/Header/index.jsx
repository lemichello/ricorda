import {
  Alert,
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Tooltip
} from '@blueprintjs/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Intent } from '@blueprintjs/core/lib/cjs/common/intent';

export const Header = function({ logout, user }) {
  const [isAlertOpen, setAlertOpen] = useState(false);

  const handleAlertConfirm = () => {
    setAlertOpen(false);
    logout();
  };

  return (
    <div>
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <NavbarHeading>Ricorda</NavbarHeading>
          </Link>
          <NavbarDivider />
        </NavbarGroup>
        <NavbarGroup>
          <Link to={'/today-words'} style={{ textDecoration: 'none' }}>
            <Button
              className={Classes.MINIMAL}
              icon="star"
              text="Today's words"
            />
          </Link>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <NavbarDivider />
          {user && (
            <Tooltip content={'Logout'}>
              <Button
                className={Classes.MINIMAL}
                icon={'log-out'}
                onClick={() => {
                  setAlertOpen(true);
                }}
              />
            </Tooltip>
          )}
          {!user && (
            <Link to={'/login'} style={{ textDecoration: 'none' }}>
              <Tooltip content={'Login'}>
                <Button
                  className={Classes.MINIMAL}
                  icon={'log-in'}
                  onClick={logout}
                />
              </Tooltip>
            </Link>
          )}
        </NavbarGroup>
      </Navbar>
      <Alert
        canEscapeKeyCancel={true}
        isOpen={isAlertOpen}
        onCancel={() => {
          setAlertOpen(false);
        }}
        onConfirm={handleAlertConfirm}
        intent={Intent.WARNING}
        cancelButtonText={'Cancel'}
        confirmButtonText={'Yes'}
        icon={'log-out'}
      >
        <p>Are you sure you want to log out?</p>
      </Alert>
    </div>
  );
};
