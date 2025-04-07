import React from 'react';
import { useGameState } from '../contexts/GameContext';

const ExpeditionMap = () => {
  const { 
    gamePhase,
    day
  } = useGameState();

  return (
    <div>
      <h2>Expedition Map</h2>
      <p>Day {day}</p>
      <p>Phase {gamePhase}</p>
    </div>
  );
};

export default ExpeditionMap;