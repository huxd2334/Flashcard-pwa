import type { Card } from '../types';


export type MCQ = { id: string; question: string; options: string[]; answer: string };


export function makeMCQ(cards: Pick<Card,'id'|'front'|'back'>[], n=10): MCQ[] {
    if (cards.length === 0) return [];
    const pool = [...cards];
    const pick = (arr: any[]) => arr.splice(Math.floor(Math.random()*arr.length), 1)[0];
    const res: MCQ[] = [];
    for (let i=0; i<Math.min(n, pool.length); i++) {
        const target = pick(pool);
        const distracts = cards.filter(c => c.id !== target.id).sort(() => Math.random()-0.5).slice(0,3);
        const options = [target.back, ...distracts.map(d=>d.back)].sort(() => Math.random()-0.5);
        res.push({ id: target.id, question: target.front, options, answer: target.back });
    }
    return res;
}