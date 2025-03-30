import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import '../styling/KanjiButtons.css';
// import overlayIchi from '../assets/overlay_1ichi.png';
// import overlayNi from '../assets/overlay_2ni.png';
// import overlaySan from '../assets/overlay_3san.png';
// import overlayYon from '../assets/overlay_4yon.png';
// import overlayGo from '../assets/overlay_5go.png';


function KanjiButtons() {
    const kanjiChars = ['一', '二', '三', '四', '五'];

    return (
        <ButtonGroup aria-label="Kanji number buttons">
            {kanjiChars.map((kanji, index) => (
                <Button
                    key={index}
                    variant="secondary"
                    className="kanji-button"
                >
                    {kanji}
                </Button>
            ))}
        </ButtonGroup>
    );
}

export default KanjiButtons;