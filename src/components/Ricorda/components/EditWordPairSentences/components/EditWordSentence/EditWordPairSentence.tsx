/** @jsx jsx */

import { FunctionComponent } from 'react';
import { Icon, Button } from '@blueprintjs/core';
import { jsx, css } from '@emotion/core';

interface IProps {
  sentence: string;
  sentenceId: number;
  removeSentence: (sentenceId: number) => void;
}

const EditWordPairSentence: FunctionComponent<IProps> = ({
  sentence,
  sentenceId,
  removeSentence,
}) => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      `}
    >
      <Icon
        icon={'citation'}
        iconSize={18}
        css={css`
          margin-right: 10px;
          margin-left: 10px;
        `}
      />
      <p
        css={css`
          margin-bottom: 0;
          margin-right: 10px;
          white-space: pre-wrap;
        `}
      >
        {sentence}
      </p>
      <Button
        minimal
        icon={'cross'}
        onClick={() => {
          removeSentence(sentenceId);
        }}
        css={css`
          margin-left: auto;
        `}
      />
    </div>
  );
};

export default EditWordPairSentence;
