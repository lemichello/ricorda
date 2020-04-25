import React, { Context, Dispatch } from 'react';
import { IUser } from '../../../services/models/user';

interface IContextFields {
  user: IUser;
  setUser: Dispatch<IUser>;
}

export const UserContext: Context<IContextFields> = React.createContext<
  IContextFields
>({
  user: { token: null },
  setUser: () => {},
});
