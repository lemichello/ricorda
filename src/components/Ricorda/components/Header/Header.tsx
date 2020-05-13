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
import UserContext from '../../contexts/userContext';
import { useMediaQuery } from 'react-responsive';
import MobileMenu from './components/MobileMenu/MobileMenu';
import TabletMenu from './components/TabletMenu/TabletMenu';
import ThemeContext from '../../contexts/themeContext';
import { History } from 'history';
import { ThemeService } from '../../../../services/themeService';
import AccountSettingsContext from '../../contexts/accountSettingsContext';
import { IAccountSettingsState } from '../../contexts/models/accountSettingsState';

const SettingsDialog = lazy(() =>
  import('./components/SettingsDialog/SettingsDialog')
);

interface IProps {
  logout: () => void;
  history: History;
}

const Header: FunctionComponent<IProps> = ({ logout, history }) => {
  const { user } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const isTablet: boolean = useMediaQuery({ query: '(min-width: 576px)' });
  const isDesktop: boolean = useMediaQuery({ query: '(min-width: 992px)' });
  const isMobile: boolean = !isTablet;
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [accountSettings, setAccountSettings] = useState<IAccountSettingsState>(
    { isDialogOpen: false }
  );
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

  const openSettingsModal: () => void = () => {
    if (!settingsDialogRendered) {
      setSettingsDialogRendered(true);
    }
    setAccountSettings({ isDialogOpen: true });
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
          {!user.token && (
            <div>
              {isDesktop && (
                <Link
                  to={'/login'}
                  className={'navigation-link header-log-in-btn'}
                >
                  <Button minimal>Log in</Button>
                </Link>
              )}
              <Link
                to={'/signup'}
                className={'navigation-link header-sign-up-btn'}
              >
                <Button minimal outlined>
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          <NavbarDivider />
          {user.token && (
            <Popover content={userMenu} position={Position.BOTTOM}>
              <Button
                className={`${Classes.MINIMAL} account-btn ${
                  isDesktop ? 'animated-text-btn' : ''
                }`}
                icon={'user'}
                text={isDesktop ? accountBtnText : undefined}
                onMouseEnter={
                  isDesktop ? () => setAccountBtnText('Account') : undefined
                }
                onMouseLeave={
                  isDesktop ? () => setAccountBtnText(undefined) : undefined
                }
              />
            </Popover>
          )}
          <Button
            className={`${Classes.MINIMAL} dark-mode-btn ${
              isDesktop ? 'animated-text-btn' : ''
            }`}
            icon={theme.isDarkTheme ? 'flash' : 'moon'}
            text={isDesktop ? darkModeBtnText : undefined}
            onClick={handleDarkThemeChange}
            onMouseEnter={
              isDesktop
                ? () =>
                    setDarkModeBtnText(
                      theme.isDarkTheme ? 'Light mode' : 'Dark mode'
                    )
                : undefined
            }
            onMouseLeave={
              isDesktop ? () => setDarkModeBtnText(undefined) : undefined
            }
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
      <AccountSettingsContext.Provider
        value={{ accountSettings, setAccountSettings }}
      >
        <Suspense fallback={<Spinner className={'spinner'} />}>
          {settingsDialogRendered && <SettingsDialog />}
        </Suspense>
      </AccountSettingsContext.Provider>
      <MobileMenu
        isVisible={isMenuOpen}
        setMenuVisibility={toggleMobileMenuVisibility}
      />
    </div>
  );
};

export default Header;
