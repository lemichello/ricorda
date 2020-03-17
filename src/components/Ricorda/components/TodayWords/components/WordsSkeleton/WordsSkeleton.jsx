import { RepeatWord } from '../RepeatWord/RepeatWord';
import React from 'react';

export const WordsSkeleton = function() {
  return (
    <div>
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
    </div>
  );
};
