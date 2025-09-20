import React, { useState } from 'react';
import type { Card } from '../types';
import type { Grade } from '../logic/srs';

interface Props {
    card: Card;
    onGrade: (g: Grade) => void;
}

const ReviewPlayer: React.FC<Props> = ({ card, onGrade }) => {
    const [flipped, setFlipped] = useState(false);
    return (
        <div className="card">
            <div className="card-face flip" onClick={()=>setFlipped(v=>!v)}>
                {flipped ? (
                    <div>
                        <div style={{fontWeight:600}}>{card.back}</div>
                        {card.example && <div style={{marginTop:8, opacity:.8}}>{card.example}</div>}
                        {card.tags && card.tags.length>0 && <div style={{marginTop:8}}>{card.tags.map(t=> <span key={t} className="badge" style={{marginRight:6}}>{t}</span>)}</div>}
                    </div>
                ) : (
                    <div>{card.front}</div>
                )}
            </div>
            <div className="grid" style={{gridTemplateColumns:'1fr', gap:8}}>
                <button className="btn secondary" style={{width:'100%'}} onClick={()=>onGrade('again')}>Again</button>
                <button className="btn secondary" style={{width:'100%'}} onClick={()=>onGrade('hard')}>Hard</button>
                <button className="btn" style={{width:'100%'}} onClick={()=>onGrade('good')}>Good</button>
            </div>
        </div>
    );
};

export default ReviewPlayer;