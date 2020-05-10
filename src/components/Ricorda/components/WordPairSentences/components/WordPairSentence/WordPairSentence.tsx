import React, { FunctionComponent } from 'react';
import { Icon } from '@blueprintjs/core';
import './WordPairSentence.css';

interface IProps {
  sentence: string;
}

const WordPairSentence: FunctionComponent<IProps> = ({ sentence }) => {
  return (
    <div className={'word-sentence'}>
      <Icon className={'word-sentence-icon'} icon={'citation'} iconSize={17} />
      <p className={'word-sentence-text'}>{sentence}</p>
    </div>
  );
};

export default WordPairSentence;
