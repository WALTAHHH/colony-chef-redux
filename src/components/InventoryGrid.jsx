import React from 'react';
import { ingredients, ingredientEmojiMap } from '../data/ingredientData';
import IngredientDetails from './IngredientDetails';
import { gameTheme } from '../theme/gameTheme';

const InventoryGrid = ({ inventory, ingredients, onSelect }) => {
  const renderInventoryItems = () => {
    return Object.entries(inventory).map(([itemId, quantity]) => {
      const ingredient = ingredients[itemId];
      if (!ingredient) return null;

      return (
        <div
          key={itemId}
          style={itemStyles}
          onClick={() => onSelect(itemId)}
        >
          <div style={itemIconStyles}>
            {ingredientEmojiMap[itemId] || '📦'}
          </div>
          <div style={itemNameStyles}>{ingredient.name}</div>
          <div style={itemQuantityStyles}>x{quantity}</div>
          <div style={itemDescriptionStyles}>
            {ingredient.description}
          </div>
        </div>
      );
    });
  };

  return (
    <div style={containerStyles}>
      <h3 style={titleStyles}>Inventory</h3>
      <div style={gridStyles}>
        {renderInventoryItems()}
      </div>
    </div>
  );
};

const containerStyles = {
  padding: '20px',
  ...gameTheme.common.panel,
};

const titleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
  color: gameTheme.colors.text,
  borderBottom: `2px solid ${gameTheme.colors.border}`,
  paddingBottom: '10px'
};

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '15px'
};

const itemStyles = {
  ...gameTheme.common.panel,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '15px',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 12px rgba(0,0,0,0.2), inset 0 0 0 2px ${gameTheme.colors.highlightPrimary}`
  },
  '&:active': {
    transform: 'translateY(0)',
  }
};

const itemIconStyles = {
  fontSize: '24px',
  marginBottom: '10px',
  filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))'
};

const itemNameStyles = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: gameTheme.colors.text,
  marginBottom: '5px'
};

const itemQuantityStyles = {
  fontSize: '12px',
  color: gameTheme.colors.highlightPrimary,
  fontWeight: 'bold',
  marginBottom: '5px',
  backgroundColor: gameTheme.colors.background,
  padding: '2px 8px',
  borderRadius: '4px',
  display: 'inline-block'
};

const itemDescriptionStyles = {
  fontSize: '12px',
  color: gameTheme.colors.text,
  opacity: 0.8,
  lineHeight: 1.3
};

export default InventoryGrid;