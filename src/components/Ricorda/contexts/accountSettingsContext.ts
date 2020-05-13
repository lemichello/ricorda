import React, { Context, Dispatch } from 'react';
import { IAccountSettingsState } from './models/accountSettingsState';

interface IContextFields {
  accountSettings: IAccountSettingsState;
  setAccountSettings: Dispatch<IAccountSettingsState>;
}

const AccountSettingsContext: Context<IContextFields> = React.createContext<
  IContextFields
>({
  accountSettings: { isDialogOpen: false },
  setAccountSettings: () => {},
});

export default AccountSettingsContext;
