import { FunctionComponent, useContext, useReducer } from 'react';
import React from 'react';
import { Dialog, Classes, MenuItem } from '@blueprintjs/core';
import { ThemeContext } from '../../../../contexts/themeContext';
import { mapValues } from 'lodash';
import './SettingsDialog.css';
import { useMediaQuery } from 'react-responsive';
import SecurityPage from './components/SecurityPage/SecurityPage';
import AccountPage from './components/AccountPage/AccountPage';

type State = {
  securityPageActive: boolean;
  accountPageActive: boolean;
};

type Action =
  | { type: 'select-security-page' }
  | { type: 'select-account-page' };

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
}

const initialState: State = {
  securityPageActive: false,
  accountPageActive: true,
};

function activePageReducer(state: State, action: Action): State {
  let newState: State = mapValues(state, () => false);

  switch (action.type) {
    case 'select-security-page':
      newState.securityPageActive = true;
      break;
    case 'select-account-page':
      newState.accountPageActive = true;
      break;
    default:
      throw Error('Unknown reducer action');
  }

  return newState;
}

const SettingsDialog: FunctionComponent<IProps> = ({ isOpen, closeModal }) => {
  const { theme } = useContext(ThemeContext);
  const [{ securityPageActive, accountPageActive }, dispatch] = useReducer(
    activePageReducer,
    initialState
  );
  const isTablet: boolean = useMediaQuery({ query: '(min-width: 576px)' });

  return (
    <Dialog
      icon={'cog'}
      title={'Account settings'}
      isOpen={isOpen}
      onClose={closeModal}
      className={`${theme.isDarkTheme ? 'bp3-dark' : ''} settings-dialog`}
    >
      <div className={'settings-dialog-content'}>
        <div className={`settings-nav`}>
          <div className={`${Classes.LIST_UNSTYLED} settings-nav-list`}>
            <MenuItem
              active={accountPageActive}
              className={`settings-nav-list-item ${isTablet ? '' : 'mobile'}`}
              text={isTablet ? 'Account' : undefined}
              icon={'user'}
              onClick={() => dispatch({ type: 'select-account-page' })}
            />
            <MenuItem
              active={securityPageActive}
              className={`settings-nav-list-item ${isTablet ? '' : 'mobile'}`}
              text={'Security'}
              icon={'shield'}
              onClick={() => dispatch({ type: 'select-security-page' })}
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
