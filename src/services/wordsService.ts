import axios, { AxiosResponse } from 'axios';
import { AuthService } from './authService';
import { IWordPair } from '../models/wordPair';
import { IWordsResponse } from './types/words/wordsResponse';
import { ISavedWordsRequest } from './types/words/savedWordsRequest';
import { ISavedWordsResponse } from './types/words/savedWordsResponse';
import { IWordsCountResponse } from './types/words/wordsCountResponse';
import { IWordPairExistsResponse } from './types/words/wordPairExistsResponse';
import { IWordPairExistsRequest } from './types/words/wordPairExistsRequest';

export class WordsService {
  static async createWordPair(
    sourceWord: string,
    translation: string
  ): Promise<void> {
    const token: string = AuthService.getUserToken();

    try {
      await axios.post(
        '/api/words',
        { sourceWord, translation },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async getWordsForToday(): Promise<IWordPair[]> {
    const token: string = AuthService.getUserToken();

    let resp: AxiosResponse<IWordsResponse>;

    try {
      resp = await axios.get<IWordsResponse>('/api/words', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      return Promise.reject(e);
    }

    return resp.data.data;
  }

  static async getSavedWords(
    page: number,
    searchTerm: string
  ): Promise<ISavedWordsResponse> {
    const token: string = AuthService.getUserToken();
    let requestBody: ISavedWordsRequest = {
      word: searchTerm,
    };

    try {
      let resp: AxiosResponse<ISavedWordsResponse> = await axios.post<
        ISavedWordsResponse
      >(`api/words/saved/${page}`, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return resp.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async updateWordPair(wordPair: IWordPair): Promise<void> {
    const token: string = AuthService.getUserToken();

    try {
      await axios.put(`/api/words/${wordPair._id}`, wordPair, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async checkWordPair(wordPair: IWordPair): Promise<void> {
    let todayDate: Date = new Date();

    todayDate.setDate(todayDate.getDate() + 2);

    let changedWordPair: IWordPair = Object.assign({}, wordPair);

    changedWordPair.nextRepetitionDate = todayDate;
    changedWordPair.repetitions++;

    try {
      await this.updateWordPair(changedWordPair);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async getWordsCount(): Promise<number> {
    const token: string = AuthService.getUserToken();

    try {
      let resp: AxiosResponse<IWordsCountResponse> = await axios.get<
        IWordsCountResponse
      >('/api/words/count', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return resp.data.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async wordPairExists(sourceWord: string): Promise<boolean> {
    const token: string = AuthService.getUserToken();
    let requestBody: IWordPairExistsRequest = {
      sourceWord: sourceWord,
    };

    try {
      let resp: AxiosResponse<IWordPairExistsResponse> = await axios.post<
        IWordPairExistsResponse
      >('/api/words/exists', requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return resp.data.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
