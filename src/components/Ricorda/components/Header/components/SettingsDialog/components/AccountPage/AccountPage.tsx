/** @jsx jsx */

import { FunctionComponent } from 'react';
import ChangeEmail from './components/ChangeEmail/ChangeEmail';
import { jsx } from '@emotion/core';

const AccountPage: FunctionComponent = () => {
  return (
    <div>
      <ChangeEmail />
    </div>
  );
};

export default AccountPage;
