import React, { useMemo } from 'react';
import { useGameState } from '../contexts/GameContext';
import IngredientDetails from './ingredientDetails';

const InventoryGrid = ({ compact = false }) => {
  const { inventory } = useGameState();
  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: compact
      ? 'repeat(auto-fill, minmax(80px, 1fr))'
      : 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: compact ? '5px' : '10px',
    marginTop: '10px'
  };
  const memoizedInventoryItems = useMemo(() => {
    return Object.entries(inventory).map(([item, quantity]) => (
      <IngredientDetails 
        key={item} 
        item={item} 
        quantity={quantity} 
        compact={compact} 
      />
    ));
  }, [inventory, compact]);
  return (
    <div style={gridStyles}>
      {memoizedInventoryItems}
    </div>
  );
};
export default React.memo(InventoryGrid);