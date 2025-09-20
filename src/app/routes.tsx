// import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import DecksPage from '../pages/DecksPage';
import DeckDetailPage from '../pages/DeckDetailPage';
import ReviewPage from '../pages/ReviewPage';
import QuizPage from '../pages/QuizPage';
import ImportExportPage from '../pages/ImportExportPage';


export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/decks', element: <DecksPage /> },
  { path: '/decks/:deckId', element: <DeckDetailPage /> },
  { path: '/review/:deckId', element: <ReviewPage /> },
  { path: '/quiz/:deckId', element: <QuizPage /> },
  { path: '/import-export', element: <ImportExportPage /> },
]);