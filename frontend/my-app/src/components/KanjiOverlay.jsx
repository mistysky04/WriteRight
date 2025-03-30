import React, { useEffect, useRef } from 'react';

const KanjiOverlay = ({ activeKanji, overlayImages }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw active overlay if there is one
        if (activeKanji && overlayImages[activeKanji]) {
            drawOverlay(ctx, overlayImages[activeKanji]);
        }
    }, [activeKanji, overlayImages]);

    const drawOverlay = (ctx, imageSrc) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            // Save the current global alpha
            const currentAlpha = ctx.globalAlpha;

            // Set opacity to 50%
            ctx.globalAlpha = 0.5;

            // Draw the image to fit the canvas
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);

            // Restore the original global alpha
            ctx.globalAlpha = currentAlpha;
        };
    };

    return (
        <div className="kanji-overlay-container" style={{ position: 'relative', marginBottom: '1rem' }}>
            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                style={{
                    border: '1px solid #ccc',
                    backgroundColor: '#fff'
                }}
            />
        </div>
    );
};

export default KanjiOverlay;