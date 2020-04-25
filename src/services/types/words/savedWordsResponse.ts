import { IWordsResponse } from './wordsResponse';

export interface ISavedWordsResponse extends IWordsResponse {
  page: number;
  next: boolean;
}
