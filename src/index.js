import React from 'react';
import { createRoot } from 'react-dom/client';
import Game from './components/Game';
import { GameProvider } from './context/GameContext';

// Add global styles to ensure no elements extend beyond the viewport
const style = document.createElement('style');
style.textContent = `
  html, body, #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    position: relative;
  }
  
  #root {
    display: flex;
    flex-direction: column;
  }

  /* Main content should flex-grow but leave space for footer */
  .game-container {
    flex: 1 0 auto;
    min-height: 0;
    overflow: auto;
  }

  /* Footer should maintain its height */
  .phase-footer {
    flex-shrink: 0;
    height: 50px;
    width: 100%;
  }
`;
document.head.appendChild(style);

const root = createRoot(document.getElementById('root'));
root.render(
  <GameProvider>
    <Game />
  </GameProvider>
); 