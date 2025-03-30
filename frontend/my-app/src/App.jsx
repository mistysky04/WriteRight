import React from 'react'
import './App.css'
import Logo from './components/Logo.jsx';
import KanjiButtons from './components/KanjiButtons.jsx';
import HandDrawing from './MediaPipe/HandDrawing.jsx';
import Instructions from './components/Instructions.jsx';
import LittleGuys from './components/LittleGuys.jsx';
import Score from './components/Score.jsx';

function App() {
  return (
    <div className="App">
      <div className="paper-background"></div>
      <div className="header">
        <Logo />
      </div>
      <div className="three-column-layout">
        <div className="column left-spacer">
          <Score />
        </div>
        <div className="column center-content">
          <HandDrawing />
          <KanjiButtons />
        </div>
        <div className="column right-content">
          <Instructions />
          <div className="little-guys-container">
            <LittleGuys />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;