import { Button, ButtonGroup } from '@blueprintjs/core';
import React from 'react';

export const Pagination = function ({ currentPage, searchValue, searchWords }) {
  return (
    <ButtonGroup fill={true}>
      <Button
        icon={'chevron-left'}
        text={'Previous'}
        disabled={currentPage.page === 1}
        onClick={() => searchWords(currentPage.page - 1, searchValue)}
      />
      <Button
        rightIcon={'chevron-right'}
        text={'Next'}
        disabled={!currentPage.next}
        onClick={() => searchWords(currentPage.page + 1, searchValue)}
      />
    </ButtonGroup>
  );
};
