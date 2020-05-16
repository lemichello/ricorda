import React, { Context, Dispatch } from 'react';
import { IUser } from '../../../apiModels/user';

interface IContextFields {
  user: IUser;
  setUser: Dispatch<IUser>;
}

const UserContext: Context<IContextFields> = React.createContext<
  IContextFields
>({
  user: { token: null },
  setUser: () => {},
});

export default UserContext;
