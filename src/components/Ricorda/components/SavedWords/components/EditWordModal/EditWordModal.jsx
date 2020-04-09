import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup
} from '@blueprintjs/core';
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../../../contexts/themeContext';
import { wordsService } from '../../../../../../services/wordsService';
import { DefaultToaster } from '../../../../models/DefaultToster';

export const EditWordModal = function({ isOpen, closeModal, wordPair }) {
  const [theme] = useContext(ThemeContext);
  const [sourceWord, setSourceWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setSourceWord('');
    setTranslation('');
    closeModal();
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      await wordsService.updateWordPair({
        sourceWord,
        translation,
        _id: wordPair._id
      });

      wordPair.sourceWord = sourceWord;
      wordPair.translation = translation;

      DefaultToaster.show({
        message: 'Successfully updated word pair',
        intent: 'success',
        icon: 'tick'
      });

      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const initializeFormValues = () => {
    setSourceWord(wordPair.sourceWord);
    setTranslation(wordPair.translation);
  };

  return (
    <Dialog
      className={`${theme.isDarkTheme ? 'bp3-dark' : ''}`}
      icon={'edit'}
      title={'Edit word pair'}
      isOpen={isOpen}
      onOpening={initializeFormValues}
      onClose={handleClose}
    >
      <div className={Classes.DIALOG_BODY}>
        <FormGroup label={'Foreign word'} labelInfo={'(required)'}>
          <InputGroup
            placeholder={'Foreign word'}
            value={sourceWord}
            onChange={e => setSourceWord(e.target.value)}
          />
        </FormGroup>
        <FormGroup label={'Translation'} labelInfo={'(required)'}>
          <InputGroup
            placeholder={'Translation'}
            value={translation}
            onChange={e => setTranslation(e.target.value)}
          />
        </FormGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            icon={'cross'}
            text={'Cancel'}
            onClick={handleClose}
            disabled={loading}
          />
          <Button
            icon={'tick'}
            intent={'success'}
            text={'Update'}
            onClick={handleEdit}
            loading={loading}
          />
        </div>
      </div>
    </Dialog>
  );
};
