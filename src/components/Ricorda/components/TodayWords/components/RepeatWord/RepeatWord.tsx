/** @jsx jsx */

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
import { useCallback, useState, FunctionComponent } from 'react';
import { IWordPair } from '../../../../../../apiModels/wordPair';
import WordPairSentences from '../../../WordPairSentences/WordPairSentences';
import { jsx, css, keyframes } from '@emotion/core';

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

  const checkSuccessKeyframe = keyframes`
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  `;

  return (
    <Card
      elevation={2}
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 75vw;
        margin-bottom: 30px;
        padding: 0;

        @media (min-width: 576px) {
          width: 50vw;
        }

        @media (min-width: 1200px) {
          width: 30vw;
        }
      `}
    >
      {isChecked && (
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            align-self: flex-end;
            border-radius: 3px;
            background-color: #0f9960;
            position: relative;
            width: 0;
            padding: 20px;
            min-height: 80px;
            animation: ${checkSuccessKeyframe} 0.6s ease-out;
          `}
        />
      )}
      {!isChecked && (
        <div
          css={css`
            width: 100%;
            padding: 20px;
          `}
        >
          <div
            className={`${loading ? 'bp3-skeleton' : ''}`}
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;

              & > button:nth-of-type(2) {
                margin-left: auto;
              }
            `}
          >
            <div>
              {wordPair?.repetitions === 4 && (
                <Tooltip content={'Last repetition'} intent={'primary'}>
                  <Icon
                    icon={'endorsed'}
                    intent={'primary'}
                    iconSize={20}
                    css={css`
                      margin-bottom: 5px;
                    `}
                  />
                </Tooltip>
              )}
            </div>
            <H3
              css={css`
                margin-top: 5px;
                margin-right: 15px;
                margin-left: 15px;
                max-width: 40%;
                word-wrap: break-word;
                font-style: italic;
                font-size: 18px !important;
                line-height: 22px !important;

                @media (min-width: 576px) {
                  max-width: 50%;
                }

                @media (min-width: 1200px) {
                  font-size: 22px !important;
                  line-height: 25px !important;
                }
              `}
            >
              {wordPair?.repetitions === 4
                ? wordPair?.translation
                : wordPair?.sourceWord}
            </H3>
            <div
              css={css`
                display: flex;
                align-items: center;
              `}
            >
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
