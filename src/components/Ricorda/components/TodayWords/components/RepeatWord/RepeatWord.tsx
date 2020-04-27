import {
  Button,
  Card,
  Collapse,
  H3,
  Icon,
  NavbarDivider,
  Pre,
  Tooltip,
} from '@blueprintjs/core';
import React, { useCallback, useState, FunctionComponent } from 'react';
import './RepeatWord.css';
import { IWordPair } from '../../../../../../models/wordPair';

interface IProps {
  wordPair?: IWordPair;
  loading: boolean;
  updateWordPair?: (wordPair: IWordPair, chackWordPair: () => void) => void;
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

  const getTooltipContent: () => string = () => {
    if (wordPair?.repetitions === 4) {
      return wordPair?.translation.length > 13 ? wordPair?.translation : '';
    }

    return wordPair && wordPair?.sourceWord.length > 13
      ? wordPair?.sourceWord
      : '';
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
                <Tooltip content={'Last repetition'} intent={'primary'}>
                  <Icon icon={'endorsed'} intent={'primary'} iconSize={20} />
                </Tooltip>
              )}
            </div>
            <Tooltip
              className={'source-word-tooltip'}
              content={getTooltipContent()}
            >
              <H3 className={'source-word'}>
                {wordPair?.repetitions === 4
                  ? wordPair?.translation
                  : wordPair?.sourceWord}
              </H3>
            </Tooltip>
            <div className={'repeat-word-actions-block'}>
              <Button
                disabled={disabled}
                minimal={true}
                icon={'translate'}
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
            <Pre className={'translation-word'}>
              {wordPair?.repetitions === 4
                ? wordPair?.sourceWord
                : wordPair?.translation}
            </Pre>
          </Collapse>
        </div>
      )}
    </Card>
  );
};

export default RepeatWord;
