import { useState, useEffect } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import Die from "./components/Die"
import './App.css'
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

function App() {
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
        setTenzies(true)
        console.log("You Won")
    }
  }, [dice])

  function generateNewDie() {
    return {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
        newDice.push(generateNewDie())
    }
    return newDice
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return (id === die.id) ? 
        {
          ...die,
          isHeld: !die.isHeld
        } :
        die
    }))
  }

  function rollDice() {
    if (tenzies) {
      setRollCount(0)
      setTenzies(false)
      setDice(allNewDice())      //setDice(generateNewDie())
    } else {
      setRollCount((prevCount) => prevCount + 1)
      setDice(oldDice => oldDice.map(die => {
        return (die.isHeld === true) ?
          die :
          generateNewDie()
      }))
    }
    
  }


  function allNewDice() {
    const newDice = [];

    while (newDice.length < 10) {
    // Generate random numbers between 1 and 6
      newDice.push(generateNewDie())
    }
    return newDice;
  }

  

  let diceElements = dice.map(die => <Die holdDice={() => holdDice(die.id)} isHeld={die.isHeld} key={die.id} value={die.value} />)


  return (
    <>
      <main>
        {tenzies && <Confetti />}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
          {diceElements}      
        </div>
        <button 
          className='dice-roll'
          onClick={rollDice}
        >
          {tenzies ? "New Game" : "Roll"}
        </button>
        <small>
        {tenzies ? `You won with ${rollCount} rolls` : `Your Roll Count is ${rollCount}`}
        </small>
      </main>
    </>
  )
}

export default App
