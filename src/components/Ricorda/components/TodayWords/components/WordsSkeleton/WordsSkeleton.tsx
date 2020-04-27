import RepeatWord from '../RepeatWord/RepeatWord';
import React, { FunctionComponent } from 'react';

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
