// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './styles/Home.css';
import './styles/Buttons.css';
import './styles/animations.css';

function App() {
    return (
        <div style={{ background: 'transparent', minHeight: '100vh' }}>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
}

export default App;