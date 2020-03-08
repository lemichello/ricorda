import {
  Alert,
  Alignment,
  Button,
  Classes,
  Menu,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position
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

  const userMenu = (
    <Menu>
      {user && (
        <MenuItem
          icon={'log-out'}
          text={'Sign out'}
          onClick={() => {
            setAlertOpen(true);
          }}
        />
      )}
      {!user && <MenuItem icon={'log-in'} text={'Log in or Sign up'} href={'/login'} />}
    </Menu>
  );

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
          <Popover content={userMenu} position={Position.BOTTOM}>
            <Button className={Classes.MINIMAL} icon={'user'} />
          </Popover>
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
