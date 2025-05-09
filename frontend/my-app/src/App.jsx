import React, {useState} from 'react'
import './App.css'
import Logo from './components/Logo.jsx';
import KanjiButtons from './components/KanjiButtons.jsx';
import HandDrawing from './MediaPipe/HandDrawing.jsx';
import Instructions from './components/Instructions.jsx';
import LittleGuys from './components/LittleGuys.jsx';
import overlayIchi from "./assets/overlay_1ichi.png";
import overlayNi from "./assets/overlay_2ni.png";
import overlaySan from "./assets/overlay_3san.png";
import overlayYon from "./assets/overlay_4yon.png";
import overlayGo from "./assets/overlay_5go.png";
import Score from './components/Score.jsx';

function App() {
  // State to track which image is currently displayed (null means no image)
  const [currentKanji, setCurrentKanji] = useState(null);
  const [score, setScore] = React.useState(null); // Initialize score state

  // Image data mapping buttons to their respective images
  const images = {
    一: overlayIchi,
    二: overlayNi,
    三: overlaySan,
    四: overlayYon,
    五: overlayGo
  };
  return (
    <div className="App">
      <div className="paper-background"></div>
      <div className="header">
        <Logo />
      </div>
      <div className="three-column-layout">
        <div className="column left-spacer">
          <Score score={score}/>
        </div>
        <div className="column center-content">
          <HandDrawing 
          currentKanji={currentKanji} 
          images={images}
          setScore = {setScore}
          />
          <KanjiButtons
            currentKanji={currentKanji}
            setCurrentKanji={setCurrentKanji}
            images={images}
          />
        </div>
        <div className="column right-content">
          <Instructions />
          <div className="little-guys-container">
            <LittleGuys />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;