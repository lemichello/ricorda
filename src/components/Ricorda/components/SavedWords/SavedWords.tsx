import React, {
  useCallback,
  useEffect,
  useState,
  FunctionComponent,
  ChangeEvent,
} from 'react';
import { H3, InputGroup, NonIdealState } from '@blueprintjs/core';
import { WordsService } from '../../../../services/wordsService';
import { SavedWord } from './components/SavedWord/SavedWord';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { NoSavedWords } from './components/NoSavedWords/NoSavedWords';
import './SavedWords.css';
// @ts-ignore
import Fade from 'react-reveal/Fade';
import { SavedWordsSkeleton } from './components/SavedWordsSkeleton/SavedWordsSkeleton';
import { EditWordModal } from './components/EditWordModal/EditWordModal';
import { Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
} from 'rxjs/operators';
import { Pagination } from './components/Pagination/Pagination';
import { IWordPair } from '../../../../models/wordPair';
import { ISavedWordsResponse } from '../../../../services/types/words/savedWordsResponse';

export const SavedWords: FunctionComponent = () => {
  const [savedWords, setSavedWords] = useState<IWordPair[] | undefined | null>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState({ page: 1, next: false });
  const [isEditModalOpen, setEditModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animateInput, setAnimateInput] = useState(false);
  const [wordPairForEdit, setWordPairForEdit] = useState<IWordPair | undefined>(
    undefined
  );
  const [searchValue, setSearchValue] = useState('');
  const [onSearch$] = useState(() => new Subject<string>());
  const [onSearch$$] = useState(() =>
    onSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => setLoading(true)),
      tap(() => setSavedWords([])),
      switchMap((term: string) => WordsService.getSavedWords(1, term)),
      tap(() => setLoading(false))
    )
  );

  const searchWords: (page: number, term: string) => void = useCallback(
    async (page, term) => {
      setLoading(true);
      setSavedWords([]);

      try {
        let res: ISavedWordsResponse = await WordsService.getSavedWords(
          page,
          term
        );

        setSavedWords(res.data);
        setCurrentPage({ page: res.page, next: res.next });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const subscription: Subscription = onSearch$$.subscribe((x) => {
      if (x.data.length === 0) {
        setSavedWords(null);
      } else {
        setSavedWords(x.data);
        setCurrentPage({ page: x.page, next: x.next });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onSearch$$]);

  useEffect(() => {
    async function initializeWords() {
      await searchWords(1, '');

      setAnimateInput(true);
    }

    initializeWords();
  }, [searchWords]);

  const handleEditWord: (wordPair: IWordPair) => void = useCallback(
    (wordPair) => {
      setEditModelOpen(true);
      setWordPairForEdit(wordPair);
    },
    []
  );

  const handleEditModalClose: () => void = useCallback(() => {
    setEditModelOpen(false);
    setWordPairForEdit(undefined);
  }, []);

  const handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void = (
    e
  ) => {
    setSearchValue(e.target.value);
    onSearch$.next(e.target.value);
  };

  const searchInput: JSX.Element = (
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
                <SavedWord
                  loading={false}
                  wordPair={wordPair}
                  editWord={handleEditWord}
                />
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
        {!loading && savedWords !== null && savedWords?.length !== 0 && (
          <Pagination
            searchValue={searchValue}
            currentPage={currentPage}
            searchWords={searchWords}
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
