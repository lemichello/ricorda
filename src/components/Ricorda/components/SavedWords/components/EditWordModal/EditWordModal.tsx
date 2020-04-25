import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
} from '@blueprintjs/core';
import React, {
  useContext,
  useState,
  FunctionComponent,
  ChangeEvent,
} from 'react';
import { ThemeContext } from '../../../../contexts/themeContext';
import { WordsService } from '../../../../../../services/wordsService';
import { DefaultToaster } from '../../../../models/DefaultToster';
import { IWordPair } from '../../../../../../services/models/wordPair';

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  wordPair?: IWordPair;
}

export const EditWordModal: FunctionComponent<IProps> = ({
  isOpen,
  closeModal,
  wordPair,
}) => {
  const { theme } = useContext(ThemeContext);
  const [sourceWord, setSourceWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose: () => void = () => {
    setSourceWord('');
    setTranslation('');
    closeModal();
  };

  const handleEdit: () => void = async () => {
    if (!wordPair) {
      return;
    }

    try {
      setLoading(true);

      await WordsService.updateWordPair({
        ...wordPair,
        sourceWord,
        translation,
      });

      wordPair.sourceWord = sourceWord;
      wordPair.translation = translation;

      DefaultToaster.show({
        message: 'Successfully updated word pair',
        intent: 'success',
        icon: 'tick',
      });

      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const initializeFormValues: () => void = () => {
    if (wordPair) {
      setSourceWord(wordPair.sourceWord);
      setTranslation(wordPair.translation);
    }
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSourceWord(e.target.value)
            }
          />
        </FormGroup>
        <FormGroup label={'Translation'} labelInfo={'(required)'}>
          <InputGroup
            placeholder={'Translation'}
            value={translation}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTranslation(e.target.value)
            }
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
