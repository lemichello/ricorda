import axios, { AxiosResponse } from 'axios';
import { IWordPair } from '../apiModels/wordPair';
import { IWordsResponse } from './types/words/wordsResponse';
import { ISavedWordsRequest } from './types/words/savedWordsRequest';
import { ISavedWordsResponse } from './types/words/savedWordsResponse';
import { IWordsCountResponse } from './types/words/wordsCountResponse';
import { IWordPairExistsResponse } from './types/words/wordPairExistsResponse';
import { IWordPairExistsRequest } from './types/words/wordPairExistsRequest';
import dayjs from 'dayjs';
import pick from 'lodash/pick';

export class WordsService {
  static async createWordPair(
    sourceWord: string,
    translation: string,
    sentences: string[],
    maxRepetitions: number,
    repetitionInterval: number
  ): Promise<void> {
    try {
      await axios.post('/api/words', {
        sourceWord,
        translation,
        sentences,
        maxRepetitions,
        repetitionInterval,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async getWordsForToday(): Promise<IWordPair[]> {
    let resp: AxiosResponse<IWordsResponse>;

    try {
      resp = await axios.get<IWordsResponse>('/api/words');
    } catch (e) {
      return Promise.reject(e);
    }

    return resp.data.data;
  }

  static async getSavedWords(
    page: number,
    searchTerm: string
  ): Promise<ISavedWordsResponse> {
    let requestBody: ISavedWordsRequest = {
      word: searchTerm,
    };

    try {
      let resp: AxiosResponse<ISavedWordsResponse> = await axios.post<
        ISavedWordsResponse
      >(`api/words/saved/${page}`, requestBody);

      return resp.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async updateWordPair(wordPair: IWordPair): Promise<void> {
    let wordPairRequest: object = pick(wordPair, [
      'sourceWord',
      'translation',
      'nextRepetitionDate',
      'repetitions',
      'sentences',
    ]);

    try {
      await axios.put(`/api/words/${wordPair._id}`, wordPairRequest);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async checkWordPair(wordPair: IWordPair): Promise<void> {
    const nextRepetitionDate: Date = dayjs()
      .add(wordPair.repetitionInterval, 'hour')
      .toDate();

    let changedWordPair: IWordPair = Object.assign({}, wordPair);

    changedWordPair.nextRepetitionDate = nextRepetitionDate;
    changedWordPair.repetitions++;

    try {
      await this.updateWordPair(changedWordPair);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async getWordsCount(): Promise<number> {
    try {
      let resp: AxiosResponse<IWordsCountResponse> = await axios.get<
        IWordsCountResponse
      >('/api/words/count');

      return resp.data.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async wordPairExists(sourceWord: string): Promise<boolean> {
    let requestBody: IWordPairExistsRequest = {
      sourceWord: sourceWord,
    };

    try {
      let resp: AxiosResponse<IWordPairExistsResponse> = await axios.post<
        IWordPairExistsResponse
      >('/api/words/exists', requestBody);

      return resp.data.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
