/** @jsx jsx */

import { FunctionComponent } from 'react';
import { jsx } from '@emotion/core';
import TranslationLanguage from '../TranslationLanguagesList/components/TranslationLanguage/TranslationLanguage';

const TranslationLanguagesSkeleton: FunctionComponent = () => {
  return (
    <ul className={'bp3-list'}>
      <TranslationLanguage loading={true} selectLanguage={() => {}} />
      <TranslationLanguage loading={true} selectLanguage={() => {}} />
      <TranslationLanguage loading={true} selectLanguage={() => {}} />
      <TranslationLanguage loading={true} selectLanguage={() => {}} />
      <TranslationLanguage loading={true} selectLanguage={() => {}} />
    </ul>
  );
};

export default TranslationLanguagesSkeleton;
