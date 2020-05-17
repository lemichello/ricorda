/** @jsx jsx */

import { Button, ButtonGroup } from '@blueprintjs/core';
import { FunctionComponent } from 'react';
import { IPaginationPage } from '../../../../../../apiModels/paginationPage';
import { jsx } from '@emotion/core';

interface IProps {
  currentPage: IPaginationPage;
  searchValue: string;
  searchWords: (page: number, searchValue: string) => void;
}

const Pagination: FunctionComponent<IProps> = ({
  currentPage,
  searchValue,
  searchWords,
}) => {
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

export default Pagination;
