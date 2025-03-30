import React, { useRef, useEffect, useState } from 'react';

const HandCanvas = ({ landmarks, isOverlay = false, overlayImage = null }) => {
    const skeletonCanvasRef = useRef(null);
    const drawingCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosition, setLastPosition] = useState(null);
    // Keep track of if the background image is loaded
    const [bgImageLoaded, setBgImageLoaded] = useState(false);
    const bgImageRef = useRef(null);

    // Drawing settings
    const [penColor, setPenColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(8);

    const Z_THRESHOLD = 0.08; // Z-threshold for drawing

    // Effect to handle overlay image loading
    useEffect(() => {
        if (isOverlay && overlayImage) {
            // Create a new image
            const img = new Image();
            // Set up onload handler
            img.onload = () => {
                bgImageRef.current = img;
                setBgImageLoaded(true);

                // Draw the background image when it loads
                if (drawingCanvasRef.current) {
                    const ctx = drawingCanvasRef.current.getContext('2d');
                    // Clear canvas first
                    ctx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
                    // Draw image
                    drawBackgroundImage(ctx);
                }
            };
            // Start loading the image
            img.src = overlayImage;
        } else {
            // If overlay is turned off, clear the canvas and reset image loaded state
            if (drawingCanvasRef.current) {
                clearCanvas();
                setBgImageLoaded(false);
                bgImageRef.current = null;
            }
        }
    }, [isOverlay, overlayImage]);

    // Draw the background image to fit the canvas
    const drawBackgroundImage = (ctx) => {
        if (!bgImageRef.current) return;

        const canvas = drawingCanvasRef.current;
        const img = bgImageRef.current;

        // Scale the image to fit the canvas while maintaining aspect ratio
        const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
        );

        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.save();
        // Since the canvas is mirrored in CSS, we need to flip our drawing context
        // to ensure the image displays correctly
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        ctx.restore();
    };

    // Find index finger (8) landmark
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
                // Draw just the index fingertip as a large dot
                ctx.fillStyle = penColor;
                ctx.beginPath();
                ctx.arc(indexFinger.x * width, indexFinger.y * height, 10, 0, 2 * Math.PI);
                ctx.fill();

                // Add a black border for better visibility
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw with index finger based on Z position
                handleDrawing(indexFinger, width, height);
            }
        });
    }, [landmarks, penColor]);

    // Handle drawing with the index finger
    const handleDrawing = (indexFinger, width, height) => {
        if (!drawingCanvasRef.current || !indexFinger) return;

        const drawCtx = drawingCanvasRef.current.getContext('2d');
        const x = indexFinger.x * width;
        const y = indexFinger.y * height;

        // Check Z position
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
            // Lift the "pen"
            setIsDrawing(false);
        }
    };

    // Clear drawing canvas
    const clearCanvas = () => {
        if (!drawingCanvasRef.current) return;
        const drawCtx = drawingCanvasRef.current.getContext('2d');
        drawCtx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);

        // If we have a background image and overlay is active, redraw it
        if (isOverlay && bgImageRef.current) {
            drawBackgroundImage(drawCtx);
        }
    };

    // Save drawing as image
    const saveDrawing = () => {
        if (!drawingCanvasRef.current) return;

        // Create a temporary canvas to flip the image horizontally
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = drawingCanvasRef.current.width;
        tempCanvas.height = drawingCanvasRef.current.height;

        // Flip the context horizontally
        tempCtx.translate(tempCanvas.width, 0);
        tempCtx.scale(-1, 1);

        // Draw the mirrored image
        tempCtx.drawImage(
            drawingCanvasRef.current,
            0, 0,
            drawingCanvasRef.current.width,
            drawingCanvasRef.current.height
        );

        // Create download link with the correct orientation
        const link = document.createElement('a');
        link.download = 'PEEPEEPOOPOO.png';
        link.href = tempCanvas.toDataURL();
        link.click();
    };

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
                    zIndex: 10,
                    overflow: 'hidden'
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
                    backgroundColor: isOverlay && !bgImageLoaded ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.5)'
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
                <button onClick={saveDrawing} className="px-2 py-1 bg-green-500 text-white rounded">Submit</button>
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