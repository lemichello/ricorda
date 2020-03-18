import React, { useState } from 'react';
import { Button, Card, EditableText, H3, H5, Icon } from '@blueprintjs/core';
import '../../Ricorda.css';
import './NewWords.css';
import { authService } from '../../../../services/authService';
import { wordsService } from '../../../../services/wordsService';
import { DefaultToaster } from '../../models/DefaultToster';

export const NewWords = function({ history }) {
  const [sourceWord, setSourceWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  const createWordsPair = async () => {
    if (!authService.getUserToken()) {
      history.push('/login');
      return;
    }

    try {
      setLoading(true);
      await wordsService.createWordsPair(sourceWord, translation);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      return;
    }

    DefaultToaster.show({
      message: 'Successfully created new words pair',
      intent: 'success',
      icon: 'tick'
    });

    setSourceWord('');
    setTranslation('');
  };

  return (
    <div className={'page-root'}>
      <div className={'page-content'}>
        <H3>New Words Pair</H3>
        <Card className={'new-words-page-card'} elevation={2}>
          <div className={'new-words-page-inputs'}>
            <H5 className={'new-words-page-source-input'}>
              <EditableText
                placeholder={'Source word...'}
                value={sourceWord}
                onChange={event => setSourceWord(event)}
              />
            </H5>
            <Icon icon={'chevron-right'} iconSize={Icon.SIZE_LARGE} />
            <H5 className={'new-words-page-source-input'}>
              <EditableText
                placeholder={'Translation...'}
                value={translation}
                onChange={event => setTranslation(event)}
              />
            </H5>
          </div>
          <Button
            icon={'add'}
            className={'new-words-page-add-btn'}
            loading={loading}
            intent={'success'}
            disabled={sourceWord.trim() === '' || translation.trim() === ''}
            onClick={createWordsPair}
          />
        </Card>
      </div>
    </div>
  );
};
