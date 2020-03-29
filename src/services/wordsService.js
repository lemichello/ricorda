import axios from 'axios';
import { authService } from './authService';

async function createWordPair(sourceWord, translation) {
  const token = authService.getUserToken();

  let resp = await axios.post(
    '/api/words',
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
    resp = await axios.get('/api/words', {
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
    await axios.put(`/api/words/${word._id}`, word, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (e) {
    return Promise.reject(e);
  }
}

async function getWordsCount() {
  const token = authService.getUserToken();

  try {
    let resp = await axios.get('/api/words/count', {
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
      '/api/words/exists',
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
