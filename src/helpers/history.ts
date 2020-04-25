import { createBrowserHistory, History } from 'history';

export const history: History = createBrowserHistory({
  basename: process.env.PUBLIC_URL,
});
