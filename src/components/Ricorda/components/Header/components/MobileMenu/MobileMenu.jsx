import {
  Classes,
  Drawer,
  Menu,
  MenuItem,
  Position,
  Tag,
} from '@blueprintjs/core';
import { WordsCountContext } from '../../../../contexts/wordsCountContext';
import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { ThemeContext } from '../../../../contexts/themeContext';

export const MobileMenu = function ({ isVisible, setMenuVisibility }) {
  const [theme] = useContext(ThemeContext);

  const closeMenu = () => {
    setMenuVisibility(false);
  };

  return (
    <Drawer
      className={`${theme.isDarkTheme ? 'bp3-dark' : ''}`}
      isOpen={isVisible}
      position={Position.LEFT}
      size={200}
      onClose={closeMenu}
      title={'Menu'}
      icon={'menu'}
    >
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          <Menu className={'side-menu'}>
            <Link to={'/'} className={'navigation-link'} onClick={closeMenu}>
              <MenuItem text={'Home'} icon={'home'} tagName={'span'} />
            </Link>
            <WordsCountContext.Consumer>
              {([wordsCount]) => (
                <Link
                  to={'/today-words'}
                  className={'navigation-link'}
                  onClick={closeMenu}
                >
                  <MenuItem
                    text={"Today's words"}
                    icon={'calendar'}
                    tagName={'span'}
                    labelElement={
                      (wordsCount.count !== null || wordsCount.loading) && (
                        <Tag
                          className={wordsCount.loading ? 'bp3-skeleton' : ''}
                          intent={'success'}
                        >
                          {wordsCount.count && wordsCount.count}
                        </Tag>
                      )
                    }
                  />
                </Link>
              )}
            </WordsCountContext.Consumer>
            <Link
              to={'/saved-words'}
              className={'navigation-link'}
              onClick={closeMenu}
            >
              <MenuItem
                tagName={'span'}
                text={'Saved words'}
                icon={'projects'}
              />
            </Link>
          </Menu>
        </div>
      </div>
    </Drawer>
  );
};
