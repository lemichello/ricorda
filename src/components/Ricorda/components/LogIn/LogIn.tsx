import React, {
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
import '../../Ricorda.css';
import './LogIn.css';
import { Link } from 'react-router-dom';
import { DefaultToaster } from '../../models/DefaultToster';
import { History, Location } from 'history';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login';
import config from '../../../../config';

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

  return (
    <div className={'page-root'}>
      <div className={'page-content'} onKeyDown={keyDown}>
        <h5 className={'bp3-heading'}>To continue, log in to Ricorda.</h5>
        <GoogleLogin
          clientId={config.googleClientId}
          buttonText={'Continue with Google'}
          className={'google-sign-in-btn'}
          onSuccess={(response) => {
            logInWithGoogle(response as GoogleLoginResponse);
          }}
          onFailure={() => {}}
        />
        <div className={'log-in-page-text-divider'}>
          <span className={'page-divider'} />
          <p className={'bp3-heading'}>OR</p>
          <span className={'page-divider'} />
        </div>
        <InputGroup
          className={'page-input'}
          large={true}
          fill={true}
          type={'email'}
          placeholder={'Email address'}
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
        />
        <InputGroup
          className={'page-input'}
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
        />
        <div className={'page-actions'}>
          <Checkbox
            label={'Remember me'}
            checked={rememberMe}
            onChange={() => {
              setRememberMe(!rememberMe);
            }}
          />
          <Button
            className={'page-btn'}
            intent={'success'}
            loading={loading}
            text={'Log In'}
            onClick={logIn}
            disabled={!isValidCredentials()}
          />
        </div>
        <span className={'page-divider'} />
        <h5 className={'bp3-heading'}>Don't have an account?</h5>
        <Link
          to={'/signup'}
          style={{ width: '100%' }}
          className={'navigation-link'}
        >
          <Button
            className={'page-btn login-page-sign-up-btn bp3-heading'}
            outlined
            text={'Sign Up For Ricorda'}
          />
        </Link>
      </div>
    </div>
  );
};

export default LogIn;
