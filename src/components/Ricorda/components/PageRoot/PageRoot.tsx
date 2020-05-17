/** @jsx jsx */

import { FunctionComponent } from 'react';
import { jsx, css } from '@emotion/core';

const PageRoot: FunctionComponent = (props) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 50px;
        padding-bottom: 50px;
        justify-content: center;

        @media (max-width: 576px) {
          padding-top: 80px;
        }
      `}
    >
      <div
        {...props}
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 75vw;

          @media (min-width: 576px) {
            width: 50vw;
          }

          @media (min-width: 1200px) {
            width: 25vw;
          }
        `}
      >
        {props.children}
      </div>
    </div>
  );
};

export default PageRoot;
