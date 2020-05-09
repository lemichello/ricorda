import React, { FunctionComponent } from 'react';
import { Icon, Button } from '@blueprintjs/core';
import './NewWordSentence.css';

interface IProps {
  sentence: string;
  sentenceId: number;
  removeSentence: (sentenceId: number) => void;
}

const NewWordSentence: FunctionComponent<IProps> = ({
  sentence,
  sentenceId,
  removeSentence,
}) => {
  return (
    <div className={'new-word-sentence'}>
      <Icon
        className={'new-word-sentence-icon'}
        icon={'citation'}
        iconSize={18}
      />
      <p className={'new-word-sentence-text'}>{sentence}</p>
      <Button
        className={'new-word-sentence-remove-btn'}
        minimal
        icon={'cross'}
        onClick={() => {
          removeSentence(sentenceId);
        }}
      />
    </div>
  );
};

export default NewWordSentence;
