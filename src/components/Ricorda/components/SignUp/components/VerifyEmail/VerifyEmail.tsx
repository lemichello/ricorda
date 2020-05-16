import React, { FunctionComponent, useEffect, useState } from 'react';
import { NonIdealState, Button } from '@blueprintjs/core';
import { Location } from 'history';
import { AuthService } from '../../../../../../services/authService';
import { DefaultToaster } from '../../../../../../helpers/DefaultToaster';
import './VerifyEmail.css';

interface IProps {
  location: Location;
}

const VerifyEmail: FunctionComponent<IProps> = ({ location }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<undefined | string>(undefined);
  const [failed, setFailed] = useState<undefined | boolean>(undefined);

  useEffect(() => {
    const params: URLSearchParams = new URLSearchParams(location.search);
    const email: string | null = params.get('email');
    const failed: string | null = params.get('failed');

    if (email !== null) {
      setEmail(email);
    }

    if (failed !== null) {
      setFailed(true);
    }
  }, [location.search]);

  const resendVerificationEmail: (email: string) => void = async (
    email: string
  ) => {
    try {
      setLoading(true);

      await AuthService.resendVerificationEmail(email);

      DefaultToaster.show({
        message: 'Successfully resent verification email',
        icon: 'tick',
        intent: 'success',
      });
    } catch (e) {
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <NonIdealState
      icon={'envelope'}
      className={`verify-state ${failed ? 'failed' : ''}`}
      title={failed ? 'Email verification failed' : 'Email verification'}
      description={
        failed ? (
          <p>
            Verification link has expired.
            <br />
            Click button below to send another one.
          </p>
        ) : (
          <p>
            In order to continue you need to verify provided email address.
            Click on 'Confirm Email Address' link in the received mail.
            <br />
            <strong>
              Note: verification link is valid for the next 30 minutes.
            </strong>
          </p>
        )
      }
      action={
        email !== undefined ? (
          <Button
            className={'page-btn login-page-sign-up-btn bp3-heading'}
            outlined
            text={'Resend email verification link'}
            disabled={loading}
            onClick={() => resendVerificationEmail(email)}
          />
        ) : undefined
      }
    />
  );
};

export default VerifyEmail;
