import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import '../styling/KanjiButtons.css';
// import overlayIchi from '../assets/overlay_1ichi.png';
// import overlayNi from '../assets/overlay_2ni.png';
// import overlaySan from '../assets/overlay_3san.png';
// import overlayYon from '../assets/overlay_4yon.png';
// import overlayGo from '../assets/overlay_5go.png';


// Import overlay images
import overlayIchi from '../assets/overlay_1ichi.png';
import overlayNi from '../assets/overlay_2ni.png';
import overlaySan from '../assets/overlay_3san.png';
import overlayYon from '../assets/overlay_4yon.png';
import overlayGo from '../assets/overlay_5go.png';

function KanjiButtons() {
    // State to track which image is currently displayed (null means no image)
    const [currentImage, setCurrentImage] = useState(null);

    // Image data mapping buttons to their respective images
    const images = {
        "一": overlayIchi,
        "二": overlayNi,
        "三": overlaySan,
        "四": overlayYon,
        "五": overlayGo
    };

    // Handler for button clicks
    const handleButtonClick = (kanji) => {
        // If the clicked button's image is already showing, hide it
        if (currentImage === kanji) {
            setCurrentImage(null);
        } else {
            // Otherwise, show the clicked button's image
            setCurrentImage(kanji);
        }
    };

    return (
        <div>
            <ButtonGroup aria-label="Kanji buttons">
                {Object.keys(images).map((kanji) => (
                    <Button
                        key={kanji}
                        variant="secondary"
                        className="kanji-button"
                        onClick={() => handleButtonClick(kanji)}
                    >
                        {kanji}
                    </Button>
                ))}
            </ButtonGroup>

            {/* Image display area */}
            <div style={{ marginTop: "20px" }}>
                {currentImage && (
                    <img
                        src={images[currentImage]}
                        alt={`Overlay for ${currentImage}`}
                        style={{
                            opacity: 0.4, // 40% opacity
                            width: "640px",
                            height: "480px"
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default KanjiButtons;