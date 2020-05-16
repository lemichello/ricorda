export interface IWordPair {
  _id: string;
  userId: string;
  sourceWord: string;
  sentences: string[];
  translation: string;
  repetitions: number;
  maxRepetitions: number;
  repetitionInterval: number;
  nextRepetitionDate: Date;
}
