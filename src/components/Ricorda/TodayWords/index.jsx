import React, { useCallback, useEffect, useState } from 'react';
import { wordsService } from '../../../services/wordsService';
import '../styles.css';
import './styles.css';
import { NoWords } from './components/NoWords';
import { RepeatWord } from './components/RepeatWord';
import { H3 } from '@blueprintjs/core';
import { DefaultToaster } from '../models/DefaultToster';

export const TodayWords = function() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateWordsPair = useCallback(
    async wordsPair => {
      try {
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

  useEffect(() => {
    async function getWordsForToday() {
      setLoading(true);
      let res = await wordsService.getWordsForToday();
      setLoading(false);

      setWords(res);
    }

    getWordsForToday();
  }, []);

  return (
    <div className={'page-root'}>
      <div className={'page-content'}>
        {(words.length !== 0 || loading) && (
          <H3 className={loading ? 'bp3-skeleton' : ''}>
            Words to repeat for today
          </H3>
        )}
        {words.length === 0 && !loading && <NoWords />}
        {loading && <RepeatWord loading={loading} />}
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
