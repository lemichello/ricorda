/** @jsx jsx */

import { Button, NonIdealState } from '@blueprintjs/core';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import Fade from 'react-reveal/Fade';
import { jsx, css } from '@emotion/core';

const NoWords: FunctionComponent = () => {
  const newWordsPageBtn: JSX.Element = (
    <Link to={'/'} className={'navigation-link'}>
      <Button
        outlined
        text={'Add new words'}
        css={css`
          border-radius: 15px;
          height: 35px;
          width: 55%;
          text-transform: uppercase;
        `}
      />
    </Link>
  );

  return (
    <Fade timeout={500} top distance={'100px'}>
      <NonIdealState
        icon={'clean'}
        title={'No words for today'}
        description={
          'There are no words to repeat for today. You can add new ones or come back tomorrow.'
        }
        action={newWordsPageBtn}
      />
    </Fade>
  );
};

export default NoWords;
