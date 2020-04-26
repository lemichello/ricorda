import React, { useState, FunctionComponent } from 'react';
import {
  Button,
  Card,
  Collapse,
  H4,
  NavbarDivider,
  Pre,
  ProgressBar,
} from '@blueprintjs/core';
import './SavedWord.css';
import { IWordPair } from '../../../../../../models/wordPair';

interface IProps {
  wordPair?: IWordPair;
  loading: boolean;
  editWord?: (wordPair: IWordPair) => void;
}

export const SavedWord: FunctionComponent<IProps> = ({
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
    <Card elevation={2} className={'saved-word-card'}>
      <div className={`saved-word-summary ${loading ? 'bp3-skeleton' : ''}`}>
        <H4 className={'saved-word-source-word'}>{wordPair?.sourceWord}</H4>
        <ProgressBar
          className={'saved-word-progress-bar'}
          intent={wordPair?.repetitions === 5 ? 'success' : 'primary'}
          animate={false}
          stripes={false}
          value={wordPair?.repetitions ? wordPair.repetitions / 5 : 0}
        />
        <div className={'saved-word-actions'}>
          <Button
            minimal={true}
            icon={'translate'}
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
        className={`translation-collapse-block`}
      >
        <Pre className={'translation-word'}>{wordPair?.translation}</Pre>
      </Collapse>
    </Card>
  );
};
