import axios from 'axios';
import config from '../config';

async function login(email, password, rememberMe) {
  let resp = await axios.post(`${config.apiUrl}/auth/login`, {
    email,
    password
  });

  if (resp.status !== 200) {
    return handleBadResponse();
  }

  if (rememberMe) {
    localStorage.setItem('userToken', resp.data.token);
  } else {
    sessionStorage.setItem('userToken', resp.data.token);
  }

  return resp.data.token;
}

function handleBadResponse(resp) {
  if (resp.status === 401) {
    logout();
  }

  const error = resp.statusText;

  return Promise.reject(error);
}

function logout() {
  localStorage.removeItem('userToken');
  sessionStorage.removeItem('userToken');
}

async function signUp(email, password) {
  let resp = await axios.post(`${config.apiUrl}/auth/signup`, {
    email,
    password
  });

  if (resp.status !== 201) {
    return handleBadResponse();
  }
}

function getUserToken() {
  return (
    localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
  );
}

export const authService = {
  login,
  logout,
  signUp,
  getUserToken,
  handleBadResponse
};
