import { FunctionComponent, useContext, useReducer } from 'react';
import React from 'react';
import { Dialog, Classes, MenuItem } from '@blueprintjs/core';
import ThemeContext from '../../../../contexts/themeContext';
import { mapValues } from 'lodash';
import './SettingsDialog.css';
import { useMediaQuery } from 'react-responsive';
import SecurityPage from './components/SecurityPage/SecurityPage';
import AccountPage from './components/AccountPage/AccountPage';
import AccountSettingsContext from '../../../../contexts/accountSettingsContext';

type State = {
  securityPageActive: boolean;
  accountPageActive: boolean;
};

type Action =
  | { type: 'SELECT_SECURITY_PAGE' }
  | { type: 'SELECT_ACCOUNT_PAGE' };

const initialState: State = {
  securityPageActive: false,
  accountPageActive: true,
};

function activePageReducer(state: State, action: Action): State {
  let newState: State = mapValues(state, () => false);

  switch (action.type) {
    case 'SELECT_SECURITY_PAGE':
      newState.securityPageActive = true;

      break;
    case 'SELECT_ACCOUNT_PAGE':
      newState.accountPageActive = true;

      break;
    default:
      throw Error('Unknown reducer action');
  }

  return newState;
}

const SettingsDialog: FunctionComponent = () => {
  const { theme } = useContext(ThemeContext);
  const { accountSettings, setAccountSettings } = useContext(
    AccountSettingsContext
  );
  const [{ securityPageActive, accountPageActive }, dispatch] = useReducer(
    activePageReducer,
    initialState
  );
  const isMobile: boolean = useMediaQuery({ query: '(max-width: 576px)' });

  return (
    <Dialog
      icon={'cog'}
      title={'Account settings'}
      isOpen={accountSettings.isDialogOpen}
      onClose={() => setAccountSettings({ isDialogOpen: false })}
      className={`${theme.isDarkTheme ? 'bp3-dark' : ''} settings-dialog`}
    >
      <div className={'settings-dialog-content'}>
        <div className={`settings-nav`}>
          <div className={`${Classes.LIST_UNSTYLED} settings-nav-list`}>
            <MenuItem
              active={accountPageActive}
              className={`settings-nav-list-item ${isMobile ? 'mobile' : ''}`}
              text={'Account'}
              icon={'user'}
              onClick={() => dispatch({ type: 'SELECT_ACCOUNT_PAGE' })}
            />
            <MenuItem
              active={securityPageActive}
              className={`settings-nav-list-item ${isMobile ? 'mobile' : ''}`}
              text={'Security'}
              icon={'shield'}
              onClick={() => dispatch({ type: 'SELECT_SECURITY_PAGE' })}
            />
          </div>
        </div>
        <div className={'settings-page-content'}>
          {securityPageActive && <SecurityPage />}
          {accountPageActive && <AccountPage />}
        </div>
      </div>
    </Dialog>
  );
};

export default SettingsDialog;
