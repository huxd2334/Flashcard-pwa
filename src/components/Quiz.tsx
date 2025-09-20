import React, { useState } from 'react';
import type { MCQ } from '../logic/quiz';

interface Props {
    questions: MCQ[];
    onFinish: (correct: number, total: number, durationSec: number) => void;
}

const Quiz: React.FC<Props> = ({ questions, onFinish }) => {
    const [idx, setIdx] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [start] = useState(Date.now());
    const [selected, setSelected] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    if (questions.length === 0) return <div className="card">Chưa đủ thẻ để tạo quiz.</div>;

    const q = questions[idx];
    const progress = Math.round(((idx) / questions.length) * 100);

    const onChoose = (opt: string) => {
        if (showAnswer) return;
        setSelected(opt);
        const ok = opt === q.answer;
        setCorrect(c => c + (ok ? 1 : 0));
        setShowAnswer(true);
    };

    const next = () => {
        if (idx + 1 < questions.length) {
            setIdx(i => i + 1);
            setSelected(null);
            setShowAnswer(false);
        } else {
            const dur = Math.round((Date.now() - start) / 1000);
            onFinish(correct, questions.length, dur);
        }
    };

    const optStyle = (o: string): React.CSSProperties => {
        if (!showAnswer) return { width: '100%' };
        if (o === q.answer) return { width: '100%', borderColor: '#10b981', background: '#ecfdf5', color: '#065f46' };
        if (o === selected) return { width: '100%', borderColor: '#ef4444', background: '#fef2f2', color: '#991b1b' };
        return { width: '100%', opacity: 0.85 };
    };

    return (
        <div className="card">
            <div className="progress"><div style={{ width: `${progress}%` }} /></div>
            <div style={{marginTop:12}}>
                <div style={{opacity:.7}}>Câu {idx+1} / {questions.length}</div>
                <h3>{q.question}</h3>
                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 8 }}>
                    {q.options.map(o => (
                        <button
                            key={o}
                            className="btn ghost"
                            style={optStyle(o)}
                            onClick={() => onChoose(o)}
                            disabled={showAnswer}
                        >
                            {o}
                        </button>
                    ))}
                </div>
                {showAnswer && (
                    <div className="grid" style={{gridTemplateColumns:'1fr', gap:8, marginTop:12}}>
                        <div className="card" style={{background:'#f8fafc'}}>
                            {selected === q.answer ? '✅ Chính xác!' : `❌ Sai. Đáp án: ${q.answer}`}
                        </div>
                        <button className="btn" onClick={next}>Câu tiếp theo</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;