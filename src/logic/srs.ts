import type { Card } from '../types';
export type Grade = 'again' | 'hard' | 'good';


export function nextSchedule(card: Card, grade: Grade) {
    const curEase = card.ease ?? 2.3;
    const ease = Math.max(1.3, curEase + (grade==='good'? +0.1 : grade==='hard'? -0.05 : -0.2));
    let interval = card.interval ?? 0;
    if (grade==='again') interval = 1;
    else if (interval===0) interval = 1;
    else if (grade==='hard') interval = Math.max(1, Math.round(interval * 1.2));
    else interval = Math.round(interval * ease);
    const due = Date.now() + interval * 24 * 3600 * 1000;
    return { ease, interval, due } as Pick<Card, 'ease'|'interval'|'due'>;
}