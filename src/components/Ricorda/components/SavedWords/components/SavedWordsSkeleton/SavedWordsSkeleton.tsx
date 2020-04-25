import React, { FunctionComponent } from 'react';
import { SavedWord } from '../SavedWord/SavedWord';

export const SavedWordsSkeleton: FunctionComponent = () => {
  return (
    <div>
      <SavedWord loading={true} />
      <SavedWord loading={true} />
      <SavedWord loading={true} />
      <SavedWord loading={true} />
    </div>
  );
};
