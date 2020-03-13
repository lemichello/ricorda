import axios from 'axios';
import config from '../config';
import { authService } from './authService';

async function createWordsPair(sourceWord, translation) {
  const token = authService.getUserToken();

  let resp = await axios.post(
    `${config.apiUrl}/api/words`,
    { sourceWord, translation },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (resp.status !== 201) {
    return authService.handleBadResponse(resp);
  }
}

async function getWordsForToday() {
  const token = authService.getUserToken();

  let resp = await axios.get(`${config.apiUrl}/api/words`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (resp.status !== 200) {
    return authService.handleBadResponse(resp);
  }

  return resp.data.data;
}

export const wordsService = {
  createWordsPair,
  getWordsForToday
};
