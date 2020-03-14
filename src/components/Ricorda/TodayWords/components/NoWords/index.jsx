import { Button, NonIdealState } from '@blueprintjs/core';
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

export const NoWords = function() {
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
    <NonIdealState
      icon={'clean'}
      title={'No words for today'}
      description={
        'There are no words to repeat for today. You can add new ones or come back tomorrow.'
      }
      action={newWordsPageBtn}
    />
  );
};
