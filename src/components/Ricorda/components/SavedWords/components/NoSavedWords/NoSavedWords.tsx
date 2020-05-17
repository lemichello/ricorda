/** @jsx jsx */

// @ts-ignore
import Fade from 'react-reveal/Fade';
import { FunctionComponent } from 'react';
import { Button, NonIdealState } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { jsx, css } from '@emotion/core';

const NoSavedWords: FunctionComponent = () => {
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
        title={'No saved words'}
        description={'There are no saved words yet. You can add new ones.'}
        action={newWordsPageBtn}
      />
    </Fade>
  );
};

export default NoSavedWords;
