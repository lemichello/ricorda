import { Button, InputGroup, Tooltip } from '@blueprintjs/core';
import React, {
  useEffect,
  useState,
  FunctionComponent,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import { AuthService } from '../../../../services/authService';
import { DefaultToaster } from '../../models/DefaultToster';
import { History } from 'history';

interface IProps {
  history: History;
}

const SignUp: FunctionComponent<IProps> = ({ history }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex: RegExp = RegExp(
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  );

  useEffect(() => {
    let token: string = AuthService.getUserToken();

    if (token) {
      history.push('/');
    }
  }, [history]);

  const keyDown: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && isValidCredentials()) {
      signUp();
    }
  };

  const isValidCredentials: () => boolean = () => {
    return emailRegex.test(email) && !!password;
  };

  const signUp: () => void = async () => {
    try {
      setLoading(true);
      await AuthService.signUp(email, password);
    } catch (e) {
      return;
    } finally {
      setLoading(false);
    }

    DefaultToaster.show({
      message: 'Successfully signed up',
      intent: 'success',
      icon: 'tick',
    });

    history.push('/login');
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
        <h5 className={'bp3-heading'}>Sign up with your email address</h5>
        <span className={'page-divider'} />
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
        <Button
          className={'page-btn login-page-sign-up-btn bp3-heading'}
          text={'Sign Up'}
          intent={'success'}
          onClick={signUp}
          loading={loading}
          disabled={!isValidCredentials()}
        />
      </div>
    </div>
  );
};

export default SignUp;
