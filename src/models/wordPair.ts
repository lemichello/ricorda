export interface IWordPair {
  _id: string;
  userId: string;
  sourceWord: string;
  translation: string;
  repetitions: number;
  nextRepetitionDate: Date;
}