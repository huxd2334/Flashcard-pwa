export type Deck = { id: string; name: string; createdAt: number; updatedAt: number };
export type Card = {
    id: string; deckId: string;
    front: string; back: string;
    example?: string; tags?: string[];
    ease?: number; interval?: number; due?: number;
    createdAt: number; updatedAt: number;
};
export type QuizResult = { id: string; deckId: string; correct: number; total: number; startedAt: number; durationSec: number };