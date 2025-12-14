import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [gitd , setgitd] = useState(null)

  useEffect(() => {
    axios.get('/api/github')
    .then((response) => {
      setgitd(response.data)
    }).catch((error) => {
      console.log(error)
    })
  },[])
  return (
    <>
      <h1>Coding with fun </h1>
      <p> Data:{gitd?.name}</p>
    </>
  )
}

export default App
