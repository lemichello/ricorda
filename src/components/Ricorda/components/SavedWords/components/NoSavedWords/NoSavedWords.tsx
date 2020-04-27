// @ts-ignore
import Fade from 'react-reveal/Fade';
import React, { FunctionComponent } from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import './NoSavedWords.css';

const NoSavedWords: FunctionComponent = () => {
  const newWordsPageBtn: JSX.Element = (
    <Link to={'/'} className={'navigation-link'}>
      <Button
        className={'page-btn add-new-words-btn'}
        outlined
        text={'Add new words'}
      />
    </Link>
  );

  return (
    <Fade timeout={500} top distance={'100px'}>
      <NonIdealState
        icon={'clean'}
        title={'No saved words'}
        description={'There are no saved words yet. You can add new ones.'}
        action={newWordsPageBtn}
      />
    </Fade>
  );
};

export default NoSavedWords;
