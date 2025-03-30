import React, { useRef, useEffect, useState } from 'react';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import HandCanvas from './HandCanvas';

const HandDrawing = () => {
    const videoRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [landmarks, setLandmarks] = useState([]);
    const [isDebugMode, setIsDebugMode] = useState(false);
    const [zValue, setZValue] = useState(0);

    useEffect(() => {
        let handLandmarker;
        let lastVideoTime = -1;
        let rafId;
        let camera;

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
                    numHands: 1,
                    runningMode: "VIDEO"
                });

                console.log('Hand landmarker initialized successfully');
                startCamera();
            } catch (error) {
                console.error('Error initializing hand landmarker:', error);
                setErrorMessage('Failed to initialize hand detection: ' + error.message);
            }
        };

        const startCamera = async () => {
            try {
                const constraints = { video: { width: 640, height: 480, facingMode: "user" } };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.addEventListener('loadeddata', predictWebcam);
                }

                camera = stream;
            } catch (error) {
                console.error('Error accessing webcam:', error);
                setErrorMessage('Unable to access webcam. Please check permissions and try again.');
            }
        };

        const predictWebcam = async () => {
            if (!videoRef.current || videoRef.current.currentTime === lastVideoTime) {
                rafId = requestAnimationFrame(predictWebcam);
                return;
            }

            lastVideoTime = videoRef.current.currentTime;

            if (handLandmarker) {
                const results = handLandmarker.detectForVideo(videoRef.current, performance.now());
                setLandmarks(results?.landmarks || []);

                // Update Z value for debug mode if index finger is detected
                if (isDebugMode && results?.landmarks?.length > 0 && results.landmarks[0].length > 8) {
                    setZValue(results.landmarks[0][8].z);
                }
            }

            rafId = requestAnimationFrame(predictWebcam);
        };

        initializeHandLandmarker();

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (camera) camera.getTracks().forEach(track => track.stop());
        };
    }, [isDebugMode]);

    return (
        <div className="hand-drawing-container relative">
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            {/* Debug mode toggle */}
            <div className="absolute top-2 right-2 z-20">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isDebugMode}
                        onChange={() => setIsDebugMode(!isDebugMode)}
                        className="form-checkbox h-4 w-4"
                    />
                    <span>Debug Mode</span>
                </label>

                {isDebugMode && (
                    <div className="bg-black bg-opacity-70 text-white p-2 mt-2 rounded text-sm">
                        <p>Z Value: {zValue.toFixed(4)}</p>
                        <p className="text-xs mt-1">
                            Adjust Z_THRESHOLD in HandCanvas.jsx if needed
                        </p>
                    </div>
                )}
            </div>

            {/* Video feed with overlay container */}
            <div className="video-overlay-container">
            <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                />
                <HandCanvas landmarks={landmarks} />
            </div>
        </div>
    );
};

export default HandDrawing;