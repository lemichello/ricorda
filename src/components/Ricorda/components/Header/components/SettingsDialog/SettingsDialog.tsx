/** @jsx jsx */

import { FunctionComponent, useContext, useReducer } from 'react';
import { Dialog, Classes, MenuItem } from '@blueprintjs/core';
import ThemeContext from '../../../../contexts/themeContext';
import { mapValues } from 'lodash';
import { useMediaQuery } from 'react-responsive';
import SecurityPage from './components/SecurityPage/SecurityPage';
import AccountPage from './components/AccountPage/AccountPage';
import AccountSettingsContext from '../../../../contexts/accountSettingsContext';
import { jsx, css, SerializedStyles } from '@emotion/core';

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

  const navListItemStyles: SerializedStyles = css`
    &.mobile > span {
      margin: auto;
    }

    &.mobile > div {
      display: none;
    }
  `;

  return (
    <Dialog
      icon={'cog'}
      title={'Account settings'}
      isOpen={accountSettings.isDialogOpen}
      onClose={() => setAccountSettings({ isDialogOpen: false })}
      className={`${theme.isDarkTheme ? 'bp3-dark' : ''}`}
      css={css`
        padding-bottom: 0;
      `}
    >
      <div
        css={css`
          display: flex;
          width: 100%;
          height: 40vh;
          max-height: 370px;
        `}
      >
        <div
          css={css`
            background-color: #bfccd6;
            border-bottom-left-radius: 6px;
            width: 25%;
            padding: 10px;

            .bp3-dark & {
              background-color: #394b59;
            }
          `}
        >
          <div
            className={`${Classes.LIST_UNSTYLED}`}
            css={css`
              height: 100%;
            `}
          >
            <MenuItem
              active={accountPageActive}
              className={`${isMobile ? 'mobile' : ''}`}
              text={'Account'}
              icon={'user'}
              onClick={() => dispatch({ type: 'SELECT_ACCOUNT_PAGE' })}
              css={navListItemStyles}
            />
            <MenuItem
              active={securityPageActive}
              className={`${isMobile ? 'mobile' : ''}`}
              text={'Security'}
              icon={'shield'}
              onClick={() => dispatch({ type: 'SELECT_SECURITY_PAGE' })}
              css={navListItemStyles}
            />
          </div>
        </div>
        <div
          css={css`
            width: 100%;
            padding: 10px;
            overflow: auto;
          `}
        >
          {securityPageActive && <SecurityPage />}
          {accountPageActive && <AccountPage />}
        </div>
      </div>
    </Dialog>
  );
};

export default SettingsDialog;
