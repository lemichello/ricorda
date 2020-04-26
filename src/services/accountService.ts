import axios from 'axios';
import { IUpdatePasswordRequest } from './types/account/updatePasswordRequest';
import { AuthService } from './authService';
import { IUpdateEmailRequest } from './types/account/updateEmailRequest';

export class AccountService {
  static async updatePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const token: string = AuthService.getUserToken();
    let requestBody: IUpdatePasswordRequest = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      await axios.put<void>('api/account/update-password', requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async updateEmail(newEmail: string): Promise<void> {
    const token: string = AuthService.getUserToken();
    let requestBody: IUpdateEmailRequest = {
      newEmail: newEmail,
    };

    try {
      await axios.put<void>('api/account/update-email', requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
