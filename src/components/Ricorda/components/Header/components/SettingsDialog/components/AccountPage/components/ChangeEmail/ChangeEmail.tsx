import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import {
  Icon,
  H4,
  MenuDivider,
  FormGroup,
  InputGroup,
  Button,
} from '@blueprintjs/core';
import './ChangeEmail.css';
import { AccountService } from '../../../../../../../../../../services/accountService';
import { DefaultToaster } from '../../../../../../../../models/DefaultToster';
import { useMediaQuery } from 'react-responsive';

const ChangeEmail: FunctionComponent = () => {
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRegex: RegExp = RegExp(
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  );
  const isMobile: boolean = useMediaQuery({ query: '(max-width: 576px)' });

  const isValidEmail: () => boolean = () => {
    return emailRegex.test(newEmail);
  };

  const updateEmail: () => void = async () => {
    try {
      setLoading(true);

      await AccountService.updateEmail(newEmail);
    } catch (e) {
      return;
    } finally {
      setLoading(false);
    }

    setNewEmail('');
    DefaultToaster.show({
      message: 'Successfully update email',
      icon: 'tick',
      intent: 'success',
    });
  };

  return (
    <div>
      <div className={'section-header'}>
        <Icon icon={'envelope'} />
        <H4 className={'section-header-text'}>Change email</H4>
      </div>
      <MenuDivider className={'section-divider'} />
      <FormGroup label={'New email'}>
        <InputGroup
          className={'section-page-input'}
          value={newEmail}
          small={isMobile}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewEmail(e.target.value)
          }
          type={'email'}
        />
      </FormGroup>
      <Button
        text={'Update email'}
        disabled={!isValidEmail()}
        small={isMobile}
        loading={loading}
        onClick={updateEmail}
      />
    </div>
  );
};

export default ChangeEmail;
