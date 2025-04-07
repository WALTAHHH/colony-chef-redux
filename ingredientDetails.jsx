import React from 'react';
import { useGameState } from 'GameContext';
const IngredientDetails = ({ item, quantity, compact = false, showCookButton = false, onCook }) => {
  const { recipes, canCraftRecipe, getItemEmoji, gamePhase } = useGameState();
  
  const itemStyles = {
    padding: compact ? '5px' : '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: compact ? '0.8em' : '1em',
    position: 'relative',
    overflow: 'hidden'
  };
  const depletedOverlayStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ff0000',
    fontWeight: 'bold',
    fontSize: '1.2em'
  };
  
  const buttonStyles = {
    backgroundColor: '#8d6e63',
    color: 'white',
    border: 'none',
    padding: compact ? '3px 6px' : '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '5px 0',
    fontSize: compact ? '0.8em' : '1em',
    transition: 'background-color 0.2s'
  };
  
  const disabledButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  };
  
  const isRecipe = recipes && recipes[item];
  
  return (
    <div style={itemStyles}>
      <div style={{ fontSize: '1.5em' }}>{getItemEmoji(item)}</div>
      <div>{item}</div>
      
      {isRecipe ? (
        <>
          <div style={{ fontSize: compact ? '0.7em' : '0.9em', color: '#666', margin: '2px 0' }}>
            Hunger: +{recipes[item].hungerValue}
          </div>
          {showCookButton && gamePhase === 2 && (
            <button 
              style={canCraftRecipe(item) ? buttonStyles : disabledButtonStyles}
              onClick={() => onCook(item)}
              disabled={!canCraftRecipe(item)}
            >
              Cook
            </button>
          )}
        </>
      ) : (
        <>
          <div><strong>x{quantity || 0}</strong></div>
          {quantity <= 0 && (
            <div style={depletedOverlayStyles}>
              Depleted
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default IngredientDetails;