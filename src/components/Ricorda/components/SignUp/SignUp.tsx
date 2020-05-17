/** @jsx jsx */

import { Button, InputGroup } from '@blueprintjs/core';
import {
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
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import PageRoot from '../PageRoot/PageRoot';
import { jsx, css, SerializedStyles } from '@emotion/core';

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

  return (
    <PageRoot>
      <Switch>
        <Route path={`${path}/verify`} component={VerifyEmail} />
        <Route exact path={path}>
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
            <h5 className={'bp3-heading'}>Sign up with your email address</h5>
            <span css={dividerStyles} />
            <InputGroup
              large
              fill
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
              large
              fill
              placeholder={'Password'}
              type={'password'}
              value={password}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setPassword(event.target.value)
              }
              css={inputStyles}
            />
            <InputGroup
              name={'password-confirm'}
              large
              fill
              placeholder={'Confirm password'}
              type={'password'}
              value={passwordConfirm}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setPasswordConfirm(event.target.value)
              }
              css={inputStyles}
            />
            <Button
              className={'bp3-heading'}
              text={'Sign Up'}
              intent={'success'}
              onClick={signUp}
              loading={loading}
              disabled={!isValidCredentials()}
              onKeyDownCapture={keyDown}
              css={css`
                display: block;
                margin: 10px auto 0 auto;
                width: 80% !important;
                text-align: center;
                border-radius: 15px;
                height: 35px;
                text-transform: uppercase;
              `}
            />
            <span css={dividerStyles} />
            <p
              css={css`
                & > a:hover {
                  text-decoration: none;
                  color: #2b95d6;
                  transition: color 0.2s;
                }
              `}
            >
              Already have an account? <Link to={'/login'}>Log in</Link>
            </p>
          </div>
        </Route>
      </Switch>
    </PageRoot>
  );
};

export default SignUp;
