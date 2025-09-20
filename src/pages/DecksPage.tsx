import React from 'react';
import { Link } from 'react-router-dom';
import DeckList from '../components/DeckList';


const DecksPage: React.FC = () => {
    return (
        <main className="container">
            <div className="spread" style={{marginBottom:12}}>
                <h2>Decks</h2>
                <Link to="/" className="btn ghost">Trang chủ</Link>
            </div>
            <DeckList />
        </main>
    );
};


export default DecksPage;