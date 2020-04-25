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
  Switch,
} from '@blueprintjs/core';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  FunctionComponent,
} from 'react';
import { Link } from 'react-router-dom';
import { Intent } from '@blueprintjs/core/lib/cjs/common/intent';
import '../../Ricorda.css';
import './Header.css';
import { UserContext } from '../../contexts/userContext';
import { useMediaQuery } from 'react-responsive';
import { MobileMenu } from './components/MobileMenu/MobileMenu';
import { TabletMenu } from './components/TabletMenu/TabletMenu';
import { ThemeContext } from '../../contexts/themeContext';
import { History } from 'history';
import { ThemeService } from '../../../../services/themeService';

interface IProps {
  logout: () => void;
  history: History;
}

export const Header: FunctionComponent<IProps> = ({ logout, history }) => {
  const { user } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const isTablet: boolean = useMediaQuery({ query: '(min-width: 576px)' });
  const isMobile: boolean = !isTablet;
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    ThemeService.setThemeState(theme.isDarkTheme);
  }, [theme]);

  const toggleMobileMenuVisibility: (visibility: boolean) => void = useCallback(
    (visibility) => {
      setMenuOpen(visibility);
    },
    []
  );

  const handleAlertConfirm: () => void = () => {
    setAlertOpen(false);
    logout();
  };

  const handleDarkThemeChange: () => void = () => {
    setTheme({ isDarkTheme: !theme.isDarkTheme });
  };

  const userMenu: JSX.Element = (
    <Menu>
      {user.token && (
        <MenuItem
          icon={'log-out'}
          text={'Sign out'}
          onClick={() => {
            setAlertOpen(true);
          }}
        />
      )}
      {!user.token && (
        <MenuItem
          icon={'log-in'}
          text={'Log in or Sign up'}
          onClick={() => history.push('/login')}
        />
      )}
    </Menu>
  );

  const settings: JSX.Element = (
    <div className={'settings-content'}>
      <Switch
        checked={theme.isDarkTheme}
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
        {isMobile && (
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
        className={`${theme.isDarkTheme ? 'bp3-dark' : ''}`}
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
        setMenuVisibility={toggleMobileMenuVisibility}
      />
    </div>
  );
};