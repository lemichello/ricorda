import React, { Context, Dispatch } from 'react';
import { IThemeState } from './models/themeState';

interface IContextFields {
  theme: IThemeState;
  setTheme: Dispatch<IThemeState>;
}

const ThemeContext: Context<IContextFields> = React.createContext<
  IContextFields
>({
  theme: { isDarkTheme: false },
  setTheme: () => {},
});

export default ThemeContext;
