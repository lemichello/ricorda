/** @jsx jsx */

import RepeatWord from '../RepeatWord/RepeatWord';
import { FunctionComponent } from 'react';
import { jsx } from '@emotion/core';

const WordsSkeleton: FunctionComponent = () => {
  return (
    <div>
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
    </div>
  );
};

export default WordsSkeleton;
