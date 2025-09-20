import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCardsByDeck, getDeck, saveQuizResult } from '../db/storage';
import Quiz from '../components/Quiz';
import { makeMCQ } from '../logic/quiz';
import type { Deck } from '../types';

const QuizPage: React.FC = () => {
    const { deckId } = useParams();
    const [deck, setDeck] = useState<Deck | null>(null);
    const [startedAt] = useState(Date.now());
    const [done, setDone] = useState<{correct:number;total:number;durationSec:number} | null>(null);
    const [qs, setQs] = useState([] as ReturnType<typeof makeMCQ>);

    useEffect(() => {
        (async () => {
            if (!deckId) return;
            const d = await getDeck(deckId); setDeck(d ?? null);
            const cards = await getCardsByDeck(deckId);
            setQs(makeMCQ(cards, 10));
        })();
    }, [deckId]);

    const onFinish = async (correct: number, total: number, durationSec: number) => {
        if (!deckId) return;
        setDone({correct,total,durationSec});
        await saveQuizResult({ id: `${deckId}-${startedAt}`, deckId, correct, total, durationSec, startedAt });
    };

    return (
        <main className="container">
            <div className="spread" style={{marginBottom:12}}>
                <h2>Quiz – {deck?.name ?? '...'}</h2>
                <Link to={`/decks/${deckId}`} className="btn secondary">Quay lại</Link>
            </div>

            {done ? (
                <div className="card">
                    <h3>Kết quả</h3>
                    <p>Đúng {done.correct}/{done.total} · Thời gian: {done.durationSec}s</p>
                    <Link className="btn" to={`/quiz/${deckId}`}>Làm lại</Link>
                </div>
            ) : (
                <Quiz questions={qs} onFinish={onFinish} />
            )}
        </main>
    );
};

export default QuizPage;