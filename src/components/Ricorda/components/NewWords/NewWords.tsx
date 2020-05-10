import React, {
  useContext,
  useState,
  FunctionComponent,
  KeyboardEvent,
  useCallback,
} from 'react';
import {
  Alert,
  Button,
  Card,
  EditableText,
  H3,
  H5,
  Icon,
  NavbarDivider,
  Collapse,
} from '@blueprintjs/core';
import '../../Ricorda.css';
import './NewWords.css';
import { WordsService } from '../../../../services/wordsService';
import { DefaultToaster } from '../../models/DefaultToster';
// @ts-ignore
import Fade from 'react-reveal/Fade';
import { Intent } from '@blueprintjs/core/lib/cjs/common/intent';
import ThemeContext from '../../contexts/themeContext';
import { History } from 'history';
import UserContext from '../../contexts/userContext';
import EditWordPairSentences from '../EditWordPairSentences/EditWordPairSentences';
import { ISentence } from '../../../../models/sentence';

interface IProps {
  history: History;
}

const NewWords: FunctionComponent<IProps> = ({ history }) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  const [isSentencesOpen, setSentencesOpen] = useState(false);

  const [sourceWord, setSourceWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [sentences, setSentences] = useState([] as ISentence[]);
  const [sentenceIdCounter, setSentenceIdCounter] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const isValidWordPair: () => boolean = () => {
    return sourceWord.trim() !== '' && translation.trim() !== '';
  };

  const keyDown: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && isValidWordPair()) {
      createWordsPair();
    }
  };

  const handleAddButtonClick: () => void = async () => {
    if (!user.token) {
      history.push('/login');
      return;
    }

    try {
      setLoading(true);
      if (await WordsService.wordPairExists(sourceWord)) {
        setAlertOpen(true);
        setLoading(false);
      } else {
        createWordsPair();
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const handleAlertConfirm: () => void = () => {
    setAlertOpen(false);
    createWordsPair();
  };

  const createWordsPair: () => void = async () => {
    try {
      setLoading(true);
      await WordsService.createWordPair(
        sourceWord,
        translation,
        sentences.map((x) => x.text)
      );
    } catch (e) {
      return;
    } finally {
      setLoading(false);
    }

    DefaultToaster.show({
      message: 'Successfully created new word pair',
      intent: 'success',
      icon: 'tick',
    });

    setSourceWord('');
    setTranslation('');
    setSentences([]);
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
    <div className={'page-root'}>
      <div className={'page-content'} onKeyDown={keyDown}>
        <H3>New Word Pair</H3>
        <Fade top timeout={500} distance={'100px'}>
          <Card
            className={`new-words-page-card ${
              isSentencesOpen ? 'detailed' : ''
            }`}
            elevation={2}
          >
            <div className={'new-words-page-inputs'}>
              <H5 className={'new-words-page-input'}>
                <EditableText
                  className={'new-words-editable-text'}
                  placeholder={'Foreign word...'}
                  value={sourceWord}
                  maxLength={80}
                  onChange={(event) => setSourceWord(event)}
                />
              </H5>
              <Icon icon={'chevron-right'} iconSize={23} />
              <H5 className={'new-words-page-input'}>
                <EditableText
                  className={'new-words-editable-text'}
                  placeholder={'Translation...'}
                  value={translation}
                  maxLength={80}
                  onChange={(event) => setTranslation(event)}
                />
              </H5>
            </div>
            <Collapse
              isOpen={isSentencesOpen}
              className={'new-words-page-sentences'}
              transitionDuration={450}
            >
              <EditWordPairSentences
                sourceWord={sourceWord}
                sentences={sentences}
                addSentence={addNewSentence}
                removeSentence={removeSentence}
              />
            </Collapse>
            <div className={'new-words-page-actions'}>
              <Button
                icon={'add'}
                type={'submit'}
                className={'new-words-page-add-btn'}
                loading={loading}
                intent={'success'}
                disabled={!isValidWordPair()}
                onClick={handleAddButtonClick}
              />
              <div className={'new-words-page-actions-others'}>
                <NavbarDivider />
                <Button
                  minimal
                  icon={'citation'}
                  active={isSentencesOpen}
                  onClick={() => setSentencesOpen(!isSentencesOpen)}
                />
              </div>
            </div>
          </Card>
        </Fade>
      </div>
      <Alert
        className={`${theme.isDarkTheme ? 'bp3-dark' : ''}`}
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

export default NewWords;
