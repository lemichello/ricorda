import axios from 'axios';
import { IUpdatePasswordRequest } from './types/account/updatePasswordRequest';
import { IUpdateEmailRequest } from './types/account/updateEmailRequest';

export class AccountService {
  static async updatePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    let requestBody: IUpdatePasswordRequest = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      await axios.put<void>('api/account/update-password', requestBody);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async updateEmail(newEmail: string): Promise<void> {
    let requestBody: IUpdateEmailRequest = {
      newEmail: newEmail,
    };

    try {
      await axios.put<void>('api/account/update-email', requestBody);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async revokeToken(): Promise<void> {
    try {
      await axios.post(
        'api/account/revoke_refresh_token',
        {},
        { withCredentials: true }
      );
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
