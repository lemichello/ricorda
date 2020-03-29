import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  EditableText,
  H3,
  H5,
  Icon
} from '@blueprintjs/core';
import '../../Ricorda.css';
import './NewWords.css';
import { authService } from '../../../../services/authService';
import { wordsService } from '../../../../services/wordsService';
import { DefaultToaster } from '../../models/DefaultToster';
import Fade from 'react-reveal/Fade';
import { Intent } from '@blueprintjs/core/lib/cjs/common/intent';
import { darkThemeService } from '../../../../services/darkThemeService';

export const NewWords = function({ history }) {
  const [darkTheme] = useState(darkThemeService.getThemeState());

  const [sourceWord, setSourceWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const isValidWordPair = () => {
    return sourceWord.trim() !== '' && translation.trim() !== '';
  };

  const keyDown = event => {
    if (event.key === 'Enter' && isValidWordPair()) {
      createWordsPair();
    }
  };

  const handleAddButtonClick = async () => {
    if (!authService.getUserToken()) {
      history.push('/login');
      return;
    }

    try {
      setLoading(true);
      if (await wordsService.wordPairExists(sourceWord)) {
        setAlertOpen(true);
        setLoading(false);
      } else {
        createWordsPair();
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const handleAlertConfirm = () => {
    setAlertOpen(false);
    createWordsPair();
  };

  const createWordsPair = async () => {
    try {
      setLoading(true);
      await wordsService.createWordPair(sourceWord, translation);
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
      <div className={'page-content'} onKeyDown={keyDown}>
        <H3>New Word Pair</H3>
        <Fade top timeout={500} distance={'100px'}>
          <Card className={'new-words-page-card'} elevation={2}>
            <div className={'new-words-page-inputs'}>
              <H5 className={'new-words-page-source-input'}>
                <EditableText
                  className={'new-words-editable-text'}
                  placeholder={'Foreign word...'}
                  value={sourceWord}
                  onChange={event => setSourceWord(event)}
                />
              </H5>
              <Icon icon={'chevron-right'} iconSize={Icon.SIZE_LARGE} />
              <H5 className={'new-words-page-source-input'}>
                <EditableText
                  className={'new-words-editable-text'}
                  placeholder={'Translation...'}
                  value={translation}
                  onChange={event => setTranslation(event)}
                />
              </H5>
            </div>
            <Button
              icon={'add'}
              type={'submit'}
              className={'new-words-page-add-btn'}
              loading={loading}
              intent={'success'}
              disabled={!isValidWordPair()}
              onClick={handleAddButtonClick}
            />
          </Card>
        </Fade>
      </div>
      <Alert
        className={`${darkTheme ? 'bp3-dark' : ''}`}
        canEscapeKeyCancel={true}
        isOpen={isAlertOpen}
        onCancel={() => {
          setAlertOpen(false);
        }}
        onConfirm={handleAlertConfirm}
        intent={Intent.PRIMARY}
        cancelButtonText={'Cancel'}
        confirmButtonText={'Yes'}
        icon={'help'}
      >
        <p>
          There is already existing word pair with the same foreign word. Are
          you sure you want to add a new one?
        </p>
      </Alert>
    </div>
  );
};
