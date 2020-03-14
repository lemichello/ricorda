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

async function updateWordsPair(word) {
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

async function getWordsCount(token) {
  let resp = await axios.get(`${config.apiUrl}/api/words/count`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return resp.data.data;
}

export const wordsService = {
  createWordsPair,
  getWordsForToday,
  updateWordsPair,
  getWordsCount
};
