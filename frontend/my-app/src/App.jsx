import React from 'react'
import './App.css'
import CrumpledPaper from './components/CrumpledPaper.jsx';
import Logo from './components/Logo.jsx';
import KanjiButtons from './components/KanjiButtons.jsx';
import HandDrawing from './MediaPipe/HandDrawing.jsx';

function App() {

  return (
    <>
      <div className="App">
        <CrumpledPaper />
        <Logo />
        <div className="Middle-Components">
          <HandDrawing />
          <KanjiButtons />
        </div>
      </div>
    </>
  )
}

export default App;
