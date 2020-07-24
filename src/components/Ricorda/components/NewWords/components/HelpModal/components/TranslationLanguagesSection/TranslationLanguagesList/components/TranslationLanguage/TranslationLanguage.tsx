/** @jsx jsx */

import { FunctionComponent } from 'react';
import { jsx, css } from '@emotion/core';
import { ITranslationLanguage } from '../../../../../../../../../../../apiModels/ITranslationLanguage';
import { Tag } from '@blueprintjs/core';

interface IProps {
  translationLanguage?: ITranslationLanguage;
  loading?: boolean;
  selectLanguage: (language: string) => void;
}

const TranslationLanguage: FunctionComponent<IProps> = ({
  translationLanguage,
  loading,
  selectLanguage,
}) => {
  return (
    <li>
      <Tag
        round
        minimal
        interactive
        className={loading ? 'bp3-skeleton' : ''}
        onClick={() => {
          if (translationLanguage?.code) {
            selectLanguage(translationLanguage.code);
          }
        }}
        css={css`
          margin-right: 5px;

          width: ${loading ? '20%' : 'inherit'};
        `}
      >
        {translationLanguage?.code}
      </Tag>
      {translationLanguage?.name}
    </li>
  );
};

export default TranslationLanguage;
