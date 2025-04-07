import React from 'react';
import { useGameState } from 'GameContext';

const MenuButton = () => {
  const { setSidebarOpen } = useGameState();
  
  const menuButtonStyles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 98,
    backgroundColor: '#8d6e63',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    transition: 'transform 0.2s, background-color 0.2s'
  };
  
  return (
    <button
      style={menuButtonStyles}
      onClick={() => setSidebarOpen(true)}
      aria-label="Open Menu"
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#a1887f';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#8d6e63';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      ☰
    </button>
  );
};

export default MenuButton;