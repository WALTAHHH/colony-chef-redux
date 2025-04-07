import React from 'react';
import { createRoot } from 'react-dom/client';
import Game from 'Game';
import { GameProvider } from 'GameContext';
// Add global styles to ensure no elements extend beyond the viewport
const style = document.createElement('style');
style.textContent = `
  html, body, #renderDiv {
    height: calc(100% - 25px); /* Leave 25px space at the bottom */
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
  }
  
  /* Remove any potential fixed elements at the bottom */
  body::after, 
  #renderDiv::after,
  .safari-bottom-fix {
    display: none !important;
    content: none !important;
    height: 0 !important;
  }
`;
document.head.appendChild(style);
const root = createRoot(document.getElementById('renderDiv'));
root.render(
  <GameProvider>
    <Game />
  </GameProvider>
);