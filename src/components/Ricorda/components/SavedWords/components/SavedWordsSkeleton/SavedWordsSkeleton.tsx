/** @jsx jsx */

import { FunctionComponent } from 'react';
import SavedWord from '../SavedWord/SavedWord';
import { jsx } from '@emotion/core';

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
