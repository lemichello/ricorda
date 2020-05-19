/** @jsx jsx */

import {
  useContext,
  useEffect,
  useState,
  FunctionComponent,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import { Button, InputGroup, Tooltip, Checkbox } from '@blueprintjs/core';
import UserContext from '../../contexts/userContext';
import { AuthService } from '../../../../services/authService';
import { Link } from 'react-router-dom';
import { DefaultToaster } from '../../../../helpers/DefaultToaster';
import { History, Location } from 'history';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login';
import config from '../../../../config';
import PageRoot from '../PageRoot/PageRoot';
import { jsx, css, SerializedStyles } from '@emotion/core';

interface IProps {
  history: History;
  location: Location;
  userToken: string | null;
}

const LogIn: FunctionComponent<IProps> = ({ history, location, userToken }) => {
  const { setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRegex: RegExp = RegExp(
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  );

  useEffect(() => {
    // Preventing user of entering this page.
    if (userToken) {
      history.push('/');
    }

    /**
     * Backend server redirects to this link with query parameter
     * after successful email verification.
     */
    const params: URLSearchParams = new URLSearchParams(location.search);
    const verified: string | null = params.get('verified');

    if (verified !== null && verified === 'true') {
      DefaultToaster.show({
        message: 'Successfully verified email address.',
        icon: 'tick',
        intent: 'success',
      });
    }

    // eslint-disable-next-line
  }, []);

  const isValidCredentials: () => boolean = () => {
    return emailRegex.test(email) && !!password;
  };

  const keyDown: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && isValidCredentials()) {
      logIn();
    }
  };

  const finishLogInProcess: () => void = () => {
    DefaultToaster.show({
      message: 'Successfully logged in',
      intent: 'success',
      icon: 'tick',
    });

    const { from }: any = location.state || { from: '/' };

    history.push(from);
  };

  const logIn: () => void = async () => {
    try {
      setLoading(true);
      let token: string = await AuthService.login(email, password, rememberMe);

      setUser({ token: token });
    } catch (e) {
      return;
    } finally {
      setLoading(false);
    }

    finishLogInProcess();
  };

  const logInWithGoogle: (user: GoogleLoginResponse) => void = async (
    user: GoogleLoginResponse
  ) => {
    try {
      setLoading(true);
      let token: string = await AuthService.loginWithGoogle(user.tokenId);

      setUser({ token: token });
    } catch (e) {
      return;
    } finally {
      setLoading(false);
    }

    finishLogInProcess();
  };

  const lockButton: JSX.Element = (
    <Tooltip content={`${showPassword ? 'Hide' : 'Show'} Password`}>
      <Button
        icon={showPassword ? 'eye-off' : 'eye-open'}
        minimal={true}
        onClick={() => {
          setShowPassword(!showPassword);
        }}
      />
    </Tooltip>
  );

  const dividerStyles: SerializedStyles = css`
    display: block;
    border-top: 1px solid rgba(16, 22, 26, 0.15);
    width: 80%;
    margin-top: 15px;
    margin-bottom: 15px;

    .bp3-dark & {
      border-top: 1px solid hsla(0, 0%, 100%, 0.15);
    }
  `;

  const inputStyles: SerializedStyles = css`
    margin-bottom: 20px;
  `;

  const buttonStyles: SerializedStyles = css`
    border-radius: 15px;
    height: 35px;
    width: 120px;
    text-transform: uppercase;
  `;

  return (
    <PageRoot>
      <div
        onKeyDown={keyDown}
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        `}
      >
        <h5 className={'bp3-heading'}>To continue, log in to Ricorda.</h5>
        <GoogleLogin
          clientId={config.googleClientId}
          buttonText={'Continue with Google'}
          onSuccess={(response) => {
            logInWithGoogle(response as GoogleLoginResponse);
          }}
          onFailure={() => {}}
          css={css`
            width: 80%;
            border-radius: 22px !important;
            display: flex;
            justify-content: center;

            & > div {
              background: transparent !important;
              margin-right: 0 !important;
            }

            & > span {
              font-weight: bold !important;
            }
          `}
        />
        <div
          css={css`
            display: flex;
            align-items: center;
            width: 80%;
            margin-top: 5px;
            margin-bottom: 5px;

            & > span {
              width: 50%;
            }

            & > p {
              margin-left: 10px;
              margin-right: 10px;
              margin-bottom: 0;
            }
          `}
        >
          <span css={dividerStyles} />
          <p className={'bp3-heading'}>OR</p>
          <span css={dividerStyles} />
        </div>
        <InputGroup
          large={true}
          fill={true}
          type={'email'}
          placeholder={'Email address'}
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
          css={inputStyles}
        />
        <InputGroup
          name={'password'}
          large={true}
          fill={true}
          placeholder={'Password'}
          rightElement={lockButton}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
          css={inputStyles}
        />
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          `}
        >
          <Checkbox
            label={'Remember me'}
            checked={rememberMe}
            onChange={() => {
              setRememberMe(!rememberMe);
            }}
          />
          <Button
            css={buttonStyles}
            intent={'success'}
            loading={loading}
            text={'Log In'}
            onClick={logIn}
            disabled={!isValidCredentials()}
          />
        </div>
        <span css={dividerStyles} />
        <h5 className={'bp3-heading'}>Don't have an account?</h5>
        <Link to={'/signup'} className={'navigation-link'}>
          <Button
            className={'bp3-heading'}
            outlined
            text={'Sign Up For Ricorda'}
            css={css`
              ${buttonStyles}

              display: block;
              margin: 10px auto 0 auto;
              width: 80% !important;
              text-align: center;
            `}
          />
        </Link>
      </div>
    </PageRoot>
  );
};

export default LogIn;
