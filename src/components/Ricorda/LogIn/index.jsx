import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  InputGroup,
  Tooltip
} from '@blueprintjs/core';
import { UserContext } from '../contexts/userContext';
import { authService } from '../../../services/authService';
import '../styles.css';
import './styles.css';
import { Link } from 'react-router-dom';
import { DefaultToaster } from '../models/DefaultToster';

export const Login = function(props) {
  const [, setUser] = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex = RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);

  useEffect(() => {
    let token = authService.getUserToken();

    if (token) {
      props.history.push('/');
    }
  }, [props.history]);

  const logIn = async () => {
    try {
      setLoading(true);
      let token = await authService.login(email, password, rememberMe);
      setLoading(false);

      setUser(token);
    } catch (e) {
      setLoading(false);
      DefaultToaster.show({
        message: e,
        intent: 'danger',
        icon: 'cross'
      });
      return;
    }

    DefaultToaster.show({
      message: 'Successfully logged in',
      intent: 'success',
      icon: 'tick'
    });

    const { from } = props.location.state || { from: { pathname: '/' } };

    props.history.push(from);
  };

  const lockButton = (
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
      <div className={'page-content'}>
        <h5 className={'bp3-heading'}>To continue, log in to Ricorda.</h5>
        <span className={'page-divider'} />
        <InputGroup
          className={'page-input'}
          large={true}
          fill={true}
          type={'email'}
          placeholder={'Email address'}
          value={email}
          onChange={event => setEmail(event.target.value)}
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
          onChange={event => setPassword(event.target.value)}
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
            disabled={!emailRegex.test(email) || !password}
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
            outlined="true"
            text={'Sign Up For Ricorda'}
          />
        </Link>
      </div>
    </div>
  );
};
