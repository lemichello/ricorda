import Fade from 'react-reveal/Fade';
import React from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import './NoSavedWords.css';

export const NoSavedWords = function() {
  const newWordsPageBtn = (
    <Link to={'/'} className={'navigation-link'}>
      <Button
        className={'page-btn add-new-words-btn'}
        outlined={'true'}
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
