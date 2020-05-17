/** @jsx jsx */

import { useState, FunctionComponent } from 'react';
import {
  Button,
  Card,
  Collapse,
  H4,
  NavbarDivider,
  Pre,
  ProgressBar,
} from '@blueprintjs/core';
import { IWordPair } from '../../../../../../apiModels/wordPair';
import WordPairSentences from '../../../WordPairSentences/WordPairSentences';
import { jsx, css } from '@emotion/core';

interface IProps {
  wordPair?: IWordPair;
  loading: boolean;
  editWord?: (wordPair: IWordPair) => void;
}

const SavedWord: FunctionComponent<IProps> = ({
  wordPair,
  loading,
  editWord,
}) => {
  const [translationOpen, setTranslationOpen] = useState(false);

  const handleEditClick: () => void = () => {
    if (editWord && wordPair) {
      editWord(wordPair);
    }
  };

  return (
    <Card
      elevation={2}
      css={css`
        margin-bottom: 25px;
        width: 75vw;

        @media (min-width: 576px) {
          width: 50vw;
        }
        @media (min-width: 1200px) {
          width: 30vw;
        }
      `}
    >
      <div
        className={`${loading ? 'bp3-skeleton' : ''}`}
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <H4
          css={css`
            width: 40%;
            max-width: 30%;
            text-overflow: ellipsis;
            overflow-wrap: break-word;
            font-size: 16px !important;
            line-height: 19px !important;

            @media (min-width: 576px) {
              max-width: 40%;
              width: 40%;
              font-size: 18px !important;
              line-height: 21px !important;
            }
          `}
        >
          {wordPair?.sourceWord}
        </H4>
        <ProgressBar
          intent={
            wordPair?.repetitions === wordPair?.maxRepetitions
              ? 'success'
              : 'primary'
          }
          animate={false}
          stripes={false}
          value={
            wordPair
              ? wordPair.repetitions / wordPair.maxRepetitions
              : undefined
          }
          css={css`
            margin-left: 15px;
            margin-right: 15px;
            width: 35%;
          `}
        />
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Button
            minimal={true}
            icon={'translate'}
            active={translationOpen}
            onClick={() => setTranslationOpen(!translationOpen)}
          />
          <NavbarDivider />
          <Button
            icon={'edit'}
            minimal={true}
            intent={'primary'}
            onClick={handleEditClick}
          />
        </div>
      </div>
      <Collapse
        isOpen={translationOpen}
        css={css`
          width: 100%;
        `}
      >
        <div>
          <Pre
            css={css`
              width: 100%;
              text-align: center;
              white-space: normal;
            `}
          >
            {wordPair?.translation}
          </Pre>
          {!!wordPair?.sentences?.length && (
            <WordPairSentences
              sentences={wordPair.sentences}
              sourceWord={wordPair.sourceWord}
            />
          )}
        </div>
      </Collapse>
    </Card>
  );
};

export default SavedWord;
