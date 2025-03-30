import React from 'react';

const Instructions = () => {
    return (
        <div>
            <h2 className="inst-head">Get Started</h2>
            <div className="mt-4 text-sm bg-blue-50 p-3 rounded">
                <ul style={{ listStyleType: '"🖌️ "', fontSize: "1.1rem", marginLeft: "10px" }}>
                    <li>Move your index finger close to the camera to draw</li>
                    <li>Move it away from the camera to lift the pen</li>
                    <li>Use controls below the canvas to change color and line width</li>
                    <li>Toggle "See Closeness" button to check when you are/aren't drawing</li>
                </ul>
            </div>
        </div>
    );
};

export default Instructions;
