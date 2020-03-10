import axios from 'axios';
import config from '../config';
import { authService } from './authService';

async function createWordsPair(sourceWord, translation) {
  let token = authService.getUserToken();

  let resp = await axios.post(
    `${config.apiUrl}/api/words`,
    { sourceWord, translation },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (resp.status !== 201) {
    return authService.handleBadResponse();
  }
}

export const wordsService = {
  createWordsPair
};
