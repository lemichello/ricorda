import { IWordPair } from '../../../apiModels/wordPair';

export interface ISavedWordsResponse {
  data: {
    words: IWordPair[];
    count: number;
  };
  page: number;
  next: boolean;
}
