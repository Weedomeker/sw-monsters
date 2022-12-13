import { useState } from 'react'

function App() {
  // States
  let [number, setNumber] = useState(0)

  // Comportements
  const handleClickIncremente = () => {
    setNumber(number + 1)
  }
  const handleClickDecremente = () => {
    number <= 0 ? setNumber(0) : setNumber(number - 1)
  }

  // Affichage rendu
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>My number: {number}</h2>

      <button type="button" onClick={handleClickIncremente}>
        +1
      </button>
      <button type="button" onClick={handleClickDecremente}>
        -1
      </button>
      {/* { number ? number < 1 : setNumber(number === 0) } */}
    </div>
  )
}

export default App
