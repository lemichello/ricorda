/** @jsx jsx */

import { FunctionComponent } from 'react';
import { FormGroup, NumericInput } from '@blueprintjs/core';
import { jsx, css } from '@emotion/core';

interface IProps {
  maxRepetitions: number;
  repetitionInterval: number;
  setMaxRepetitions: (maxRepetitions: number) => void;
  setRepetitionInterval: (repetitionInterval: number) => void;
}

const RepeatSettings: FunctionComponent<IProps> = ({
  setMaxRepetitions,
  setRepetitionInterval,
  maxRepetitions,
  repetitionInterval,
}) => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 25px;
      `}
    >
      <FormGroup
        css={css`
          margin-right: 12px;
        `}
        label={'Repetitions count'}
        labelInfo={'(times)'}
      >
        <NumericInput
          value={maxRepetitions}
          min={1}
          leftIcon={'history'}
          clampValueOnBlur={true}
          onValueChange={(val) => setMaxRepetitions(isNaN(val) ? 1 : val)}
        />
      </FormGroup>
      <FormGroup label={'Repetition interval'} labelInfo={'(hours)'}>
        <NumericInput
          value={repetitionInterval}
          min={1}
          leftIcon={'time'}
          clampValueOnBlur={true}
          onValueChange={(val) => setRepetitionInterval(isNaN(val) ? 1 : val)}
        />
      </FormGroup>
    </div>
  );
};

export default RepeatSettings;
