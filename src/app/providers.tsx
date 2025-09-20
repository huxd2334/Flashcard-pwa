import React, { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';


export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <>
            {children}
            <PWAUpdater />
        </>
    );
};


const PWAUpdater: React.FC = () => {
    const [updateReady, setUpdateReady] = useState(false);
    const [wb, setWb] = useState<Workbox | null>(null);


    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const w = new Workbox('/sw.js', { scope: '/' });
            setWb(w);
            w.addEventListener('waiting', () => setUpdateReady(true));
            w.register();
        }
    }, []);


    const doUpdate = async () => {
        await wb?.messageSkipWaiting();
        window.location.reload();
    };


    return updateReady ? (
        <div className="toast">
            <span>Đã có phiên bản mới.</span>
            <button onClick={doUpdate} className="btn">Cập nhật</button>
        </div>
    ) : null;
};