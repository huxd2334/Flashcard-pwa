import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createDeck, getAllDecks, countCards } from '../db/storage';
import type { Deck } from '../types';


const DeckList: React.FC = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [name, setName] = useState('');
    const [counts, setCounts] = useState<Record<string, number>>({});


    const refresh = async () => {
        const ds = await getAllDecks();
        setDecks(ds);
        const m: Record<string, number> = {};
        await Promise.all(ds.map(async d => { m[d.id] = await countCards(d.id); }));
        setCounts(m);
    };


    useEffect(() => { refresh(); }, []);


    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        await createDeck(name.trim());
        setName('');
        await refresh();
    };


    return (
        <div className="card">
            <form onSubmit={onCreate} className="flex">
                <input className="input" placeholder="Tên deck mới" value={name} onChange={e=>setName(e.target.value)} />
                <button className="btn" type="submit">Tạo</button>
            </form>
            <ul className="list" style={{marginTop:12}}>
                {decks.map(d => (
                    <li key={d.id}>
                        <div className="flex" style={{gap:12}}>
                            <strong>{d.name}</strong>
                            <span className="badge">{counts[d.id] ?? 0} thẻ</span>
                        </div>
                        <Link to={`/decks/${d.id}`} className="btn ghost">Mở</Link>
                    </li>
                ))}
                {decks.length===0 && <li>Chưa có deck nào. Tạo deck đầu tiên!</li>}
            </ul>
        </div>
    );
};


export default DeckList;