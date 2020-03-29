import axios from 'axios';
import config from '../config';
import { authService } from './authService';

async function createWordPair(sourceWord, translation) {
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
  let resp;

  try {
    resp = await axios.get(`${config.apiUrl}/api/words`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (e) {
    return Promise.reject(e);
  }

  return resp.data.data;
}

async function updateWordPair(word) {
  const token = authService.getUserToken();
  let todayDate = new Date();

  todayDate.setDate(todayDate.getDate() + 2);
  word.nextRepetitionDate = todayDate;
  word.repetitions++;

  try {
    await axios.put(`${config.apiUrl}/api/words/${word._id}`, word, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (e) {
    return Promise.reject(e);
  }
}

async function getWordsCount() {
  const token = authService.getUserToken();

  try {
    let resp = await axios.get(`${config.apiUrl}/api/words/count`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return resp.data.data;
  } catch (e) {
    return Promise.reject(e);
  }
}

async function wordPairExists(sourceWord) {
  const token = authService.getUserToken();

  try {
    let resp = await axios.post(
      `${config.apiUrl}/api/words/exists`,
      { sourceWord },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return resp.data.data;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const wordsService = {
  createWordPair,
  getWordsForToday,
  updateWordPair,
  getWordsCount,
  wordPairExists
};
