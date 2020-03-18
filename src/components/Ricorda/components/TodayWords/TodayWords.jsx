import React, { useCallback, useContext, useEffect, useState } from 'react';
import { wordsService } from '../../../../services/wordsService';
import '../../Ricorda.css';
import './TodayWords.css';
import { NoWords } from './components/NoWords/NoWords';
import { RepeatWord } from './components/RepeatWord/RepeatWord';
import { H3 } from '@blueprintjs/core';
import { DefaultToaster } from '../../models/DefaultToster';
import { WordsCountContext } from '../../contexts/wordsCountContext';
import { WordsSkeleton } from './components/WordsSkeleton/WordsSkeleton';

export const TodayWords = function() {
  const [, setWordsCount] = useContext(WordsCountContext);
  const [words, setWords] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [wordsDisabled, setWordsDisabled] = useState(false);

  useEffect(() => {
    async function getWordsForToday() {
      let res = await wordsService.getWordsForToday();

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

  const updateWordsPair = useCallback(
    async wordsPair => {
      try {
        setWordsDisabled(true);
        await wordsService.updateWordsPair(wordsPair);
        setWords(words.filter(x => x._id !== wordsPair._id));
      } catch (e) {
        DefaultToaster.show({
          message: e.data,
          icon: 'error',
          intent: 'danger'
        });
      }
    },
    [words]
  );

  return (
    <div className={'page-root'}>
      <div className={'page-content'}>
        {(words?.length !== 0 || loading) && (
          <H3 className={loading ? 'bp3-skeleton' : ''}>
            Words to repeat for today
          </H3>
        )}
        {words?.length === 0 && !loading && <NoWords />}
        {loading && <WordsSkeleton />}
        {words?.length !== 0 &&
        words?.map(wordsPair => (
          <RepeatWord
            disabled={wordsDisabled}
            key={wordsPair._id}
            wordsPair={wordsPair}
            updateWordsPair={updateWordsPair}
          />
        ))}
      </div>
    </div>
  );
};
