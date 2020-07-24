/** @jsx jsx */

import { FunctionComponent, useContext } from 'react';
import { jsx } from '@emotion/core';
import { Dialog, Classes } from '@blueprintjs/core';
import ThemeContext from '../../../../contexts/themeContext';
import TranslationLanguagesSection from './components/TranslationLanguagesSection/TranslationLanguagesSection';

interface IProps {
  isOpen: boolean;
  close: () => void;
}

const HelpModal: FunctionComponent<IProps> = ({ isOpen, close }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Dialog
      className={`${theme.isDarkTheme ? 'bp3-dark' : ''}`}
      icon={'help'}
      title={'Help'}
      isOpen={isOpen}
      onClose={close}
    >
      <div className={Classes.DIALOG_BODY}>
        <TranslationLanguagesSection closeModal={close} />
      </div>
    </Dialog>
  );
};

export default HelpModal;
