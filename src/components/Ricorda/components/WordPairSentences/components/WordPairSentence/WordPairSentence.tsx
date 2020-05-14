import React, { FunctionComponent } from 'react';
import { Icon } from '@blueprintjs/core';
import { sanitize } from 'dompurify';
import './WordPairSentence.css';

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
    <div className={'word-sentence'}>
      <Icon className={'word-sentence-icon'} icon={'citation'} iconSize={17} />
      <p
        className={'word-sentence-text'}
        dangerouslySetInnerHTML={{
          __html: sanitize(getSentenceWithBoldSourceWords()),
        }}
      />
    </div>
  );
};

export default WordPairSentence;
