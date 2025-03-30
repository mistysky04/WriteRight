import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function KanjiButtons() {
    return (
        <ButtonGroup aria-label="Basic example">
            <Button variant="secondary" style={{ backgroundColor: "#ecaab5", fontSize: "1.5em" }}>一</Button>
            <Button variant="secondary" style={{ backgroundColor: "#ecaab5", fontSize: "1.5em" }}>二</Button>
            <Button variant="secondary" style={{ backgroundColor: "#ecaab5", fontSize: "1.5em" }}>三</Button>
            <Button variant="secondary" style={{ backgroundColor: "#ecaab5", fontSize: "1.5em" }}>四</Button>
            <Button variant="secondary" style={{ backgroundColor: "#ecaab5", fontSize: "1.5em" }}>五</Button>
        </ButtonGroup>
    );
}

export default KanjiButtons;