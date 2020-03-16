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
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setWordsCount] = useContext(WordsCountContext);

  useEffect(() => {
    async function getWordsForToday() {
      let res = await wordsService.getWordsForToday();
      setLoading(false);

      setWords(res);
    }

    getWordsForToday();
  }, []);

  const updateWordsPair = useCallback(
    async wordsPair => {
      try {
        await wordsService.updateWordsPair(wordsPair);
        setWordsCount({ count: words.length - 1, loading: false });
        setWords(words.filter(x => x._id !== wordsPair._id));
      } catch (e) {
        DefaultToaster.show({
          message: e.data,
          icon: 'error',
          intent: 'danger'
        });
      }
    },
    [setWordsCount, words]
  );

  return (
    <div className={'page-root'}>
      <div className={'page-content'}>
        {(words.length !== 0 || loading) && (
          <H3 className={loading ? 'bp3-skeleton' : ''}>
            Words to repeat for today
          </H3>
        )}
        {words.length === 0 && !loading && <NoWords />}
        {loading && <WordsSkeleton />}
        {words.length !== 0 &&
          words.map(wordsPair => (
            <RepeatWord
              key={wordsPair._id}
              wordsPair={wordsPair}
              updateWordsPair={updateWordsPair}
            />
          ))}
      </div>
    </div>
  );
};
