import React, { useRef, useEffect, useState } from "react";
import APIClient from '../APIClient.js'; // Adjust the path as needed


const HandCanvas = ({landmarks, setScore}) => {
  const skeletonCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState(null);

  // Drawing settings
  const [penColor, setPenColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(18);

  const Z_THRESHOLD = 0.08; // Z-threshold for drawing

  // Find index finger (8) landmark
  useEffect(() => {
    if (!skeletonCanvasRef.current || !landmarks || landmarks.length === 0)
      return;

    const ctx = skeletonCanvasRef.current.getContext("2d");
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
        ctx.arc(
          indexFinger.x * width,
          indexFinger.y * height,
          lineWidth * 0.5,
          0,
          2 * Math.PI
        );
        ctx.fill();

        // Add a black border for better visibility
        ctx.strokeStyle = "black";
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

    const drawCtx = drawingCanvasRef.current.getContext("2d");
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
        drawCtx.lineCap = "round";
        drawCtx.lineJoin = "round";
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
    const drawCtx = drawingCanvasRef.current.getContext("2d");
    drawCtx.clearRect(
      0,
      0,
      drawingCanvasRef.current.width,
      drawingCanvasRef.current.height
    );
  };

  // Save drawing as image
  const saveDrawing = () => {
    if (!drawingCanvasRef.current) return;

    // Create a temporary canvas to flip the image horizontally
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = drawingCanvasRef.current.width;
    tempCanvas.height = drawingCanvasRef.current.height;

    // Fill the canvas with a white background first
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Flip the context horizontally
    tempCtx.translate(tempCanvas.width, 0);
    tempCtx.scale(-1, 1);

    // Draw the mirrored image
    tempCtx.drawImage(
      drawingCanvasRef.current,
      0,
      0,
      drawingCanvasRef.current.width,
      drawingCanvasRef.current.height
    );

    // Convert to Blob and send to backend
    tempCanvas.toBlob(async (blob) => {
      if (!blob) return;

      try {
        const result = await APIClient.postImage(blob);
        setScore(result); // ✅ update score in parent
      } catch (err) {
        console.error("Failed to get score:", err);
      }
    }, "image/png"); // MIME type

    // Create download link with the correct orientation
    const link = document.createElement("a");
    link.download = "PEEPEEPOOPOO.png";
    link.href = tempCanvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      {/* Hand tracking visualization canvas */}
      <canvas
        ref={skeletonCanvasRef}
        width={640}
        height={480}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: "scaleX(-1)",
          pointerEvents: "none",
          zIndex: 10,
          overflow: "hidden"
        }}
      />

      {/* Drawing canvas */}
      <canvas
        ref={drawingCanvasRef}
        width={640}
        height={480}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: "scaleX(-1)", // Keep consistent with video mirroring
          pointerEvents: "none",
          zIndex: 9,
          backgroundColor: "rgba(255, 255, 255, 0.5)"
        }}
      />

      {/* Controls */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          gap: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: "5px",
          borderRadius: "5px"
        }}
      >
        <button
          onClick={clearCanvas}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Clear
        </button>
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
        <button
          onClick={saveDrawing}
          className="px-2 py-1 bg-green-500 text-white rounded"
        >
          Submit
        </button>
      </div>

      {/* Drawing status indicator */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 20,
          backgroundColor: isDrawing ? "#7AA166" : "#C46156",
          padding: "5px 10px",
          borderRadius: "5px",
          color: "white",
          fontWeight: "bold"
        }}
      >
        {isDrawing ? "Drawing" : "Not Drawing"}
      </div>
    </div>
  );
};

export default HandCanvas;
