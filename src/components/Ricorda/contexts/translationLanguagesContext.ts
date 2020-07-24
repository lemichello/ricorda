import React, { Context, Dispatch } from 'react';
import { ITranslationLanguagesState } from './states/translationLanguagesState';

interface IContextFields {
  translationLanguages: ITranslationLanguagesState;
  setTranslationLanguages: Dispatch<ITranslationLanguagesState>;
}

const TranslationLanguagesContext: Context<IContextFields> = React.createContext<
  IContextFields
>({
  translationLanguages: { languages: [] },
  setTranslationLanguages: () => {},
});

export default TranslationLanguagesContext;
