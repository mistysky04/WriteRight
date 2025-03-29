import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HandDrawing from "./MediaPipe/HandDrawing.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
          <HandDrawing />
    </>
  )
}

export default App
