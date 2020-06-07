/** @jsx jsx */

import { FunctionComponent, useState, ChangeEvent, useContext } from 'react';
import { FormGroup, InputGroup, Button } from '@blueprintjs/core';
import { AccountService } from '../../../../../../../../../../services/accountService';
import { DefaultToaster } from '../../../../../../../../../../helpers/DefaultToaster';
import { useMediaQuery } from 'react-responsive';
import UserContext from '../../../../../../../../contexts/userContext';
import AccountSettingsContext from '../../../../../../../../contexts/accountSettingsContext';
import { useHistory } from 'react-router-dom';
import { jsx, css } from '@emotion/core';
import { History } from 'history';
import SectionHeader from '../../../SectionHeader/SectionHeader';

const ChangeEmail: FunctionComponent = () => {
  const { setUser } = useContext(UserContext);
  const { setAccountSettings } = useContext(AccountSettingsContext);

  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRegex: RegExp = RegExp(
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  );
  const isMobile: boolean = useMediaQuery({ query: '(max-width: 576px)' });
  const history: History = useHistory();

  const isValidEmail: () => boolean = () => {
    return emailRegex.test(newEmail);
  };

  const updateEmail: () => void = async () => {
    try {
      setLoading(true);

      await AccountService.updateEmail(newEmail);
      await AccountService.revokeToken();
    } catch (e) {
      return;
    } finally {
      setLoading(false);
    }

    setNewEmail('');
    DefaultToaster.show({
      message: 'Successfully updated email',
      icon: 'tick',
      intent: 'success',
    });

    setUser({ token: null, registrationType: null });
    setAccountSettings({ isDialogOpen: false });

    history.push('/signup/verify');
  };

  return (
    <div>
      <SectionHeader text={'Change email'} icon={'envelope'} />
      <FormGroup label={'New email'}>
        <InputGroup
          value={newEmail}
          small={isMobile}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewEmail(e.target.value)
          }
          type={'email'}
          css={css`
            width: 230px;
          `}
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
