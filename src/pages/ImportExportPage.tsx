import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cardsStore, decksStore } from '../db/storage';

const ImportExportPage: React.FC = () => {
    const [json, setJson] = useState('');

    const exportAll = async () => {
        const decks: any[] = []; const cards: any[] = [];
        await decksStore.iterate<any, void>((v)=>{ decks.push(v); });
        await cardsStore.iterate<any, void>((v)=>{ cards.push(v); });
        setJson(JSON.stringify({ decks, cards }, null, 2));
    };

    const importAll = async () => {
        try {
            const data = JSON.parse(json);
            if (Array.isArray(data.decks)) { for (const d of data.decks) await decksStore.setItem(d.id, d); }
            if (Array.isArray(data.cards)) { for (const c of data.cards) await cardsStore.setItem(c.id, c); }
            alert('Import xong ✓');
        } catch (e) { alert('JSON không hợp lệ'); }
    };

    useEffect(() => { exportAll(); }, []);

    return (
        <main className="container">
            <div className="spread" style={{marginBottom:12}}>
                <h2>Import / Export</h2>
                <Link to="/" className="btn secondary">Trang chủ</Link>
            </div>

            <div className="card">
                <div className="flex" style={{justifyContent:'flex-end'}}>
                    <button className="btn ghost" onClick={exportAll}>Export</button>
                    <button className="btn" onClick={importAll}>Import</button>
                </div>
                <textarea className="textarea" rows={14} value={json} onChange={e=>setJson(e.target.value)} />
            </div>
        </main>
    );
};

export default ImportExportPage;