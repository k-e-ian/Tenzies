import React, { useState, useEffect } from 'react';
import Die from './components/Die';
import './App.css';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [highScore, setHighScore] = useState(getHighScoreFromLocalStorage());


  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    
    const allSameValue = dice.every((die) => die.value === firstValue);

    if (allHeld && allSameValue && !tenzies) {
      setTenzies(true);
      setIsRunning(false);

      let currentScore = {
        rolls: rollCount,
        time: {
          minutes: elapsedMinutes,
          seconds: elapsedSeconds
        },
        value: firstValue 
      }
      let savedHighScore = getHighScoreFromLocalStorage()
      
      if (!savedHighScore || isBetterScore(currentScore, savedHighScore)) {
        setHighScore(currentScore)
        saveHighScoreToLocalStorage(currentScore)
      } 
    }
  }, [dice, tenzies, rollCount, elapsedTime]);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  function generateNewDie() {
    return {
      value: Math.trunc((Math.random() * 6) + 1),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function holdDice(id) {
    if (!isRunning) {
      setIsRunning(true);
    }
    setDice((oldDice) =>
      oldDice.map((die) => {
        return id === die.id
          ? {
              ...die,
              isHeld: !die.isHeld,
            }
          : die;
      })
    );
  }

  function rollDice() {
    if (tenzies) {
      setIsRunning(false);
      setElapsedTime(0);
      setRollCount(0);
      setTenzies(false);
      setDice(allNewDice());
    } else {
      if (!isRunning) {
        setIsRunning(true)
      }
      setRollCount((prevCount) => prevCount + 1);
      setDice((oldDice) =>
        oldDice.map((die) =>
          die.isHeld === true
            ? die
            : generateNewDie()
        )
      );
    }
  }

  let diceElements = dice.map((die) => (
    <Die
      holdDice={() => holdDice(die.id)}
      isHeld={die.isHeld}
      key={die.id}
      value={die.value}
    />
  ))

  const elapsedMinutes = Math.floor(elapsedTime / 60000);
  const elapsedSeconds = Math.floor((elapsedTime % 60000) / 1000);

  function getHighScoreFromLocalStorage() {
    const highScoreString = localStorage.getItem('highScore');
    return highScoreString ? JSON.parse(highScoreString) : null;
  }
  
  function saveHighScoreToLocalStorage(highScore) {
    localStorage.setItem('highScore', JSON.stringify(highScore));
  }
  
  function isBetterScore(currentScore, savedScore) {
    // Compare based on rolls or time
    if (currentScore.rolls < savedScore.rolls) {
      return true;
    } else if (currentScore.rolls === savedScore.rolls) {
      if (currentScore.time.minutes < savedScore.time.minutes) {
        return true;
      } else if (currentScore.time.minutes === savedScore.time.minutes) {
        return currentScore.time.seconds < savedScore.time.seconds;
      }
    }
    return false;
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
      <br/>
      <small className="instructions-italic">Game Starts at dice-roll or die-freeze instance.</small>
      </p>
      <small style={{fontFamily: 'Inter'}}>
        High Score: rolls[{highScore?.rolls}], time[{highScore?.time?.minutes}m {highScore?.time?.seconds}s], value[{highScore?.value}]
      </small>
      <div className="dice-container">{diceElements}</div>
      <button className="dice-roll" onClick={rollDice}>
        {tenzies ? 'New Game' : 'Roll'}
      </button>
      <div className="time-display">
        {isRunning && !tenzies ? (
          <small>
            Time: {elapsedMinutes}m {elapsedSeconds}s
          </small>
        ) : null}
      </div>
      <br/>
      <small style={{fontFamily: 'Inter'}}>
        {tenzies
          ? `You won in ${rollCount} rolls. Time taken: ${elapsedMinutes}m ${elapsedSeconds}s`
          : `Your Roll Count is ${rollCount}`}
      </small>
    </main>
  );
}

export default App;
