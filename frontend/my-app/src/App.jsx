import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import APIClient from './APIClient.js';

function App() {
    const [count, setCount] = useState(0);

    const handleClick = async () => {
        try {
            const res = await fetch('../public/Kanji-handwritten.png');
            const blob = await res.blob();
            const data = await APIClient.postImage(blob);
            console.log('✅ OCR Result:', data);
        } catch (err) {
            console.error('❌ OCR Failed:', err);
        }
    };

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => {
                    setCount((count) => count + 1);
                    handleClick();
                }}>
                    count is {count}
                </button>
            </div>
        </>
    );
}

export default App;
