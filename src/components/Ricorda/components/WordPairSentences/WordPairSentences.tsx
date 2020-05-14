import React, { FunctionComponent, useState } from 'react';
import WordPairSentence from './components/WordPairSentence/WordPairSentence';
import './WordPairSentences.css';
import { Button, Collapse } from '@blueprintjs/core';

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
        className={'word-pair-sentences-btn'}
        rightIcon={'expand-all'}
        onClick={() => {
          setSentencesOpen(!isSentencesOpen);
        }}
      >
        <div className={'word-pair-sentences-info'}>
          <p className={'word-pair-sentences-info-text'}>
            <span className={'bp3-text-muted'}>Examples of</span> {sourceWord}
          </p>
        </div>
      </Button>
      <Collapse isOpen={isSentencesOpen}>
        <div className={'word-pair-sentences'}>
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
