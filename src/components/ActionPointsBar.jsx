import React from 'react';
import { useGame } from '../context/GameContext';
import { ACTION_POINTS, GAME_PHASES } from '../data/gameConstants';
import { recipes } from '../data/recipeData';
import { gameTheme } from '../theme/gameTheme';

const ActionPointsBar = () => {
  const { gameState } = useGame();
  const { actionPoints, phase, mealQueue } = gameState;
  const { total, spent } = actionPoints;

  const queuedAP = mealQueue.reduce((sum, meal) => 
    sum + (recipes[meal.recipeId].actionPointCost || ACTION_POINTS.DEFAULT_MEAL_COST), 0);

  const containerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: gameTheme.colors.panel,
    borderRadius: '4px',
    border: `2px solid ${gameTheme.colors.border}`,
  };

  const labelStyles = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: gameTheme.colors.text,
    whiteSpace: 'nowrap',
  };

  const barContainerStyles = {
    display: 'flex',
    gap: '2px',
    width: '200px',
  };

  const segmentStyles = {
    flex: 1,
    height: '12px',
    backgroundColor: gameTheme.colors.background,
    border: `1px solid ${gameTheme.colors.border}`,
    transition: 'all 0.3s ease',
  };

  const getSegmentColor = (index) => {
    if (phase === GAME_PHASES.END_OF_DAY) {
      return gameTheme.colors.textDim;
    }
    if (index < spent) {
      return '#FF4444'; // Bright red for spent AP
    }
    if (index < spent + queuedAP) {
      return '#FFD700'; // Gold for queued AP
    }
    if (index < total) {
      return '#44FF44'; // Bright green for available AP
    }
    return 'transparent';
  };

  return (
    <div style={containerStyles}>
      <span style={labelStyles}>AP: {total - spent - queuedAP}/{total}</span>
      <div style={barContainerStyles}>
        {Array.from({ length: ACTION_POINTS.MAX_AP }).map((_, index) => (
          <div
            key={index}
            style={{
              ...segmentStyles,
              backgroundColor: getSegmentColor(index),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ActionPointsBar; 