import React, { useCallback, useEffect, useState } from 'react';
import { H3, InputGroup, NonIdealState } from '@blueprintjs/core';
import { wordsService } from '../../../../services/wordsService';
import { SavedWord } from './components/SavedWord/SavedWord';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { NoSavedWords } from './components/NoSavedWords/NoSavedWords';
import './SavedWords.css';
import Fade from 'react-reveal/Fade';
import { SavedWordsSkeleton } from './components/SavedWordsSkeleton/SavedWordsSkeleton';
import { EditWordModal } from './components/EditWordModal/EditWordModal';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
} from 'rxjs/operators';

export const SavedWords = function () {
  const [savedWords, setSavedWords] = useState(undefined);
  const [isEditModalOpen, setEditModelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animateInput, setAnimateInput] = useState(false);
  const [wordPairForEdit, setWordPairForEdit] = useState(undefined);
  const [searchValue, setSearchValue] = useState('');
  const [onSearch$] = useState(() => new Subject());
  const [onSearch$$] = useState(() =>
    onSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => setLoading(true)),
      tap(() => setSavedWords([])),
      switchMap((term) => wordsService.searchWords(term)),
      tap(() => setLoading(false))
    )
  );

  useEffect(() => {
    const subscription = onSearch$$.subscribe((x) => {
      if (x.length === 0) {
        setSavedWords(null);
      } else {
        setSavedWords(x);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onSearch$$]);

  useEffect(() => {
    async function getSavedWords() {
      let res = await wordsService.getSavedWords();

      setSavedWords(res);
      setLoading(false);
      setAnimateInput(true);
    }

    getSavedWords();
  }, []);

  const handleEditWord = useCallback((wordPair) => {
    setEditModelOpen(true);
    setWordPairForEdit(wordPair);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setEditModelOpen(false);
    setWordPairForEdit(undefined);
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    onSearch$.next(e.target.value);
  };

  const searchInput = (
    <InputGroup
      type={'search'}
      leftIcon={'search'}
      className={'saved-words-search-input'}
      placeholder={'Foreign or translation word'}
      value={searchValue}
      onChange={handleSearchChange}
      autoFocus={true}
    />
  );

  return (
    <div className={'page-root'}>
      <div className={'page-content'}>
        {savedWords !== null && (savedWords?.length !== 0 || loading) && (
          <H3
            className={`saved-words-heading ${loading ? 'bp3-skeleton' : ''}`}
          >
            Saved words
          </H3>
        )}
        {savedWords !== null && savedWords?.length !== 0 && !loading && (
          <CSSTransition
            timeout={1250}
            classNames={'search-input'}
            in={animateInput}
          >
            {searchInput}
          </CSSTransition>
        )}
        {savedWords !== null && savedWords?.length === 0 && !loading && (
          <NoSavedWords />
        )}
        {loading && (
          <Fade timeout={500} top distance={'100px'}>
            <SavedWordsSkeleton />
          </Fade>
        )}
        {savedWords !== null && savedWords?.length !== 0 && (
          <TransitionGroup>
            {savedWords?.map((wordPair) => (
              <CSSTransition
                timeout={700}
                key={wordPair._id}
                classNames={'saved-word-component'}
              >
                <SavedWord wordPair={wordPair} editWord={handleEditWord} />
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
        {savedWords === null && !loading && (
          <NonIdealState
            icon={'search'}
            title={'No search results'}
            description={
              "Your search didn't match any word pairs. Try searching for something else."
            }
            action={searchInput}
          />
        )}
      </div>
      <EditWordModal
        isOpen={isEditModalOpen}
        closeModal={handleEditModalClose}
        wordPair={wordPairForEdit}
      />
    </div>
  );
};
