import { Button, InputGroup } from '@blueprintjs/core';
import React, {
  useEffect,
  useState,
  FunctionComponent,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import { AuthService } from '../../../../services/authService';
import { DefaultToaster } from '../../../../helpers/DefaultToaster';
import { History } from 'history';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom';
import './SignUp.css';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';

interface IProps {
  history: History;
  userToken: string | null;
}

const SignUp: FunctionComponent<IProps> = ({ history, userToken }) => {
  const { path } = useRouteMatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex: RegExp = RegExp(
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  );

  useEffect(() => {
    if (userToken) {
      history.push('/');
    }

    // eslint-disable-next-line
  }, []);

  const keyDown: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && isValidCredentials()) {
      signUp();
    }
  };

  const isValidCredentials: () => boolean = () => {
    return emailRegex.test(email) && !!password && password === passwordConfirm;
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

    history.push('/signup/verify');
  };

  return (
    <div className={'page-root'}>
      <div className={'page-content'} onKeyDown={keyDown}>
        <Switch>
          <Route path={`${path}/verify`} component={VerifyEmail} />
          <Route exact path={path}>
            <h5 className={'bp3-heading'}>Sign up with your email address</h5>
            <span className={'page-divider'} />
            <InputGroup
              className={'page-input'}
              large
              fill
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
              large
              fill
              placeholder={'Password'}
              type={'password'}
              value={password}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setPassword(event.target.value)
              }
            />
            <InputGroup
              className={'page-input'}
              name={'password-confirm'}
              large
              fill
              placeholder={'Confirm password'}
              type={'password'}
              value={passwordConfirm}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setPasswordConfirm(event.target.value)
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
            <span className={'page-divider'} />

            <p className={'sign-up-page-have-account-text'}>
              Already have an account? <Link to={'/login'}>Log in</Link>
            </p>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default SignUp;
