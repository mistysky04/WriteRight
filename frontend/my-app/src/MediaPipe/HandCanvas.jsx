import React, { useRef, useEffect, useState } from 'react';
import APIClient from "../APIClient.js";

const HandCanvas = ({ landmarks }) => {
    const skeletonCanvasRef = useRef(null);
    const drawingCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosition, setLastPosition] = useState(null);

    // Drawing settings
    const [penColor, setPenColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(8);
    let writeScore;


    const Z_THRESHOLD = 0.08; /// Z-threshold for drawing

    // Draw the hand skeleton and landmarks
    useEffect(() => {
        if (!skeletonCanvasRef.current || !landmarks || landmarks.length === 0) return;

        const ctx = skeletonCanvasRef.current.getContext('2d');
        const width = skeletonCanvasRef.current.width;
        const height = skeletonCanvasRef.current.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw each detected hand's index fingertip only
        landmarks.forEach((hand) => {
            // Only get index finger (landmark 8)
            const indexFinger = hand[8];

            if (indexFinger) {
                // Draw just the index fingertip as a larger dot
                ctx.fillStyle = penColor;
                ctx.beginPath();
                ctx.arc(indexFinger.x * width, indexFinger.y * height, 10, 0, 2 * Math.PI);
                ctx.fill();

                // Add a white border for better visibility
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw with index finger based on Z position
                handleDrawing(indexFinger, width, height);
            }
        });
    }, [landmarks]);

    // Handle drawing with the index finger
    const handleDrawing = (indexFinger, width, height) => {
        if (!drawingCanvasRef.current || !indexFinger) return;

        const drawCtx = drawingCanvasRef.current.getContext('2d');
        const x = indexFinger.x * width;
        const y = indexFinger.y * height;

        // Check Z position
        // Note: For Tasks Vision API, a smaller Z value typically means
        // the finger is closer to the camera, but the scale might be different
        const isFingerClose = Math.abs(indexFinger.z) > Z_THRESHOLD;

        if (isFingerClose) {
            // Finger is close enough to draw
            if (!isDrawing) {
                // Start drawing
                setIsDrawing(true);
                setLastPosition({ x, y });

                // Visual feedback that drawing is active
                drawCtx.beginPath();
                drawCtx.arc(x, y, 4, 0, 2 * Math.PI);
                drawCtx.fillStyle = penColor;
                drawCtx.fill();
            } else {
                // Continue drawing
                drawCtx.beginPath();
                drawCtx.moveTo(lastPosition.x, lastPosition.y);
                drawCtx.lineTo(x, y);
                drawCtx.strokeStyle = penColor;
                drawCtx.lineWidth = lineWidth;
                drawCtx.lineCap = 'round';
                drawCtx.lineJoin = 'round';
                drawCtx.stroke();
                setLastPosition({ x, y });
            }
        } else if (isDrawing) {
            // Lift the pen
            setIsDrawing(false);
        }
    };

    // Clear drawing canvas
    const clearCanvas = () => {
        if (!drawingCanvasRef.current) return;
        const drawCtx = drawingCanvasRef.current.getContext('2d');
        drawCtx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
    };

    const saveDrawing = () => {
        if (!drawingCanvasRef.current) return;

        // Step 1: Create flipped image
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = drawingCanvasRef.current.width;
        tempCanvas.height = drawingCanvasRef.current.height;

        tempCtx.translate(tempCanvas.width, 0);
        tempCtx.scale(-1, 1);
        tempCtx.drawImage(
            drawingCanvasRef.current,
            0, 0,
            drawingCanvasRef.current.width,
            drawingCanvasRef.current.height
        );

        // Step 2: Save to image variable (base64)
            tempCanvas.toBlob((blob) => {
                if (blob) {
                    handleBlobImage(blob);
                }
            }, "image/png");
    };

    const handleBlobImage = (blob) =>{
        writeScore = APIClient.postImage(blob);
        console.log(writeScore);
    }

    return (
        <div style={{ position: 'relative', width: '640px', height: '480px' }}>
            {/* Hand tracking visualization canvas */}
            <canvas
                ref={skeletonCanvasRef}
                width={640}
                height={480}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    transform: 'scaleX(-1)',
                    pointerEvents: 'none',
                    zIndex: 10
                }}
            />

            {/* Drawing canvas */}
            <canvas
                ref={drawingCanvasRef}
                width={640}
                height={480}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    transform: 'scaleX(-1)', // Keep consistent with video mirroring
                    pointerEvents: 'none',
                    zIndex: 9,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }}
            />

            {/* Controls */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                display: 'flex',
                gap: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                padding: '5px',
                borderRadius: '5px'
            }}>
                <button onClick={clearCanvas} className="px-2 py-1 bg-red-500 text-white rounded">Clear</button>
                <input
                    type="color"
                    value={penColor}
                    onChange={(e) => setPenColor(e.target.value)}
                    className="w-8 h-8"
                />
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                    className="w-24"
                />
                <button onClick={saveDrawing} className="px-2 py-1 bg-green-500 text-white rounded">Save</button>
            </div>

            {/* Drawing status indicator */}
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 20,
                backgroundColor: isDrawing ? '#7AA166' : '#C46156',
                padding: '5px 10px',
                borderRadius: '5px',
                color: 'white',
                fontWeight: 'bold'
            }}>
                {isDrawing ? 'Drawing' : 'Not Drawing'}
            </div>
        </div>
    );
};

export default HandCanvas;