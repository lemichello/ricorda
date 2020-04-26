import React, { FunctionComponent } from 'react';
import './SecurityPage.css';
import ChangePassword from './components/ChangePassword/ChangePassword';

const SecurityPage: FunctionComponent = () => {
  return (
    <div>
      <ChangePassword />
    </div>
  );
};

export default SecurityPage;
