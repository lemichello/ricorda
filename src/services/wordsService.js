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
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    return Promise.reject(e);
  }

  return resp.data.data;
}

async function getSavedWords(page, searchTerm) {
  const token = authService.getUserToken();

  try {
    let resp = await axios.post(
      `api/words/saved/${page}`,
      { word: searchTerm },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return resp.data;
  } catch (e) {
    return Promise.reject(e);
  }
}

async function updateWordPair(wordPair) {
  const token = authService.getUserToken();

  try {
    await axios.put(`/api/words/${wordPair._id}`, wordPair, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    return Promise.reject(e);
  }
}

async function checkWordPair(wordPair) {
  let todayDate = new Date();

  todayDate.setDate(todayDate.getDate() + 2);

  let changedWordPair = Object.assign({}, wordPair);

  changedWordPair.nextRepetitionDate = todayDate;
  changedWordPair.repetitions++;

  await updateWordPair(changedWordPair);
}

async function getWordsCount() {
  const token = authService.getUserToken();

  try {
    let resp = await axios.get('/api/words/count', {
      headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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
  getSavedWords,
  checkWordPair,
  updateWordPair,
  getWordsCount,
  wordPairExists,
};
