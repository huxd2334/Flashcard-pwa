import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDeck, getDueCards, updateCard } from '../db/storage';
import ReviewPlayer from '../components/ReviewPlayer';
import { nextSchedule, type Grade } from '../logic/srs';
import type { Card, Deck } from '../types';

const ReviewPage: React.FC = () => {
    const { deckId } = useParams();
    const [deck, setDeck] = useState<Deck | null>(null);
    const [queue, setQueue] = useState<Card[]>([]);
    const [initialQueue, setInitialQueue] = useState<Card[]>([]);
    const [done, setDone] = useState(0);

    const refill = async () => {
        if (!deckId) return;
        setDeck((await getDeck(deckId)) ?? null);
        const due = await getDueCards(deckId);
        setInitialQueue(due);
        setQueue(due);
        setDone(0);
    };

    useEffect(() => { refill(); }, [deckId]);

    const grade = async (g: Grade) => {
        const cur = queue[0]; if (!cur) return;
        const sched = nextSchedule(cur, g);
        await updateCard(cur.id, sched);
        setDone(d=>d+1);
        setQueue(q=>q.slice(1));
    };

    const restartSession = () => {
        if (initialQueue.length === 0) return;
        setQueue([...initialQueue]);
        setDone(0);
    };

    return (
        <main className="container">
            <div className="spread" style={{marginBottom:12}}>
                <h2>Review – {deck?.name ?? '...'}</h2>
                <Link to={`/decks/${deckId}`} className="btn secondary">Quay lại</Link>
            </div>

            {queue.length > 0 ? (
                <>
                    <div style={{marginBottom:8, opacity:.7}}>Còn lại: {queue.length} · Đã làm: {done}</div>
                    <ReviewPlayer card={queue[0]} onGrade={grade} />
                </>
            ) : (
                <div className="card">
                    <h3>Hoàn thành 🎉</h3>
                    <p>Không còn thẻ đến hạn.</p>
                    <div className="grid" style={{gridTemplateColumns:'1fr', gap:8}}>
                        <button className="btn" onClick={restartSession}>Ôn lại bộ thẻ này</button>
                        <button className="btn ghost" onClick={refill}>Tải lại thẻ đến hạn</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ReviewPage;