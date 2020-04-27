import React, { Context, Dispatch } from 'react';
import { IWordsCountState } from './models/wordsCountState';

interface IContextFields {
  wordsCount: IWordsCountState;
  setWordsCount: Dispatch<IWordsCountState>;
}

const WordsCountContext: Context<IContextFields> = React.createContext<
  IContextFields
>({
  wordsCount: { count: null, loading: false },
  setWordsCount: () => {},
});

export default WordsCountContext;
