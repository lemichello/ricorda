import axios, { AxiosResponse } from 'axios';
import { ILogInResponse } from './types/auth/login/loginResponse';
import { ISignUpRequest } from './types/auth/signUp/signUpRequest';
import { ILogInRequest } from './types/auth/login/loginRequest';
import { IRefreshTokenResponse } from './types/auth/refreshToken/refreshTokenResponse';

export class AuthService {
  static async login(
    email: string,
    password: string,
    recaptchaToken: string,
    rememberMe: boolean
  ): Promise<string> {
    let resp: AxiosResponse<ILogInResponse>;
    let requestBody: ILogInRequest = {
      email: email,
      password,
      recaptchaToken,
      rememberMe,
    };

    try {
      resp = await axios.post<ILogInResponse>('/auth/login', requestBody, {
        withCredentials: true,
      });
    } catch (e) {
      return Promise.reject(e);
    }

    return resp.data.token;
  }

  static async loginWithGoogle(idToken: string): Promise<string> {
    try {
      let resp: AxiosResponse<ILogInResponse> = await axios.post<
        ILogInResponse
      >(
        '/auth/login-with-google',
        {},
        {
          headers: {
            Authorization: idToken,
          },
          withCredentials: true,
        }
      );

      return resp.data.token;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async logOut(): Promise<void> {
    await axios.post('/auth/logout', {}, { withCredentials: true });
  }

  static async signUp(
    email: string,
    password: string,
    recaptchaToken: string
  ): Promise<void> {
    let requestBody: ISignUpRequest = {
      email,
      password,
      recaptchaToken,
    };

    try {
      await axios.post<void>('/auth/signup', requestBody);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async refreshAccessToken(): Promise<IRefreshTokenResponse> {
    let resp: AxiosResponse<IRefreshTokenResponse> = await axios.post<
      IRefreshTokenResponse
    >('/auth/refresh_token', {}, { withCredentials: true });

    return resp.data;
  }

  static async resendVerificationEmail(email: string): Promise<void> {
    try {
      await axios.post('/auth/resend-email-verification', { email });
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
