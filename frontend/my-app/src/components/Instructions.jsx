import React from 'react';

const Instructions = () => {
    return (
        <div>
            <h2 className="inst-head">Get Started</h2>
            <div className="mt-4 text-sm bg-blue-50 p-3 rounded">
                <ul className="list-disc pl-5 mt-1">
                    <li>Move your index finger (red dot) closer to the camera to draw</li>
                    <li>Move it away from the camera to lift the pen</li>
                    <li>Use controls below the canvas to change color and line width</li>
                    <li>Enable Debug Mode to see Z-values and help calibrate the threshold</li>
                </ul>
            </div>
        </div>
    );
};

export default Instructions;
