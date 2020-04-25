import { Link } from 'react-router-dom';
import { WordsCountContext } from '../../../../contexts/wordsCountContext';
import { Button, Classes, NavbarGroup, Tag } from '@blueprintjs/core';
import React, { FunctionComponent } from 'react';

export const TabletMenu: FunctionComponent = () => {
  return (
    <NavbarGroup>
      <Link to={'/'} className={'navigation-link'}>
        <Button className={Classes.MINIMAL} icon={'home'} text={'Home'} />
      </Link>
      <Link to={'/today-words'} className={'navigation-link'}>
        <WordsCountContext.Consumer>
          {({ wordsCount }) => (
            <Button
              className={Classes.MINIMAL}
              icon="calendar"
              text={"Today's words"}
              rightIcon={
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
          )}
        </WordsCountContext.Consumer>
      </Link>
      <Link to={'/saved-words'} className={'navigation-link'}>
        <Button
          className={Classes.MINIMAL}
          text={'Saved words'}
          icon={'projects'}
        />
      </Link>
    </NavbarGroup>
  );
};
