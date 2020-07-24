/** @jsx jsx */

import { FunctionComponent, Fragment, useContext } from 'react';
import { jsx } from '@emotion/core';
import SectionHeader from '../../../../../Header/components/SettingsDialog/components/SectionHeader/SectionHeader';
import TranslationLanguagesList from './TranslationLanguagesList/TranslationLanguagesList';
import TranslationLanguagesContext from '../../../../../../contexts/translationLanguagesContext';

interface IProps {
  closeModal: () => void;
}

const TranslationLanguagesSection: FunctionComponent<IProps> = ({
  closeModal,
}) => {
  const { translationLanguages } = useContext(TranslationLanguagesContext);

  return (
    <Fragment>
      <SectionHeader icon={'translate'} text={'Translation languages'} />
      <TranslationLanguagesList
        translationLanguages={translationLanguages.languages}
        closeModal={closeModal}
      />
    </Fragment>
  );
};

export default TranslationLanguagesSection;
