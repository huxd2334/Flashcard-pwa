import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createCard, deleteCard, getCardsByDeck, getDeck, renameDeck } from '../db/storage';
import CardEditor from '../components/CardEditor';
import type { Card, Deck } from '../types';

const DeckDetailPage: React.FC = () => {
    const { deckId } = useParams();
    const [deck, setDeck] = useState<Deck | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [title, setTitle] = useState('');

    const refresh = async () => {
        if (!deckId) return;
        const d = await getDeck(deckId); setDeck(d ?? null); setTitle(d?.name ?? '');
        setCards(await getCardsByDeck(deckId));
    };

    useEffect(() => { refresh(); }, [deckId]);

    if (!deckId) return <main className="container">Không tìm thấy deck.</main>;

    const saveCard = async (data: { front: string; back: string; example?: string; tags?: string[] }) => {
        if (!data.front || !data.back) return;
        await createCard({ deckId, ...data });
        await refresh();
    };

    const saveTitle = async (e: React.FormEvent) => {
        e.preventDefault(); if (!deck) return; await renameDeck(deck.id, title.trim()); await refresh();
    };

    return (
        <main className="container">
            <div className="spread" style={{marginBottom:12}}>
                <form onSubmit={saveTitle} className="flex" style={{alignItems:'center'}}>
                    <input className="input" style={{minWidth:260}} value={title} onChange={e=>setTitle(e.target.value)} />
                    <button className="btn" type="submit">Lưu tên</button>
                </form>
                <div className="flex">
                    <Link to={`/review/${deckId}`} className="btn">Review</Link>
                    <Link to={`/quiz/${deckId}`} className="btn ghost">Quiz</Link>
                    <Link to="/decks" className="btn secondary">Quay lại</Link>
                </div>
            </div>

            <section className="grid cols-2">
                <div className="card">
                    <h3>Thêm thẻ</h3>
                    <CardEditor initial={{ deckId }} onSave={saveCard} />
                </div>
                <div className="card">
                    <h3>Danh sách thẻ ({cards.length})</h3>
                    <ul className="list">
                        {cards.map(c => (
                            <li key={c.id}>
                                <div>
                                    <div style={{fontWeight:600}}>{c.front}</div>
                                    <div style={{opacity:.8}}>{c.back}</div>
                                </div>
                                <button className="btn secondary" onClick={async ()=>{ await deleteCard(c.id); await refresh(); }}>Xoá</button>
                            </li>
                        ))}
                        {cards.length===0 && <li>Chưa có thẻ nào.</li>}
                    </ul>
                </div>
            </section>
        </main>
    );
};

export default DeckDetailPage;