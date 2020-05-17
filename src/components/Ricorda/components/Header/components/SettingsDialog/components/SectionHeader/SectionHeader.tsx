/** @jsx jsx */

import { Fragment, FunctionComponent } from 'react';
import { H4, Icon, IconName, MenuDivider } from '@blueprintjs/core';
import { jsx, css } from '@emotion/core';

interface IProps {
  text: string;
  icon: IconName;
}

const SectionHeader: FunctionComponent<IProps> = ({ text, icon }) => {
  return (
    <Fragment>
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <Icon icon={icon} />
        <H4
          css={css`
            margin-bottom: 0;
            margin-left: 10px;
          `}
        >
          {text}
        </H4>
      </div>
      <MenuDivider
        css={css`
          margin-left: 0;
        `}
      />
    </Fragment>
  );
};

export default SectionHeader;
