import React from 'react';
import { SavedWord } from '../SavedWord/SavedWord';

export const SavedWordsSkeleton = function() {
  return (
    <div>
      <SavedWord loading={true} />
      <SavedWord loading={true} />
      <SavedWord loading={true} />
      <SavedWord loading={true} />
    </div>
  );
};
