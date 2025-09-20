import React, { useEffect, useState } from 'react';
import type { Card } from '../types';


interface Props {
    initial?: Partial<Card> & { deckId: string };
    onSave: (data: { front: string; back: string; example?: string; tags?: string[] }) => Promise<void> | void;
    onCancel?: () => void;
}


const CardEditor: React.FC<Props> = ({ initial, onSave, onCancel }) => {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [example, setExample] = useState('');
    const [tags, setTags] = useState('');


    useEffect(() => {
        setFront(initial?.front ?? '');
        setBack(initial?.back ?? '');
        setExample(initial?.example ?? '');
        setTags((initial?.tags ?? []).join(','));
    }, [initial]);


    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave({ front: front.trim(), back: back.trim(), example: example.trim() || undefined, tags: tags.split(',').map(s=>s.trim()).filter(Boolean) });
        setFront(''); setBack(''); setExample(''); setTags('');
    };


    return (
        <form onSubmit={submit} className="grid">
            <input className="input" placeholder="Mặt trước (từ/câu hỏi)" value={front} onChange={e=>setFront(e.target.value)} />
            <input className="input" placeholder="Mặt sau (nghĩa/đáp án)" value={back} onChange={e=>setBack(e.target.value)} />
            <textarea className="textarea" placeholder="Ví dụ (tuỳ chọn)" value={example} onChange={e=>setExample(e.target.value)} />
            <input className="input" placeholder="Tags, phân tách bằng dấu phẩy" value={tags} onChange={e=>setTags(e.target.value)} />
            <div className="flex">
                <button className="btn" type="submit">Lưu thẻ</button>
                {onCancel && <button type="button" className="btn secondary" onClick={onCancel}>Huỷ</button>}
            </div>
        </form>
    );
};


export default CardEditor;