import React from 'react'
import './App.css'
import Logo from './components/Logo.jsx';
import KanjiButtons from './components/KanjiButtons.jsx';
import HandDrawing from './MediaPipe/HandDrawing.jsx';
import Instructions from './components/Instructions.jsx';
import LittleGuys from './components/LittleGuys.jsx';

function App() {
  return (
    <div className="App">
      {/* Background with paper texture */}
      <div className="paper-background"></div>

      {/* Logo at the top */}
      <div className="header">
        <Logo />
      </div>

      {/* Main content area with three columns */}
      <div className="three-column-layout">
        {/* Empty left column for balance */}
        <div className="column left-spacer"></div>

        {/* Center column with drawing + buttons */}
        <div className="column center-content">
          <HandDrawing />
          <KanjiButtons />
        </div>

        {/* Right column with instructions */}
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