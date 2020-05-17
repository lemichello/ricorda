import { css, SerializedStyles } from '@emotion/core';

export const cardMediaQueries: SerializedStyles = css`
  @media (min-width: 576px) {
    width: 70vw;
  }
  @media (min-width: 650px) {
    width: 60vw;
  }
  @media (min-width: 750px) {
    width: 50vw;
  }
  @media (min-width: 1000px) {
    width: 45vw;
  }
  @media (min-width: 1200px) {
    width: 40vw;
  }
  @media (min-width: 1450px) {
    width: 35vw;
  }
`;

export const inputMediaQueries: SerializedStyles = css`
  @media (min-width: 350px) {
    font-size: 18px !important;
    line-height: 21px !important;
  }
  @media (min-width: 400px) {
    font-size: 20px !important;
    line-height: 23px !important;
  }
  @media (min-width: 450px) {
    font-size: 22px !important;
    line-height: 25px !important;
  }
  @media (min-width: 850px) {
    font-size: 24px !important;
    line-height: 28px !important;
  }
  @media (min-width: 1000px) {
    font-size: 26px !important;
    line-height: 30px !important;
  }
  @media (min-width: 1200px) {
    font-size: 28px !important;
    line-height: 32px !important;
  }
`;

export const inputStyles: SerializedStyles = css`
  font-size: 16px !important;
  line-height: 19px !important;
  margin-bottom: 0;
  width: 45%;
  max-width: 45%;

  &:nth-of-type(1) > div {
    float: right;
  }

  ${inputMediaQueries}
`;

export const collapseStyles: SerializedStyles = css`
  width: 100%;
`;
