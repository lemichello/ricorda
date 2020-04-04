import {
  Classes,
  Drawer,
  Menu,
  MenuItem,
  Position,
  Tag
} from '@blueprintjs/core';
import { WordsCountContext } from '../../../../contexts/wordsCountContext';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { darkThemeService } from '../../../../../../services/darkThemeService';

export const MobileMenu = function({ isVisible, toggleMenuVisibility }) {
  const [darkTheme] = useState(darkThemeService.getThemeState());

  return (
    <Drawer
      className={`${darkTheme ? 'bp3-dark' : ''}`}
      isOpen={isVisible}
      position={Position.LEFT}
      size={200}
      onClose={() => toggleMenuVisibility(false)}
      title={'Menu'}
      icon={'menu'}
    >
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          <Menu className={'side-menu'}>
            <WordsCountContext.Consumer>
              {([wordsCount]) => (
                <Link
                  to={'/today-words'}
                  className={'navigation-link'}
                  onClick={() => toggleMenuVisibility(false)}
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
              onClick={() => toggleMenuVisibility(false)}
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
