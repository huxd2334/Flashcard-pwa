import React, { useEffect, useState } from 'react';
import { countCards, getAllDecks, getTodayStats } from '../db/storage';


const Stats: React.FC = () => {
    const [decks, setDecks] = useState(0);
    const [cards, setCards] = useState(0);
    const [today, setToday] = useState<{reviews:number;quizzes:number}>({reviews:0,quizzes:0});


    useEffect(() => {
        (async () => {
            const ds = await getAllDecks(); setDecks(ds.length);
            setCards(await countCards());
            setToday(await getTodayStats());
        })();
    }, []);


    return (
        <div className="card grid cols-3">
            <div>
                <div style={{opacity:.7}}>Decks</div>
                <div style={{fontSize:24, fontWeight:700}}>{decks}</div>
            </div>
            <div>
                <div style={{opacity:.7}}>Cards</div>
                <div style={{fontSize:24, fontWeight:700}}>{cards}</div>
            </div>
            <div>
                <div style={{opacity:.7}}>Hôm nay</div>
                <div style={{fontSize:14}}>Quiz: <strong>{today.quizzes}</strong> · Luyện: <strong>{today.reviews}</strong></div>
            </div>
        </div>
    );
};


export default Stats;