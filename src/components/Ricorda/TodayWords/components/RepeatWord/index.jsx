import {
  Button,
  Card,
  Collapse,
  H3,
  NavbarDivider,
  Pre
} from '@blueprintjs/core';
import React, { useState } from 'react';
import './styles.css';

export const RepeatWord = function({ wordsPair, loading, updateWordsPair }) {
  const [translationOpen, setTranslationOpen] = useState(false);
  const [checkBtnLoading, setCheckBtnLoading] = useState(false);

  const handleUpdateClick = async () => {
    setCheckBtnLoading(true);
    await updateWordsPair(wordsPair);
    setCheckBtnLoading(false);
  };

  return (
    <Card className={'repeat-word-card'} elevation={2}>
      <div className={`source-word-block ${loading ? 'bp3-skeleton' : ''}`}>
        <H3 className={'source-word'}>{wordsPair?.sourceWord}</H3>
        <Button
          minimal={true}
          icon={'translate'}
          onClick={() => setTranslationOpen(!translationOpen)}
        />
        <NavbarDivider />
        <Button
          loading={checkBtnLoading}
          icon={'tick'}
          minimal={true}
          intent={'success'}
          onClick={handleUpdateClick}
        />
      </div>
      <Collapse
        isOpen={translationOpen}
        className={`translation-collapse-block`}
      >
        <Pre className={'translation-word'}>{wordsPair?.translation}</Pre>
      </Collapse>
    </Card>
  );
};
