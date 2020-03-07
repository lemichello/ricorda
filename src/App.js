import React, { useState } from 'react';
import { Header } from './components/Header/index';
import axios from 'axios';
import { Spinner } from '@blueprintjs/core';
import { NewWords } from './components/NewWords';
import { TodayWords } from './components/TodayWords';
import { Router, Route } from 'react-router-dom';
import { history } from './helpers/history';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  axios.interceptors.request.use(
    function resolveRequest(request) {
      setIsLoading(true);
      return request;
    },
    function rejectRequest(err) {
      setIsLoading(true);
      return Promise.reject(err);
    }
  );

  axios.interceptors.response.use(
    function resolveResponse(response) {
      setIsLoading(false);
      return response;
    },
    function rejectResponse(err) {
      setIsLoading(false);
      return Promise.reject(err);
    }
  );

  return (
    <Router history={history}>
      <div>
        <Header />
        <Route path={'/new-words'} component={NewWords} />
        <Route path={'/today-words'} component={TodayWords} />
        <div>
          {isLoading && (
            <Spinner className={'spinner'} size={Spinner.SIZE_LARGE} />
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
