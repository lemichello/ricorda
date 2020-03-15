import { RepeatWord } from '../RepeatWord';
import React from 'react';

export const LoadingWords = function() {
  return (
    <div>
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
      <RepeatWord loading={true} />
    </div>
  );
};
