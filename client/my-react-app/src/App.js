import './App.css';

import React, { useState, useEffect } from 'react';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [players, setPlayers] = useState({
    p1: { name: "Praveen", health: 100 },
    p2: { name: "Sammy", health: 100 }
  });

  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    socket.on('updateGameState', (updatedPlayers) => {
      setPlayers(updatedPlayers);
      checkGameOver(updatedPlayers);
    });
  }, [socket]);

  const checkGameOver = (updatedPlayers) => {
    if (updatedPlayers.p1.health <= 0 || updatedPlayers.p2.health <= 0) {
      setGameOver(true);
      const winner = updatedPlayers.p1.health <= 0 ? updatedPlayers.p2.name : updatedPlayers.p1.name;
      setResult(`${winner} wins!`);
    }
  };

  const handleP1Attack = () => {
    socket.emit('p1Attack');
  };

  const handleP1Heal = () => {
    socket.emit('p1Heal');
  };

  const handleP2Attack = () => {
    socket.emit('p2Attack');
  };

  const handleP2Heal = () => {
    socket.emit('p2Heal');
  };

  return (
    <div className='App'>
      <div className='menu'>
        <div className='p1Info'>
          <div id="p1Name">{players.p1.name}</div>
            <img id="p1" src="https://i.gifer.com/origin/00/0019f6845ceaa9347b881ccbe8f5644a_w200.gif" alt=""/>
            <div className="playerControls">
              <div className="AttackDiv">
                <h3>Q:</h3>
                <button onClick={handleP1Attack} id="attack">
                  Attack
                </button>
              </div>
              <div className="HealDiv">
                <h3>A:</h3>
                <button onClick={handleP1Heal} id="heal">
                  Heal
                </button>
              </div>
            </div>
          <div id="p1Health">{players.p1.health}</div>
        </div>

        <div className="p2Info">
          <div id="p2Name">{players.p2.name}</div>
          <img id="p2" src="https://media.tenor.com/XXUUGJw5hrYAAAAj/rabbit-bunny.gif" alt=""/>
          <div className="playerControls">
            <div className="AttackDiv">
              <h3>P:</h3>
              <button onClick={handleP2Attack} id="attack">
                Attack
              </button>
            </div>
            <div className="HealDiv">
              <h3>L:</h3>
              <button onClick={handleP2Heal} id="heal">
                Heal
              </button>
            </div>
          </div>
          <div id="p2Health">{players.p2.health}</div>
        </div>
      </div>
      
      <div className='resultContainer'>
        <div id="result">{gameOver ? "Game Over!" : ""}</div>
        <div id="winner">{gameOver ? result : ""}</div>
      </div>

      <audio id="p1attack" controls style={{display : 'none'}}>
        <source src="sounds/fastpunch.mp3" type="audio/mpeg"/>
      </audio>
      <audio id="p1heal" controls style={{display: 'none'}}>
          <source src="sounds/fastheal.mp3" type="audio/mpeg"/>
      </audio>
      <audio id="p2attack" controls style={{display:'none'}}>
          <source src="sounds/quickhit.mp3" type="audio/mpeg" />
      </audio>
      <audio id="p2heal" controls style={{display:'none'}}>
          <source src="sounds/quickheal.mp3" type="audio/mpeg" />
      </audio>
      <audio id="victory" controls style={{display:'none'}}>
          <source src="sounds/victory.mp3" type="audio/mpeg"/>
      </audio>

    </div>
  );
}

export default App;