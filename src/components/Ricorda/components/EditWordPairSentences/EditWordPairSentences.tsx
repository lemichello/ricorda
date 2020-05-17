/** @jsx jsx */

import { FunctionComponent, useState, ChangeEvent } from 'react';
import EditWordPairSentence from './components/EditWordSentence/EditWordPairSentence';
import { Card, ControlGroup, Button, TextArea } from '@blueprintjs/core';
import { ISentence } from '../../../../apiModels/sentence';
import { jsx, css } from '@emotion/core';

interface IProps {
  sourceWord: string;
  sentences: ISentence[];
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
    <Card
      css={css`
        width: 100%;
        margin-top: 25px;
      `}
    >
      <p>
        <span className={'bp3-text-muted'}>Examples of</span>{' '}
        {sourceWord.trim() || 'Foreign word'}
      </p>
      {sentences.map(({ id, text }) => (
        <EditWordPairSentence
          key={id}
          sentence={text}
          sentenceId={id}
          removeSentence={removeSentence}
        />
      ))}
      <ControlGroup
        css={css`
          margin-top: 20px;
          justify-content: flex-start;
        `}
      >
        <TextArea
          placeholder={'New example sentence'}
          value={sentenceText}
          maxLength={200}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setSentenceText(e.target.value)
          }
          css={css`
            width: 90% !important;
            min-height: 40px;

            @media (min-width: 1200px) {
              width: 60% !important;
            }
          `}
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
