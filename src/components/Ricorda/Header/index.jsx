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
  Tag
} from '@blueprintjs/core';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Intent } from '@blueprintjs/core/lib/cjs/common/intent';
import '../styles.css';
import './styles.css';
import { darkThemeService } from '../../../services/darkThemeService';
import { UserContext } from '../contexts/userContext';
import { WordsCountContext } from '../contexts/wordsCountContext';

export const Header = function({ logout, toggleDarkTheme, history }) {
  const [user] = useContext(UserContext);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(darkThemeService.getThemeState());

  useEffect(() => {
    darkThemeService.setThemeState(darkTheme);
  }, [darkTheme]);

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
          onClick={() => history.push('/ricorda/login')}
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
          <Link to={'/ricorda'} className={'navigation-link'}>
            <NavbarHeading>Ricorda</NavbarHeading>
          </Link>
          <NavbarDivider />
        </NavbarGroup>
        <NavbarGroup>
          <Link to={'/ricorda/today-words'} className={'navigation-link'}>
            <WordsCountContext.Consumer>
              {([wordsCount]) => (
                <Button
                  className={Classes.MINIMAL}
                  icon="bookmark"
                  text="Today's words"
                  rightIcon={
                    wordsCount !== null && (
                      <Tag intent={'success'}>{wordsCount}</Tag>
                    )
                  }
                />
              )}
            </WordsCountContext.Consumer>
          </Link>
        </NavbarGroup>
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
        <p>Are you sure you want to log out?</p>
      </Alert>
    </div>
  );
};
