/** @jsx jsx */

import {
  useCallback,
  useEffect,
  useState,
  FunctionComponent,
  ChangeEvent,
  Fragment,
} from 'react';
import { H3, InputGroup, NonIdealState } from '@blueprintjs/core';
import { WordsService } from '../../../../services/wordsService';
import SavedWord from './components/SavedWord/SavedWord';
import { CSSTransition } from 'react-transition-group';
import NoSavedWords from './components/NoSavedWords/NoSavedWords';
// @ts-ignore
import Fade from 'react-reveal/Fade';
import SavedWordsSkeleton from './components/SavedWordsSkeleton/SavedWordsSkeleton';
import EditWordModal from './components/EditWordModal/EditWordModal';
import { Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
} from 'rxjs/operators';
import Pagination from './components/Pagination/Pagination';
import { IWordPair } from '../../../../apiModels/wordPair';
import { ISavedWordsResponse } from '../../../../services/types/words/savedWordsResponse';
import { jsx, css, ClassNames } from '@emotion/core';
import PageRoot from '../PageRoot/PageRoot';

const SavedWords: FunctionComponent = () => {
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
      placeholder={'Foreign or translation word'}
      value={searchValue}
      onChange={handleSearchChange}
      autoFocus={true}
      css={css`
        max-width: 75vw;
        margin: 5px auto 15px;
        width: 300px;
      `}
    />
  );

  return (
    <PageRoot>
      {savedWords !== null && (savedWords?.length !== 0 || loading) && (
        <H3
          className={`${loading ? 'bp3-skeleton' : ''}`}
          css={css`
            text-align: center;
          `}
        >
          Saved words
        </H3>
      )}

      {savedWords !== null && savedWords?.length !== 0 && !loading && (
        <ClassNames>
          {({ css }) => (
            <CSSTransition
              timeout={1250}
              classNames={{
                enter: css({
                  width: '40px !important',
                }),
                enterActive: css({
                  width: '300px !important',
                  transition: 'width 700ms',
                  transitionDelay: '550ms',
                }),
                exit: css({
                  width: '300px !important',
                }),
                exitActive: css({
                  width: '40px !important',
                  transition: 'width 700ms',
                }),
              }}
              in={animateInput}
            >
              {searchInput}
            </CSSTransition>
          )}
        </ClassNames>
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
        <Fragment>
          {savedWords?.map((wordPair) => (
            <SavedWord
              key={wordPair._id}
              loading={false}
              wordPair={wordPair}
              editWord={handleEditWord}
            />
          ))}
        </Fragment>
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
      <EditWordModal
        isOpen={isEditModalOpen}
        closeModal={handleEditModalClose}
        wordPair={wordPairForEdit}
      />
    </PageRoot>
  );
};

export default SavedWords;
