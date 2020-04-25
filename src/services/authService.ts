import axios, { AxiosResponse } from 'axios';
import { ILogInResponse } from './types/login/loginResponse';
import { ISignUpRequest } from './types/signUp/signUpRequest';
import { ILogInRequest } from './types/login/loginRequest';

export class AuthService {
  static async login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<string> {
    let resp: AxiosResponse<ILogInResponse>;
    let requestBody: ILogInRequest = {
      email: email,
      password: password,
    };

    try {
      resp = await axios.post<ILogInResponse>('/auth/login', requestBody);
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

  static async signUp(email: string, password: string): Promise<void> {
    let requestBody: ISignUpRequest = {
      email: email,
      password: password,
    };

    try {
      await axios.post<void>('/auth/signup', requestBody);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static logout(): void {
    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userToken');
  }

  static getUserToken(): string {
    return (
      localStorage.getItem('userToken') ||
      sessionStorage.getItem('userToken') ||
      ''
    );
  }
}
