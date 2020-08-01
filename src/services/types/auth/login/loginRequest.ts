export interface ILogInRequest {
  email: string;
  password: string;
  recaptchaToken: string;
  rememberMe: boolean;
}
