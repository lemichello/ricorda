import React, { useState } from 'react';
import {
  Button,
  Card,
  Collapse,
  H4,
  NavbarDivider,
  Pre,
  ProgressBar
} from '@blueprintjs/core';
import './SavedWord.css';

export const SavedWord = function({ wordPair, loading, editWord }) {
  const [translationOpen, setTranslationOpen] = useState(false);

  return (
    <Card elevation={2} className={'saved-word-card'}>
      <div className={`saved-word-summary ${loading ? 'bp3-skeleton' : ''}`}>
        <H4 className={'saved-word-source-word'}>{wordPair?.sourceWord}</H4>
        <ProgressBar
          className={'saved-word-progress-bar'}
          intent={wordPair?.repetitions === 5 ? 'success' : 'primary'}
          animate={false}
          stripes={false}
          value={wordPair?.repetitions / 5}
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
            onClick={() => editWord(wordPair)}
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
