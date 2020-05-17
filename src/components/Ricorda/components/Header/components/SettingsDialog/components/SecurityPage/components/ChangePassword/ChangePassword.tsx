/** @jsx jsx */

import { FunctionComponent, useState, ChangeEvent, useContext } from 'react';
import { FormGroup, InputGroup, Button } from '@blueprintjs/core';
import { AccountService } from '../../../../../../../../../../services/accountService';
import { DefaultToaster } from '../../../../../../../../../../helpers/DefaultToaster';
import { useMediaQuery } from 'react-responsive';
import AccountSettingsContext from '../../../../../../../../contexts/accountSettingsContext';
import { useHistory } from 'react-router-dom';
import UserContext from '../../../../../../../../contexts/userContext';
import { History } from 'history';
import SectionHeader from '../../../SectionHeader/SectionHeader';
import { jsx, css, SerializedStyles } from '@emotion/core';

const ChangePassword: FunctionComponent = () => {
  const { setAccountSettings } = useContext(AccountSettingsContext);
  const { setUser } = useContext(UserContext);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [loading, setLoading] = useState(false);

  const isMobile: boolean = useMediaQuery({ query: '(max-width: 576px)' });
  const history: History = useHistory();

  const isValidState: () => boolean = () => {
    return (
      !!oldPassword &&
      !!newPassword &&
      !!newPasswordRepeat &&
      newPassword === newPasswordRepeat
    );
  };

  const updatePassword: () => void = async () => {
    try {
      setLoading(true);
      await AccountService.updatePassword(oldPassword, newPassword);
      await AccountService.revokeToken();
    } catch (e) {
      return;
    } finally {
      setLoading(false);
    }

    setOldPassword('');
    setNewPassword('');
    setNewPasswordRepeat('');

    setAccountSettings({ isDialogOpen: false });
    setUser({ token: null });

    history.push('/login');

    DefaultToaster.show({
      message: 'Successfully updated password',
      intent: 'success',
      icon: 'tick',
    });
  };

  const inputStyles: SerializedStyles = css`
    width: 230px;
  `;

  return (
    <div>
      <SectionHeader text={'Change password'} icon={'key'} />
      <FormGroup label={'Old password'}>
        <InputGroup
          type={'password'}
          small={isMobile}
          value={oldPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setOldPassword(e.target.value)
          }
          css={inputStyles}
        />
      </FormGroup>
      <FormGroup label={'New password'}>
        <InputGroup
          type={'password'}
          small={isMobile}
          value={newPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewPassword(e.target.value)
          }
          css={inputStyles}
        />
      </FormGroup>
      <FormGroup label={'Confirm new password'}>
        <InputGroup
          type={'password'}
          small={isMobile}
          value={newPasswordRepeat}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewPasswordRepeat(e.target.value)
          }
          css={inputStyles}
        />
      </FormGroup>
      <Button
        small={isMobile}
        text={'Update password'}
        disabled={!isValidState()}
        loading={loading}
        onClick={updatePassword}
      />
    </div>
  );
};

export default ChangePassword;
