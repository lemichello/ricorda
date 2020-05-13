import {
  Button,
  Card,
  Collapse,
  H3,
  Icon,
  NavbarDivider,
  Pre,
} from '@blueprintjs/core';
import React, { useCallback, useState, FunctionComponent } from 'react';
import './RepeatWord.css';
import { IWordPair } from '../../../../../../apiModels/wordPair';
import WordPairSentences from '../../../WordPairSentences/WordPairSentences';

interface IProps {
  wordPair?: IWordPair;
  loading: boolean;
  updateWordPair?: (wordPair: IWordPair, checkWordPair: () => void) => void;
  disabled?: boolean;
}

const RepeatWord: FunctionComponent<IProps> = ({
  wordPair,
  loading,
  updateWordPair,
  disabled,
}) => {
  const [translationOpen, setTranslationOpen] = useState(false);
  const [checkBtnLoading, setCheckBtnLoading] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const handleUpdateClick: () => void = async () => {
    if (updateWordPair && wordPair) {
      setCheckBtnLoading(true);
      updateWordPair(wordPair, checkWordPair);
    }
  };

  const checkWordPair: () => void = useCallback(() => {
    setChecked(true);
    setCheckBtnLoading(false);
  }, []);

  return (
    <Card className={'repeat-word-card'} elevation={2}>
      {isChecked && (
        <div className={`green-checked-box ${isChecked ? 'animate' : ''}`} />
      )}
      {!isChecked && (
        <div className={'repeat-word-card-content'}>
          <div
            className={`repeat-word-source-word-block ${
              loading ? 'bp3-skeleton' : ''
            }`}
          >
            <div>
              {wordPair?.repetitions === 4 && (
                <Icon
                  className={'repeat-word-last-repetition-icon'}
                  icon={'endorsed'}
                  intent={'primary'}
                  iconSize={20}
                />
              )}
            </div>
            <H3 className={'source-word'}>
              {wordPair?.repetitions === 4
                ? wordPair?.translation
                : wordPair?.sourceWord}
            </H3>
            <div className={'repeat-word-actions-block'}>
              <Button
                disabled={disabled}
                minimal={true}
                icon={'translate'}
                active={translationOpen}
                onClick={() => setTranslationOpen(!translationOpen)}
              />
              <NavbarDivider />
              <Button
                disabled={disabled}
                loading={checkBtnLoading}
                icon={'tick'}
                minimal={true}
                intent={'success'}
                onClick={handleUpdateClick}
              />
            </div>
          </div>
          <Collapse
            isOpen={translationOpen}
            className={`translation-collapse-block`}
          >
            <div>
              <Pre className={'translation-word'}>
                {wordPair?.repetitions === 4
                  ? wordPair?.sourceWord
                  : wordPair?.translation}
              </Pre>
              {!!wordPair?.sentences?.length && (
                <WordPairSentences
                  sentences={wordPair.sentences}
                  sourceWord={wordPair.sourceWord}
                />
              )}
            </div>
          </Collapse>
        </div>
      )}
    </Card>
  );
};

export default RepeatWord;
