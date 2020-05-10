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
  useCallback,
} from 'react';
import ThemeContext from '../../../../contexts/themeContext';
import { WordsService } from '../../../../../../services/wordsService';
import { DefaultToaster } from '../../../../models/DefaultToster';
import { IWordPair } from '../../../../../../models/wordPair';
import { ISentence } from '../../../../../../models/sentence';
import EditWordPairSentences from '../../../EditWordPairSentences/EditWordPairSentences';

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  wordPair?: IWordPair;
}

const EditWordModal: FunctionComponent<IProps> = ({
  isOpen,
  closeModal,
  wordPair,
}) => {
  const { theme } = useContext(ThemeContext);
  const [sourceWord, setSourceWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [sentences, setSentences] = useState([] as ISentence[]);
  const [sentenceIdCounter, setSentenceIdCounter] = useState(1);
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
        sentences: sentences.map((x) => x.text),
      });

      wordPair.sourceWord = sourceWord;
      wordPair.translation = translation;
      wordPair.sentences = sentences.map((x) => x.text);

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

  const isValidFields: () => boolean = () => {
    return !!sourceWord.trim() && !!translation.trim();
  };

  const initializeFormValues: () => void = () => {
    if (!wordPair) {
      return;
    }

    let currentCounter = sentenceIdCounter;

    setSourceWord(wordPair.sourceWord);
    setTranslation(wordPair.translation);
    setSentences(
      wordPair?.sentences?.map((x) => ({
        id: currentCounter++,
        text: x,
      })) ?? []
    );
    setSentenceIdCounter(currentCounter);
  };

  const addNewSentence: (sentence: string) => void = useCallback(
    (sentence: string) => {
      setSentences([
        ...sentences,
        {
          text: sentence,
          id: sentenceIdCounter,
        },
      ]);
      setSentenceIdCounter(sentenceIdCounter + 1);
    },
    [sentenceIdCounter, sentences]
  );

  const removeSentence: (sentenceId: number) => void = useCallback(
    (sentenceId: number) => {
      setSentences(sentences.filter((x) => sentenceId !== x.id));
    },
    [sentences]
  );

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
        <EditWordPairSentences
          sourceWord={sourceWord}
          sentences={sentences}
          addSentence={addNewSentence}
          removeSentence={removeSentence}
        />
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
            disabled={!isValidFields()}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default EditWordModal;
