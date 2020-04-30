import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import {
  FormGroup,
  MenuDivider,
  H4,
  InputGroup,
  Button,
  Icon,
} from '@blueprintjs/core';
import './ChangePassword.css';
import { AccountService } from '../../../../../../../../../../services/accountService';
import { DefaultToaster } from '../../../../../../../../models/DefaultToster';
import { useMediaQuery } from 'react-responsive';

const ChangePassword: FunctionComponent = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile: boolean = useMediaQuery({ query: '(max-width: 576px)' });

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
    } catch (e) {
      return;
    } finally {
      setLoading(false);
    }

    setOldPassword('');
    setNewPassword('');
    setNewPasswordRepeat('');

    DefaultToaster.show({
      message: 'Successfully updated password',
      intent: 'success',
      icon: 'tick',
    });
  };

  return (
    <div>
      <div className={'section-header'}>
        <Icon icon={'key'} />
        <H4 className={'section-header-text'}>Change password</H4>
      </div>
      <MenuDivider className={'section-divider'} />
      <FormGroup label={'Old password'}>
        <InputGroup
          className={'section-page-input'}
          type={'password'}
          small={isMobile}
          value={oldPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setOldPassword(e.target.value)
          }
        />
      </FormGroup>
      <FormGroup label={'New password'}>
        <InputGroup
          className={'section-page-input'}
          type={'password'}
          small={isMobile}
          value={newPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewPassword(e.target.value)
          }
        />
      </FormGroup>
      <FormGroup label={'Confirm new password'}>
        <InputGroup
          type={'password'}
          className={'section-page-input'}
          small={isMobile}
          value={newPasswordRepeat}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewPasswordRepeat(e.target.value)
          }
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