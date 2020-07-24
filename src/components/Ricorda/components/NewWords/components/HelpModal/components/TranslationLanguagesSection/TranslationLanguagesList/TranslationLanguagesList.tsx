/** @jsx jsx */

import { FunctionComponent, useCallback, useContext } from 'react';
import { jsx } from '@emotion/core';
import { ITranslationLanguage } from '../../../../../../../../../apiModels/ITranslationLanguage';
import TranslationLanguage from './components/TranslationLanguage/TranslationLanguage';
import UserContext from '../../../../../../../contexts/userContext';

interface IProps {
  translationLanguages: ITranslationLanguage[];
  closeModal: () => void;
}

const TranslationLanguagesList: FunctionComponent<IProps> = ({
  translationLanguages,
  closeModal,
}) => {
  const { user, setUser } = useContext(UserContext);

  const selectLanguage: (language: string) => void = useCallback(
    (language: string) => {
      setUser({
        token: user.token,
        translationLanguage: language,
        registrationType: user.registrationType,
      });
      closeModal();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <ul className={'bp3-list'}>
      {translationLanguages.map((x) => (
        <TranslationLanguage
          translationLanguage={x}
          key={x.code}
          selectLanguage={selectLanguage}
        />
      ))}
    </ul>
  );
};

export default TranslationLanguagesList;
