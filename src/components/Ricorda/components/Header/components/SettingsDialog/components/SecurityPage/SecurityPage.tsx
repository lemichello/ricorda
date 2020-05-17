/** @jsx jsx */

import { FunctionComponent } from 'react';
import ChangePassword from './components/ChangePassword/ChangePassword';
import { jsx } from '@emotion/core';

const SecurityPage: FunctionComponent = () => {
  return (
    <div>
      <ChangePassword />
    </div>
  );
};

export default SecurityPage;
