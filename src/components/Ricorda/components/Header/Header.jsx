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
  Position,
  Switch
} from '@blueprintjs/core';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Intent } from '@blueprintjs/core/lib/cjs/common/intent';
import '../../Ricorda.css';
import './Header.css';
import { darkThemeService } from '../../../../services/darkThemeService';
import { UserContext } from '../../contexts/userContext';
import { useMediaQuery } from 'react-responsive';
import { MobileMenu } from './components/MobileMenu/MobileMenu';
import { TabletMenu } from './components/TabletMenu/TabletMenu';

export const Header = function({ logout, toggleDarkTheme, history }) {
  const isTablet = useMediaQuery({ query: '(min-width: 576px)' });
  const [user] = useContext(UserContext);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(darkThemeService.getThemeState());
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    darkThemeService.setThemeState(darkTheme);
  }, [darkTheme]);

  const toggleMobileMenuVisibility = useCallback(visibility => {
    setMenuOpen(visibility);
  }, []);

  const handleAlertConfirm = () => {
    setAlertOpen(false);
    logout();
  };

  const handleDarkThemeChange = () => {
    setDarkTheme(!darkTheme);
    toggleDarkTheme();
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
      {!user && (
        <MenuItem
          icon={'log-in'}
          text={'Log in or Sign up'}
          onClick={() => history.push('/login')}
        />
      )}
    </Menu>
  );

  const settings = (
    <div className={'settings-content'}>
      <Switch
        checked={darkTheme}
        large={true}
        onChange={handleDarkThemeChange}
        label={'Dark Mode'}
      />
    </div>
  );

  return (
    <div>
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <Link to={'/'} className={'navigation-link'}>
            <NavbarHeading>Ricorda</NavbarHeading>
          </Link>
          <NavbarDivider />
        </NavbarGroup>
        {!isTablet && (
          <NavbarGroup>
            <Button
              className={Classes.MINIMAL}
              icon={'menu'}
              onClick={() => setMenuOpen(true)}
              text={'Menu'}
            />
          </NavbarGroup>
        )}
        {isTablet && <TabletMenu />}
        <NavbarGroup align={Alignment.RIGHT}>
          <NavbarDivider />
          <Popover content={userMenu} position={Position.BOTTOM}>
            <Button className={Classes.MINIMAL} icon={'user'} />
          </Popover>
          <Popover content={settings} position={Position.BOTTOM}>
            <Button className={Classes.MINIMAL} icon={'cog'} />
          </Popover>
        </NavbarGroup>
      </Navbar>
      <Alert
        className={`${darkTheme ? 'bp3-dark' : ''}`}
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
        <p>Are you sure you want to sign out?</p>
      </Alert>
      <MobileMenu
        isVisible={isMenuOpen}
        toggleMenuVisibility={toggleMobileMenuVisibility}
      />
    </div>
  );
};
