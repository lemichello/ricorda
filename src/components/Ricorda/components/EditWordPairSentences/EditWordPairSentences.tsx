import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import EditWordPairSentence from './components/EditWordSentence/EditWordPairSentence';
import './EditWordPairSentences.css';
import { Card, ControlGroup, Button, TextArea } from '@blueprintjs/core';

interface IProps {
  sourceWord: string;
  sentences: { text: string; id: number }[];
  addSentence: (sentence: string) => void;
  removeSentence: (sentenceId: number) => void;
}

const EditWordPairSentences: FunctionComponent<IProps> = ({
  sourceWord,
  sentences,
  addSentence,
  removeSentence,
}) => {
  const [sentenceText, setSentenceText] = useState('');

  const isValidSentence: () => boolean = () => {
    return !!sentenceText.trim();
  };

  const addNewSentence: () => void = () => {
    addSentence(sentenceText);
    setSentenceText('');
  };

  return (
    <Card className={'new-word-sentences'}>
      <p>
        <span className={'bp3-text-muted'}>Examples of</span>{' '}
        {sourceWord || 'Foreign word'}
      </p>
      {sentences.map(({ id, text }) => (
        <EditWordPairSentence
          key={id}
          sentence={text}
          sentenceId={id}
          removeSentence={removeSentence}
        />
      ))}
      <ControlGroup className={'new-word-sentences-actions'}>
        <TextArea
          placeholder={'New example sentence'}
          className={'new-word-sentences-input'}
          value={sentenceText}
          maxLength={200}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setSentenceText(e.target.value)
          }
        />
        <Button
          icon={'plus'}
          disabled={!isValidSentence()}
          onClick={addNewSentence}
          intent={'primary'}
        />
      </ControlGroup>
    </Card>
  );
};

export default EditWordPairSentences;
