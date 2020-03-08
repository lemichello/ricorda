import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Spinner } from '@blueprintjs/core';
import './App.css';
import { Ricorda } from './Ricorda';
import { darkThemeService } from '../services/darkThemeService';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkTheme, setDarkTheme] = useState(
    darkThemeService.getThemeState()
  );

  const toggleDarkTheme = useCallback(() => {
    setDarkTheme(!isDarkTheme);
  }, [isDarkTheme]);

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
    <div className={`app-root ${isDarkTheme ? 'bp3-dark' : ''}`}>
      <Ricorda toggleDarkTheme={toggleDarkTheme} />
      <div>
        {isLoading && (
          <Spinner className={'spinner'} size={Spinner.SIZE_LARGE} />
        )}
      </div>
    </div>
  );
}

export default App;
