import React, { useRef, useEffect } from 'react';

const HandCanvas = ({ landmarks }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !landmarks) return;

        const ctx = canvasRef.current.getContext('2d');
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Define hand skeleton connections
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [0, 9], [9, 10], [10, 11], [11, 12],
            [0, 13], [13, 14], [14, 15], [15, 16],
            [0, 17], [17, 18], [18, 19], [19, 20],
            [0, 5], [5, 9], [9, 13], [13, 17]
        ];

        // Draw each detected hand
        landmarks.forEach((hand) => {
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgb(44, 169, 212)';

            // Draw connections
            for (const [start, end] of connections) {
                ctx.beginPath();
                ctx.moveTo(hand[start].x * width, hand[start].y * height);
                ctx.lineTo(hand[end].x * width, hand[end].y * height);
                ctx.stroke();
            }

            // Draw landmarks
            hand.forEach((landmark, index) => {
                ctx.fillStyle = index === 0 ? 'red' : 'blue';
                ctx.beginPath();
                ctx.arc(landmark.x * width, landmark.y * height, 6, 0, 2 * Math.PI);
                ctx.fill();
            });
        });
    }, [landmarks]);

    return (
        <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: 'scaleX(1)',
                pointerEvents: 'none',
                zIndex: 10
            }}
        />
    );
};

export default HandCanvas;
