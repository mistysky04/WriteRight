import React from 'react';
import '../styling/CrumpledPaper.css';
import HandDrawing from '../MediaPipe/HandDrawing.jsx';

const CrumpledPaper = () => {
    return (
        <div className="paper-container">
            {/* This is the content that will appear on top of the texture */}
            <div className="content">
                <HandDrawing />
            </div>
            {/* This is the crumpled paper texture overlay */}
            <div className="paper-texture"></div>
        </div>
    );
};

export default CrumpledPaper;