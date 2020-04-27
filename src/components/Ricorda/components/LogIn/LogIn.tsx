import React, {
  useContext,
  useEffect,
  useState,
  FunctionComponent,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import { Button, Checkbox, InputGroup, Tooltip } from '@blueprintjs/core';
import UserContext from '../../contexts/userContext';
import { AuthService } from '../../../../services/authService';
import '../../Ricorda.css';
import './LogIn.css';
import { Link } from 'react-router-dom';
import { DefaultToaster } from '../../models/DefaultToster';
import { History, Location } from 'history';

interface IProps {
  history: History;
  location: Location;
}

const LogIn: FunctionComponent<IProps> = ({ history, location }) => {
  const { setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  const isValidCredentials: () => boolean = () => {
    return emailRegex.test(email) && !!password;
  };

  const keyDown: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && isValidCredentials()) {
      logIn();
    }
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

    DefaultToaster.show({
      message: 'Successfully logged in',
      intent: 'success',
      icon: 'tick',
    });

    const { from }: any = location.state || { from: '/' };

    history.push(from);
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
