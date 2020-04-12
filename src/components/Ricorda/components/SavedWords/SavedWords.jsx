import React, { useCallback, useEffect, useState } from 'react';
import { H3 } from '@blueprintjs/core';
import { wordsService } from '../../../../services/wordsService';
import { SavedWord } from './components/SavedWord/SavedWord';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { NoSavedWords } from './components/NoSavedWords/NoSavedWords';
import './SavedWords.css';
import Fade from 'react-reveal/Fade';
import { SavedWordsSkeleton } from './components/SavedWordsSkeleton/SavedWordsSkeleton';
import { EditWordModal } from './components/EditWordModal/EditWordModal';

export const SavedWords = function() {
  const [savedWords, setSavedWords] = useState(undefined);
  const [isEditModalOpen, setEditModelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wordPairForEdit, setWordPairForEdit] = useState(undefined);

  useEffect(() => {
    async function getSavedWords() {
      let res = await wordsService.getSavedWords();

      setSavedWords(res);
      setLoading(false);
    }

    getSavedWords();
  }, []);

  const handleEditWord = useCallback(wordPair => {
    setEditModelOpen(true);
    setWordPairForEdit(wordPair);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setEditModelOpen(false);
    setWordPairForEdit(undefined);
  }, []);

  return (
    <div className={'page-root'}>
      <div className={'page-content'}>
        {(savedWords?.length !== 0 || loading) && (
          <H3 className={loading ? 'bp3-skeleton' : ''}>Saved words</H3>
        )}
        {savedWords?.length === 0 && !loading && <NoSavedWords />}
        {loading && (
          <Fade timeout={500} top distance={'100px'}>
            <SavedWordsSkeleton />
          </Fade>
        )}
        {savedWords?.length !== 0 && (
          <TransitionGroup>
            {savedWords?.map(wordPair => (
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
      </div>
      <EditWordModal
        isOpen={isEditModalOpen}
        closeModal={handleEditModalClose}
        wordPair={wordPairForEdit}
      />
    </div>
  );
};
