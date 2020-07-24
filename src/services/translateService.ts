import { ILanguagesResponse } from './types/translate/languages/ILanguagesResponse';
import axios, { AxiosResponse } from 'axios';
import { ITranslationLanguage } from '../apiModels/ITranslationLanguage';
import dayjs from 'dayjs';

interface ITranslationLanguagesRecord {
  languages: ITranslationLanguage[];
  nextUpdateDate: Date;
}

export class TranslateService {
  static async translate(
    foreignWord: string,
    language: string
  ): Promise<string> {
    try {
      const translation: AxiosResponse<{ data: string }> = await axios.post<{
        data: string;
      }>(
        '/api/translate/',
        { text: foreignWord, targetLanguage: language },
        { withCredentials: true }
      );

      return translation.data.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async getTranslationLanguages(): Promise<ITranslationLanguage[]> {
    try {
      const translationLanguages: ITranslationLanguagesRecord = JSON.parse(
        localStorage.getItem('translation_languages')!
      );
      if (
        translationLanguages &&
        dayjs().isBefore(translationLanguages.nextUpdateDate)
      ) {
        return translationLanguages.languages;
      } else {
        const resp: AxiosResponse<ILanguagesResponse> = await axios.get<
          ILanguagesResponse
        >('/api/translate/languages', {
          withCredentials: true,
        });

        localStorage.setItem(
          'translation_languages',
          JSON.stringify({
            languages: resp.data.data,
            nextUpdateDate: dayjs().add(5, 'day'),
          })
        );

        return resp.data.data;
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
