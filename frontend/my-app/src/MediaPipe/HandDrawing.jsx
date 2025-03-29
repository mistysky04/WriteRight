import React, { useRef, useEffect, useState } from 'react';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const HandDrawing = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [fps, setFps] = useState(0);
    const [handedness, setHandedness] = useState('-');
    const [numHands, setNumHands] = useState(0);

    useEffect(() => {
        let handLandmarker;
        let lastVideoTime = -1;
        let results = undefined;
        let frameCount = 0;
        let lastFpsTime = 0;
        let rafId;
        let camera;

        // Initialize MediaPipe hand landmarker
        const initializeHandLandmarker = async () => {
            try {
                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                        delegate: "GPU"
                    },
                    numHands: 2,
                    runningMode: "VIDEO"
                });

                console.log('Hand landmarker initialized successfully');
                startCamera();
            } catch (error) {
                console.error('Error initializing hand landmarker:', error);
                setErrorMessage('Failed to initialize hand detection: ' + error.message);
            }
        };

        // Start camera
        const startCamera = async () => {
            try {
                const constraints = {
                    video: {
                        width: 640,
                        height: 480,
                        facingMode: "user"
                    }
                };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.addEventListener('loadeddata', predictWebcam);
                }

                camera = stream;
                setIsDetecting(true);
            } catch (error) {
                console.error('Error accessing webcam:', error);
                setErrorMessage('Unable to access webcam. Please check permissions and try again.');
            }
        };

        // Draw landmarks on canvas
        const drawLandmarks = (results) => {
            const ctx = canvasRef.current.getContext('2d');
            const width = canvasRef.current.width;
            const height = canvasRef.current.height;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Draw each detected hand
            for (let i = 0; i < results.landmarks.length; i++) {
                const landmarks = results.landmarks[i];

                // Set color based on actual handedness
                const color = 'rgb(44, 169, 212)';

                // Define connections between landmarks for hand skeleton
                const connections = [
                    // Thumb
                    [0, 1], [1, 2], [2, 3], [3, 4],
                    // Index finger
                    [0, 5], [5, 6], [6, 7], [7, 8],
                    // Middle finger
                    [0, 9], [9, 10], [10, 11], [11, 12],
                    // Ring finger
                    [0, 13], [13, 14], [14, 15], [15, 16],
                    // Pinky
                    [0, 17], [17, 18], [18, 19], [19, 20],
                    // Palm
                    [0, 5], [5, 9], [9, 13], [13, 17]
                ];

                // Draw connections
                ctx.lineWidth = 3;
                ctx.strokeStyle = color;

                for (const [start, end] of connections) {
                    ctx.beginPath();
                    ctx.moveTo(
                        landmarks[start].x * width,
                        landmarks[start].y * height
                    );
                    ctx.lineTo(
                        landmarks[end].x * width,
                        landmarks[end].y * height
                    );
                    ctx.stroke();
                }

                // Draw landmarks
                landmarks.forEach((landmark, index) => {
                    // Use different colors for different parts of the hand
                    if (index === 0) {
                        // Wrist
                        ctx.fillStyle = 'red';
                        ctx.beginPath();
                        ctx.arc(landmark.x * width, landmark.y * height, 8, 0, 2 * Math.PI);
                        ctx.fill();
                    } else {
                        ctx.fillStyle = 'color';
                        ctx.beginPath();
                        ctx.arc(landmark.x * width, landmark.y * height, 8, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                });
            }
        };

        // Process webcam frames
        const predictWebcam = async () => {
            // Check if video is ready
            if (!videoRef.current || videoRef.current.currentTime === lastVideoTime) {
                rafId = requestAnimationFrame(predictWebcam);
                return;
            }

            lastVideoTime = videoRef.current.currentTime;

            // Calculate FPS
            frameCount++;
            const now = performance.now();
            if (now - lastFpsTime >= 1000) {
                setFps(Math.round((frameCount * 1000) / (now - lastFpsTime)));
                frameCount = 0;
                lastFpsTime = now;
            }

            // Detect hands
            if (handLandmarker) {
                results = handLandmarker.detectForVideo(videoRef.current, now);

                if (results && results.landmarks && results.landmarks.length > 0) {
                    setNumHands(results.landmarks.length);
                    // Draw landmarks on canvas
                    drawLandmarks(results);
                } else {
                    // Clear canvas if no hands detected
                    const ctx = canvasRef.current.getContext('2d');
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    setHandedness('-');
                    setNumHands(0);
                }
            }

            rafId = requestAnimationFrame(predictWebcam);
        };

        // Initialize
        initializeHandLandmarker();

        // Cleanup function
        return () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            if (camera) {
                camera.getTracks().forEach(track => track.stop());
            }
            setIsDetecting(false);
        };
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Hand Landmark Detection</h2>

            {errorMessage ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {errorMessage}
                </div>
            ) : null}

            <div>
                <video
                    ref={videoRef}
                    className="absolute top-0 left-0 w-full h-full border border-gray-300 rounded"
                    autoPlay
                    playsInline
                />
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        </div>
    );
};

export default HandDrawing;