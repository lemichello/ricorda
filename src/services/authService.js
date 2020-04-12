import axios from 'axios';

async function login(email, password, rememberMe) {
  let resp;

  try {
    resp = await axios.post('/auth/login', {
      email,
      password
    });
  } catch (e) {
    return Promise.reject(e);
  }

  if (rememberMe) {
    localStorage.setItem('userToken', resp.data.token);
  } else {
    sessionStorage.setItem('userToken', resp.data.token);
  }

  return resp.data.token;
}

async function signUp(email, password) {
  try {
    await axios.post('/auth/signup', {
      email,
      password
    });
  } catch (e) {
    return Promise.reject(e);
  }
}

function logout() {
  localStorage.removeItem('userToken');
  sessionStorage.removeItem('userToken');
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
  getUserToken
};
