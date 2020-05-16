/** @jsx jsx */

import { FunctionComponent, useState } from 'react';
import WordPairSentence from './components/WordPairSentence/WordPairSentence';
import { Button, Collapse } from '@blueprintjs/core';
import { jsx, css } from '@emotion/core';

interface IProps {
  sourceWord: string;
  sentences: string[];
}

const WordPairSentences: FunctionComponent<IProps> = ({
  sourceWord,
  sentences,
}) => {
  const [isSentencesOpen, setSentencesOpen] = useState(false);

  return (
    <div>
      <Button
        minimal
        fill
        rightIcon={'expand-all'}
        onClick={() => {
          setSentencesOpen(!isSentencesOpen);
        }}
        css={css`
          justify-content: flex-start;

          & > .bp3-icon {
            margin-left: auto;
          }
        `}
      >
        <div
          css={css`
            display: flex;
            width: 100%;
          `}
        >
          <p
            css={css`
              margin-bottom: 0;
              margin-right: 5px;
            `}
          >
            <span className={'bp3-text-muted'}>Examples of</span> {sourceWord}
          </p>
        </div>
      </Button>
      <Collapse isOpen={isSentencesOpen}>
        <div
          css={css`
            margin-top: 5px;
          `}
        >
          {sentences.map((sentence, i) => (
            <WordPairSentence
              sentence={sentence}
              sourceWord={sourceWord}
              key={i}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};
export default WordPairSentences;
