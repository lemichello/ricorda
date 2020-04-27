import React, { FunctionComponent } from 'react';
import SavedWord from '../SavedWord/SavedWord';

const SavedWordsSkeleton: FunctionComponent = () => {
  return (
    <div>
      <SavedWord loading={true} />
      <SavedWord loading={true} />
      <SavedWord loading={true} />
      <SavedWord loading={true} />
    </div>
  );
};

export default SavedWordsSkeleton;
