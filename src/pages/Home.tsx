import React from 'react';
import { Link } from 'react-router-dom';
import Stats from '../components/Stats';


const Home: React.FC = () => {
    return (
        <>
            <header className="header">
                <div className="header__bar">
                    <strong>Flashcards PWA</strong>
                    <nav className="nav">
                        <Link to="/">Home</Link>
                        <Link to="/decks">Decks</Link>
                        <Link to="/import-export">Import/Export</Link>
                    </nav>
                </div>
            </header>
            <main className="container">
                <h1>Học nhanh, nhớ lâu 📚</h1>
                <p>Ứng dụng thẻ ghi nhớ với chế độ luyện tập và quiz đơn giản. Hỗ trợ offline & có thể cài đặt.</p>
                <div style={{marginTop:16}}>
                    <Stats />
                </div>
                <div style={{marginTop:16}} className="flex">
                    <Link to="/decks" className="btn">Bắt đầu với Decks</Link>
                    <a className="btn ghost" href="#" onClick={(e)=>{ e.preventDefault(); window.alert('Mẹo: Thêm vào màn hình chính để dùng như app!'); }}>Cài đặt PWA</a>
                </div>
            </main>
        </>
    );
};


export default Home;