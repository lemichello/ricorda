/** @jsx jsx */

import { FunctionComponent } from 'react';
import { Icon } from '@blueprintjs/core';
import { sanitize } from 'dompurify';
import { jsx, css } from '@emotion/core';

interface IProps {
  sentence: string;
  sourceWord: string;
}

const WordPairSentence: FunctionComponent<IProps> = ({
  sentence,
  sourceWord,
}) => {
  const getSentenceWithBoldSourceWords: () => string = () => {
    let regEx: RegExp = new RegExp(sourceWord, 'ig');

    return sentence.replace(regEx, (match) => {
      return `<strong>${match}</strong>`;
    });
  };

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
        iconSize={17}
        css={css`
          margin-right: 10px;
          margin-left: 10px;
        `}
      />
      <p
        dangerouslySetInnerHTML={{
          __html: sanitize(getSentenceWithBoldSourceWords()),
        }}
        css={css`
          margin-bottom: 0;
          white-space: pre-wrap;
        `}
      />
    </div>
  );
};

export default WordPairSentence;
