/** @jsx jsx */

import {
  useCallback,
  useContext,
  useEffect,
  useState,
  FunctionComponent,
} from 'react';
import { WordsService } from '../../../../services/wordsService';
import NoWords from './components/NoWords/NoWords';
import RepeatWord from './components/RepeatWord/RepeatWord';
import { Button, H3, NavbarDivider } from '@blueprintjs/core';
import WordsCountContext from '../../contexts/wordsCountContext';
import WordsSkeleton from './components/WordsSkeleton/WordsSkeleton';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// @ts-ignore
import Fade from 'react-reveal/Fade';
import { IWordPair } from '../../../../apiModels/wordPair';
import { jsx, css, ClassNames } from '@emotion/core';
import PageRoot from '../PageRoot/PageRoot';

const TodayWords: FunctionComponent = () => {
  const { setWordsCount } = useContext(WordsCountContext);
  const [words, setWords] = useState<IWordPair[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [wordsDisabled, setWordsDisabled] = useState(false);

  useEffect(() => {
    async function getWordsForToday() {
      try {
        let res: IWordPair[] = await WordsService.getWordsForToday();

        setWords(res);
      } finally {
        setLoading(false);
      }
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
    <PageRoot>
      {(words?.length !== 0 || loading) && (
        <div
          css={css`
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            width: 75vw;

            @media (min-width: 576px) {
              width: 50vw;
            }
            @media (min-width: 1200px) {
              width: 30vw;
            }
          `}
        >
          <H3
            className={`${loading ? 'bp3-skeleton' : ''}`}
            css={css`
              margin: auto;
              padding-bottom: 5px;
              font-size: 17px !important;

              @media (min-width: 576px) {
                font-size: 22px !important;
              }
            `}
          >
            Words to repeat for today
          </H3>
          <NavbarDivider />
          <Button
            icon={'repeat'}
            className={`${loading ? 'bp3-skeleton' : ''}`}
            onClick={refreshWords}
            css={css`
              margin-right: 20px;
            `}
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
        <ClassNames>
          {({ css }) => (
            <TransitionGroup>
              {words?.map((wordPair) => (
                <CSSTransition
                  timeout={700}
                  key={wordPair._id}
                  classNames={{
                    enter: css({
                      opacity: 0,
                    }),
                    enterActive: css({
                      opacity: 1,
                      transition: 'opacity 700ms',
                    }),
                    exit: css({
                      opacity: 1,
                    }),
                    exitActive: css({
                      opacity: 0,
                      transition: 'opacity 700ms',
                    }),
                  }}
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
        </ClassNames>
      )}
    </PageRoot>
  );
};

export default TodayWords;
