import { Button, InputGroup, Tooltip } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { authService } from '../../../../services/authService';
import { DefaultToaster } from '../../models/DefaultToster';

export const SignUp = function(props) {
  const [showPassword, setShowPassword] = useState(false);
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

  const signUp = async () => {
    try {
      setLoading(true);
      await authService.signUp(email, password);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      return;
    }

    DefaultToaster.show({
      message: 'Successfully signed up',
      intent: 'success',
      icon: 'tick'
    });

    props.history.push('/login');
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
        <h5 className={'bp3-heading'}>Sign up with your email address</h5>
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
        <Button
          className={'page-btn login-page-sign-up-btn bp3-heading'}
          text={'Sign Up'}
          intent={'success'}
          onClick={signUp}
          loading={loading}
          disabled={!emailRegex.test(email) || !password}
        />
      </div>
    </div>
  );
};
