import React from 'react';
import { GameProvider } from './contexts/GameContext';
import Game from './components/Game';

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

export default App; 