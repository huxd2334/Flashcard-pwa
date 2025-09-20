import localforage from 'localforage';
import { nanoid } from 'nanoid';
import type { Deck, Card, QuizResult } from '../types';


localforage.config({ name: 'flashcards-pwa' });
export const decksStore = localforage.createInstance({ name: 'flashcards-pwa', storeName: 'decks' });
export const cardsStore = localforage.createInstance({ name: 'flashcards-pwa', storeName: 'cards' });
export const resultsStore = localforage.createInstance({ name: 'flashcards-pwa', storeName: 'results' });


// ---- Decks ----
export async function getAllDecks(): Promise<Deck[]> {
  const arr: Deck[] = [];
  await decksStore.iterate<Deck, void>((val) => { arr.push(val); });
  return arr.sort((a,b) => b.updatedAt - a.updatedAt);
}
export async function getDeck(id: string) { return decksStore.getItem<Deck>(id); }
export async function createDeck(name: string) {
  const now = Date.now();
  const deck: Deck = { id: nanoid(8), name, createdAt: now, updatedAt: now };
  await decksStore.setItem(deck.id, deck);
  return deck;
}
export async function renameDeck(id: string, name: string) {
  const deck = await getDeck(id);
  if (!deck) return null;
  const updated = { ...deck, name, updatedAt: Date.now() };
  await decksStore.setItem(id, updated);
  return updated;
}
export async function deleteDeck(id: string) {
// delete deck + its cards
  await decksStore.removeItem(id);
  const toDelete: string[] = [];
  await cardsStore.iterate<Card, void>((val, key) => { if (val.deckId === id) toDelete.push(key as string); });
  await Promise.all(toDelete.map(k => cardsStore.removeItem(k)));
}
// ---- Cards ----
export async function getCardsByDeck(deckId: string): Promise<Card[]> {
  const res: Card[] = [];
  await cardsStore.iterate<Card, void>((val) => { if (val.deckId === deckId) res.push(val); });
  return res.sort((a,b)=> (a.due ?? 0) - (b.due ?? 0));
}
export async function getCard(id: string) { return cardsStore.getItem<Card>(id); }
export async function createCard(data: Omit<Card, 'id'|'createdAt'|'updatedAt'>) {
  const now = Date.now();
  const card: Card = { id: nanoid(10), createdAt: now, updatedAt: now, ...data };
  await cardsStore.setItem(card.id, card);
  await touchDeck(card.deckId);
  return card;
}
export async function updateCard(id: string, patch: Partial<Card>) {
  const cur = await getCard(id); if (!cur) return null;
  const next: Card = { ...cur, ...patch, updatedAt: Date.now() };
  await cardsStore.setItem(id, next);
  await touchDeck(next.deckId);
  return next;
}
export async function deleteCard(id: string) {
  const cur = await getCard(id); await cardsStore.removeItem(id); if (cur) await touchDeck(cur.deckId);
}


export async function countCards(deckId?: string) {
  let n = 0; await cardsStore.iterate<Card, void>((val)=>{ if (!deckId || val.deckId===deckId) n++; }); return n;
}


export async function getDueCards(deckId: string, now = Date.now()): Promise<Card[]> {
  const res: Card[] = [];
  await cardsStore.iterate<Card, void>((val)=>{ if (val.deckId === deckId && (val.due ?? 0) <= now) res.push(val); });
  return res.sort((a,b)=> (a.due ?? 0) - (b.due ?? 0));
}


// ---- Results ----
export async function saveQuizResult(r: QuizResult) {
  await resultsStore.setItem(r.id, r);
}

export async function getTodayStats(now = Date.now()) {
  const start = new Date(now); start.setHours(0,0,0,0);
  let reviews = 0; let quizzes = 0;
  await resultsStore.iterate<QuizResult, void>((val)=>{ if (val.startedAt >= start.getTime()) { quizzes++; reviews += val.total; } });
  return { reviews, quizzes };
}


async function touchDeck(id: string) {
  const deck = await getDeck(id); if (!deck) return; deck.updatedAt = Date.now(); await decksStore.setItem(id, deck);
}