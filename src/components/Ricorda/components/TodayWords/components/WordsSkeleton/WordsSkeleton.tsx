import { RepeatWord } from '../RepeatWord/RepeatWord';
import React, { FunctionComponent } from 'react';

export const WordsSkeleton: FunctionComponent = () => {
  return (
    <div>
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
    </div>
  );
};
