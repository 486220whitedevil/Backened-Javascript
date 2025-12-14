import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [gitd, setgitData] = useState()

  return (
    <>
  <h1>Coding with fun </h1>
  <p> Data: {gitd.name}</p>
    </>
  )
}

export default App
