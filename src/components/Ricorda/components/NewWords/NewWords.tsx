/** @jsx jsx */

import {
  useContext,
  useState,
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useEffect,
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
import { WordsService } from '../../../../services/wordsService';
import { DefaultToaster } from '../../../../helpers/DefaultToaster';
// @ts-ignore
import Fade from 'react-reveal/Fade';
import { Intent } from '@blueprintjs/core/lib/cjs/common/intent';
import ThemeContext from '../../contexts/themeContext';
import { History } from 'history';
import EditWordPairSentences from '../EditWordPairSentences/EditWordPairSentences';
import { ISentence } from '../../../../apiModels/sentence';
import RepeatSettings from './components/RepeatSettings/RepeatSettings';
import { jsx, css } from '@emotion/core';
import PageRoot from '../PageRoot/PageRoot';
import {
  cardMediaQueries,
  inputStyles,
  collapseStyles,
} from './styles/NewWordsStyles';
import HelpModal from './components/HelpModal/HelpModal';
import UserContext from '../../contexts/userContext';
import { TranslateService } from '../../../../services/translateService';
import TranslationLanguagesContext from '../../contexts/translationLanguagesContext';
import { AccountService } from '../../../../services/accountService';

interface IProps {
  history: History;
}

const NewWords: FunctionComponent<IProps> = ({ history }) => {
  const { theme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);
  const { translationLanguages } = useContext(TranslationLanguagesContext);

  const [isTranslationLoading, setTranslationLoading] = useState(false);
  const [isSentencesOpen, setSentencesOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isValidTranslationLanguage, setTranslationValidation] = useState(true);

  const [sentences, setSentences] = useState([] as ISentence[]);
  const [maxRepetitions, setMaxRepetitions] = useState(5);
  const [repetitionInterval, setRepetitionInterval] = useState(24);

  const [sourceWord, setSourceWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [translationLanguage, setTranslationLanguage] = useState('');
  const [sentenceIdCounter, setSentenceIdCounter] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (!isValidTranslationLanguage) {
      setTranslationValidation(true);
    }

    AccountService.updateTranslationLanguage(user.translationLanguage!);
    setTranslationLanguage('');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.translationLanguage]);

  const isValidWordPair: () => boolean = () => {
    return (
      sourceWord.trim() !== '' &&
      translation.trim() !== '' &&
      maxRepetitions > 0 &&
      repetitionInterval > 0
    );
  };

  const keyDown: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && isValidWordPair()) {
      createWordsPair();
    }
  };

  const handleAddButtonClick: () => void = async () => {
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
        sentences.map((x) => x.text),
        Math.floor(maxRepetitions),
        Math.floor(repetitionInterval)
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
    setMaxRepetitions(5);
    setRepetitionInterval(24);
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

  const closeHelpModal: () => void = useCallback(() => {
    setHelpModalOpen(false);
  }, []);

  const translateForeignWord: () => void = async () => {
    if (!sourceWord || !isValidTranslationLanguage) {
      return;
    }

    setTranslationLoading(true);

    const translationResult: string = await TranslateService.translate(
      sourceWord,
      translationLanguage ? translationLanguage : user.translationLanguage!
    );

    setTranslation(translationResult);
    setTranslationLoading(false);
  };

  const checkTranslationLanguage: () => void = () => {
    if (
      !translationLanguage ||
      translationLanguages.languages.some((x) => x.code === translationLanguage)
    ) {
      setTranslationValidation(true);
      if (translationLanguage) {
        setUser({
          token: user.token,
          registrationType: user.registrationType,
          translationLanguage: translationLanguage,
        });
      }
    } else {
      setTranslationValidation(false);
    }
  };

  return (
    <PageRoot>
      <H3>New Word Pair</H3>
      <Fade top timeout={500} distance={'100px'}>
        <Card
          elevation={2}
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 90vw;
            transition: width 400ms;

            ${cardMediaQueries}
          `}
          onKeyDown={keyDown}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;

              & > * {
                margin-right: 20px;
              }

              & > h5:nth-of-type(2) {
                margin-right: 0;
              }
            `}
          >
            <H5 css={inputStyles}>
              <EditableText
                placeholder={'Foreign word...'}
                value={sourceWord}
                maxLength={80}
                onChange={(event) => setSourceWord(event)}
                onConfirm={translateForeignWord}
              />
            </H5>
            <Icon icon={'chevron-right'} iconSize={23} />
            <H5 css={inputStyles}>
              <EditableText
                className={isTranslationLoading ? 'bp3-skeleton' : ''}
                placeholder={'Translation...'}
                value={translation}
                maxLength={80}
                onChange={(event) => setTranslation(event)}
              />
            </H5>
          </div>
          <Collapse isOpen={isSentencesOpen} css={collapseStyles}>
            <EditWordPairSentences
              sourceWord={sourceWord}
              sentences={sentences}
              addSentence={addNewSentence}
              removeSentence={removeSentence}
            />
          </Collapse>
          <Collapse isOpen={isSettingsOpen} css={collapseStyles}>
            <RepeatSettings
              maxRepetitions={maxRepetitions}
              repetitionInterval={repetitionInterval}
              setMaxRepetitions={setMaxRepetitions}
              setRepetitionInterval={setRepetitionInterval}
            />
          </Collapse>
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 20px;
              width: 100%;
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              <Button
                minimal
                icon={'help'}
                onClick={() => setHelpModalOpen(!isHelpModalOpen)}
              />
            </div>
            <Button
              icon={'add'}
              type={'submit'}
              loading={loading}
              intent={'success'}
              disabled={!isValidWordPair()}
              onClick={handleAddButtonClick}
              css={css`
                margin-left: auto;
                border-radius: 15px;
                text-transform: uppercase;
                height: 30px;
                width: 100px;
                max-width: 25vw;
              `}
            />
            <div
              css={css`
                display: flex;
                align-items: center;
                margin-left: auto;

                & > .bp3-button:nth-of-type(1) {
                  margin-right: 5px;
                }
              `}
            >
              <H5 css={inputStyles}>
                <EditableText
                  placeholder={user.translationLanguage ?? 'EN'}
                  value={translationLanguage}
                  maxLength={5}
                  onChange={(event) => setTranslationLanguage(event)}
                  onConfirm={checkTranslationLanguage}
                  intent={isValidTranslationLanguage ? 'none' : 'danger'}
                  css={css`
                    text-align: center;
                    font-size: 15px;
                    width: 50px;
                    & input {
                      text-align: center;
                    }

                    & > span {
                      min-width: 0 !important;
                    }
                  `}
                />
              </H5>
              <NavbarDivider />
              <Button
                minimal
                icon={'citation'}
                active={isSentencesOpen}
                onClick={() => setSentencesOpen(!isSentencesOpen)}
              />
              <Button
                minimal
                icon={'cog'}
                active={isSettingsOpen}
                onClick={() => setSettingsOpen(!isSettingsOpen)}
              />
            </div>
          </div>
        </Card>
      </Fade>
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
      <HelpModal isOpen={isHelpModalOpen} close={closeHelpModal} />
    </PageRoot>
  );
};

export default NewWords;
