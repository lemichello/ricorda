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
  MenuDivider,
  Spinner,
} from '@blueprintjs/core';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  FunctionComponent,
  lazy,
  Suspense,
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

const SettingsDialog = lazy(() =>
  import('./components/SettingsDialog/SettingsDialog')
);

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
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settingsDialogRendered, setSettingsDialogRendered] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const [accountBtnText, setAccountBtnText] = useState<string | undefined>(
    undefined
  );
  const [darkModeBtnText, setDarkModeBtnText] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    ThemeService.setThemeState(theme.isDarkTheme);
  }, [theme]);

  const toggleMobileMenuVisibility: (visibility: boolean) => void = useCallback(
    (visibility) => {
      setMenuOpen(visibility);
    },
    []
  );

  useEffect(() => {
    // When user hovering button, updating its text in real-time.
    if (darkModeBtnText !== undefined) {
      setDarkModeBtnText(theme.isDarkTheme ? 'Light mode' : 'Dark mode');
    }
  }, [darkModeBtnText, theme]);

  const closeSettingsModal: () => void = useCallback(() => {
    setSettingsDialogOpen(false);
  }, []);

  const openSettingsModal: () => void = () => {
    if (!settingsDialogRendered) {
      setSettingsDialogRendered(true);
    }
    setSettingsDialogOpen(true);
  };

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
        <div>
          <MenuItem
            icon={'cog'}
            text={'Settings'}
            onClick={openSettingsModal}
          />
          <MenuDivider />
          <MenuItem
            icon={'log-out'}
            text={'Sign out'}
            onClick={() => {
              setAlertOpen(true);
            }}
          />
        </div>
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
            <Button
              className={`${Classes.MINIMAL} account-btn animated-text-btn`}
              icon={'user'}
              text={accountBtnText}
              onMouseEnter={() => setAccountBtnText('Account')}
              onMouseLeave={() => setAccountBtnText(undefined)}
            />
          </Popover>
          <Button
            className={`${Classes.MINIMAL} dark-mode-btn animated-text-btn`}
            icon={theme.isDarkTheme ? 'flash' : 'moon'}
            text={darkModeBtnText}
            onClick={handleDarkThemeChange}
            onMouseEnter={() =>
              setDarkModeBtnText(theme.isDarkTheme ? 'Light mode' : 'Dark mode')
            }
            onMouseLeave={() => setDarkModeBtnText(undefined)}
          />
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
      <Suspense fallback={<Spinner className={'spinner'} />}>
        {settingsDialogRendered && (
          <SettingsDialog
            isOpen={isSettingsDialogOpen}
            closeModal={closeSettingsModal}
          />
        )}
      </Suspense>
      <MobileMenu
        isVisible={isMenuOpen}
        setMenuVisibility={toggleMobileMenuVisibility}
      />
    </div>
  );
};
