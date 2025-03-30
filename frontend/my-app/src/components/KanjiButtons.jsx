import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import '../styling/KanjiButtons.css';

function KanjiButtons({currentKanji, setCurrentKanji, images}) {
    const handleButtonClick = (kanji) => {
        // If the clicked button's image is already showing, hide it
        if (currentKanji === kanji) {
            setCurrentKanji(null);
        } else {
            // Otherwise, show the clicked button's image
            setCurrentKanji(kanji);
        }
    }
    useEffect(()=>{
        if (!currentKanji) {
            console.log("kanji unselected.")
        } else {
            console.log(`${currentKanji} selected.`)
        }
    }, [currentKanji])

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
        </div>);
}

export default KanjiButtons;