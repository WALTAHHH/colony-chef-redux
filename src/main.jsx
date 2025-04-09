import React from 'react';
import { createRoot } from 'react-dom/client';
import { GameProvider } from './context/GameContext';
import App from './App';
import './styles/global.css';

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
    background-color: #392b1e;
    color: #f9f3e5;
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

// Create renderDiv if it doesn't exist
let renderDiv = document.getElementById('renderDiv');
if (!renderDiv) {
  renderDiv = document.createElement('div');
  renderDiv.id = 'renderDiv';
  document.body.appendChild(renderDiv);
}

const root = createRoot(renderDiv);
root.render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
); 