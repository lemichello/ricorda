import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  FunctionComponent,
} from 'react';
import { WordsService } from '../../../../services/wordsService';
import '../../Ricorda.css';
import './TodayWords.css';
import NoWords from './components/NoWords/NoWords';
import RepeatWord from './components/RepeatWord/RepeatWord';
import { Button, H3, NavbarDivider } from '@blueprintjs/core';
import WordsCountContext from '../../contexts/wordsCountContext';
import WordsSkeleton from './components/WordsSkeleton/WordsSkeleton';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// @ts-ignore
import Fade from 'react-reveal/Fade';
import { IWordPair } from '../../../../models/wordPair';

const TodayWords: FunctionComponent = () => {
  const { setWordsCount } = useContext(WordsCountContext);
  const [words, setWords] = useState<IWordPair[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [wordsDisabled, setWordsDisabled] = useState(false);

  useEffect(() => {
    async function getWordsForToday() {
      let res: IWordPair[] = await WordsService.getWordsForToday();

      setLoading(false);
      setWords(res);
    }

    getWordsForToday();
  }, []);

  useEffect(() => {
    if (words) {
      setWordsCount({ count: words.length, loading: false });
    }

    setWordsDisabled(false);
  }, [setWordsCount, words]);

  const refreshWords: () => void = async () => {
    setWords(undefined);

    setTimeout(async () => {
      setLoading(true);

      let res: IWordPair[] = await WordsService.getWordsForToday();

      setLoading(false);
      setWords(res);
    }, 650);
  };

  const updateWordPair: (
    wordPair: IWordPair,
    callback: () => void
  ) => void = useCallback(
    async (wordsPair, callback) => {
      setWordsDisabled(true);
      await WordsService.checkWordPair(wordsPair);
      callback();
      setWords(words?.filter((x) => x._id !== wordsPair._id));
    },
    [words]
  );

  return (
    <div className={'page-root'}>
      <div className={'page-content'}>
        {(words?.length !== 0 || loading) && (
          <div className={'today-words-heading-block'}>
            <H3
              className={`today-words-heading-text ${
                loading ? 'bp3-skeleton' : ''
              }`}
            >
              Words to repeat for today
            </H3>
            <NavbarDivider />
            <Button
              icon={'repeat'}
              className={`today-words-repeat-btn ${
                loading ? 'bp3-skeleton' : ''
              }`}
              onClick={refreshWords}
            />
          </div>
        )}
        {words?.length === 0 && !loading && <NoWords />}
        {loading && (
          <Fade timeout={500} top distance={'100px'}>
            <WordsSkeleton />
          </Fade>
        )}
        {words?.length !== 0 && (
          <TransitionGroup>
            {words?.map((wordPair) => (
              <CSSTransition
                timeout={700}
                key={wordPair._id}
                classNames={'repeat-word-component'}
              >
                <RepeatWord
                  loading={false}
                  disabled={wordsDisabled}
                  wordPair={wordPair}
                  updateWordPair={updateWordPair}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </div>
    </div>
  );
};

export default TodayWords;
