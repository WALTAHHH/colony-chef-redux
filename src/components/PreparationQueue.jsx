import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { recipes } from '../data/recipeData';
import { ACTION_POINTS } from '../data/gameConstants';
import { gameTheme } from '../theme/gameTheme';
import Modal from './Modal';

const PreparationQueue = () => {
  const { gameState, removeFromMealQueue, prepareQueuedMeals, addToMealQueue } = useGame();
  const { mealQueue, actionPoints } = gameState;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const totalQueuedAP = mealQueue.reduce((sum, meal) => 
    sum + (recipes[meal.recipeId].actionPointCost || ACTION_POINTS.DEFAULT_MEAL_COST), 0);

  const remainingAP = actionPoints.total - actionPoints.spent;
  const exceedsAP = totalQueuedAP > remainingAP;

  const containerStyles = {
    ...gameTheme.common.panel,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px',
    height: '100%',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `2px solid ${gameTheme.colors.border}`,
    paddingBottom: '12px',
  };

  const titleStyles = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: gameTheme.colors.text,
  };

  const apCostStyles = {
    fontSize: '14px',
    color: gameTheme.colors.textDim,
  };

  const queueStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
    overflowY: 'auto',
  };

  const mealItemStyles = {
    ...gameTheme.common.panel,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    position: 'relative',
  };

  const mealHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const mealNameStyles = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: gameTheme.colors.text,
  };

  const removeButtonStyles = {
    ...gameTheme.common.button,
    padding: '4px 8px',
    fontSize: '12px',
  };

  const ingredientsStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    fontSize: '14px',
  };

  const ingredientStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: gameTheme.colors.background,
    borderRadius: '4px',
  };

  const errorStyles = {
    color: gameTheme.colors.danger,
    fontSize: '14px',
    marginTop: '8px',
  };

  const prepareButtonStyles = {
    ...gameTheme.common.button,
    marginTop: 'auto',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: gameTheme.colors.highlightPrimary,
    color: gameTheme.colors.background,
  };

  const warningStyles = {
    color: gameTheme.colors.danger,
    fontSize: '14px',
    padding: '8px',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: '4px',
    marginTop: '8px',
    textAlign: 'center',
  };

  const countStyles = {
    color: gameTheme.colors.background,
    fontSize: '14px',
    marginLeft: '8px',
    padding: '2px 6px',
    backgroundColor: gameTheme.colors.highlightSecondary,
    borderRadius: '4px',
  };

  const countControlStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const countButtonStyles = {
    ...gameTheme.common.button,
    padding: '4px 8px',
    fontSize: '14px',
    minWidth: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const countDisplayStyles = {
    fontSize: '14px',
    color: gameTheme.colors.text,
    padding: '4px 8px',
    backgroundColor: gameTheme.colors.background,
    borderRadius: '4px',
    minWidth: '32px',
    textAlign: 'center',
  };

  // Group identical meals together
  const groupedMeals = mealQueue.reduce((acc, meal) => {
    const existingGroup = acc.find(g => g.recipeId === meal.recipeId);
    if (existingGroup) {
      existingGroup.count++;
      // If any instance is missing ingredients, mark the group as missing
      existingGroup.hasIngredients = existingGroup.hasIngredients && meal.hasIngredients;
      existingGroup.missingIngredients = meal.missingIngredients || existingGroup.missingIngredients;
    } else {
      acc.push({
        ...meal,
        count: 1
      });
    }
    return acc;
  }, []);

  // Helper function to find all indices of a recipe in the queue
  const findRecipeIndices = (recipeId) => {
    return mealQueue.reduce((indices, meal, index) => {
      if (meal.recipeId === recipeId) {
        indices.push(index);
      }
      return indices;
    }, []);
  };

  // Helper function to remove one instance of a recipe
  const removeOneMeal = (recipeId) => {
    const indices = findRecipeIndices(recipeId);
    if (indices.length > 0) {
      removeFromMealQueue(indices[indices.length - 1]);
    }
  };

  const handlePrepare = () => {
    if (exceedsAP) {
      setErrorMessage(`Not enough AP! You need ${totalQueuedAP} AP but only have ${remainingAP} remaining.`);
      setShowErrorModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleAddMeal = (recipeId) => {
    const recipe = recipes[recipeId];
    const apCost = recipe.actionPointCost || ACTION_POINTS.DEFAULT_MEAL_COST;
    const newTotalAP = totalQueuedAP + apCost;
    
    if (newTotalAP > remainingAP) {
      setErrorMessage(`Not enough AP! Adding this meal would require ${newTotalAP} AP but you only have ${remainingAP} remaining.`);
      setShowErrorModal(true);
      return;
    }
    
    // Check if we have enough ingredients
    const currentMeal = mealQueue.filter(m => m.recipeId === recipeId).length;
    const totalRequired = Object.entries(recipe.ingredients).reduce((acc, [ingredient, quantity]) => {
      acc[ingredient] = (acc[ingredient] || 0) + quantity * (currentMeal + 1);
      return acc;
    }, {});
    
    const hasEnough = Object.entries(totalRequired).every(([ingredient, quantity]) => {
      return (gameState.inventory[ingredient] || 0) >= quantity;
    });

    if (!hasEnough) {
      setErrorMessage('Not enough ingredients available for this meal!');
      setShowErrorModal(true);
      return;
    }

    addToMealQueue(recipeId);
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h3 style={titleStyles}>Preparation Queue</h3>
        <div style={apCostStyles}>
          Total AP Cost: {totalQueuedAP}/{remainingAP}
        </div>
      </div>

      <div style={queueStyles}>
        {groupedMeals.map((meal, groupIndex) => {
          const recipe = recipes[meal.recipeId];
          return (
            <div 
              key={groupIndex}
              style={{
                ...mealItemStyles,
                opacity: meal.hasIngredients ? 1 : 0.6
              }}
            >
              <div style={mealHeaderStyles}>
                <div style={mealNameStyles}>
                  {recipe.name}
                </div>
                <div style={countControlStyles}>
                  <button 
                    style={countButtonStyles}
                    onClick={() => removeOneMeal(meal.recipeId)}
                  >
                    -
                  </button>
                  <div style={countDisplayStyles}>
                    {meal.count}
                  </div>
                  <button 
                    style={countButtonStyles}
                    onClick={() => handleAddMeal(meal.recipeId)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div style={ingredientsStyles}>
                {Object.entries(recipe.ingredients).map(([ingredient, quantity]) => {
                  const totalRequired = quantity * meal.count;
                  const currentAmount = gameState.inventory[ingredient] || 0;
                  const hasEnough = currentAmount >= totalRequired;
                  return (
                    <div 
                      key={ingredient} 
                      style={{
                        ...ingredientStyles,
                        color: hasEnough ? gameTheme.colors.text : gameTheme.colors.danger
                      }}
                    >
                      <span>{ingredient}</span>
                      <span>x{totalRequired}</span>
                    </div>
                  );
                })}
              </div>

              {!meal.hasIngredients && (
                <div style={errorStyles}>
                  Missing ingredients
                </div>
              )}
            </div>
          );
        })}
      </div>

      {mealQueue.length > 0 && (
        <button 
          style={{
            ...prepareButtonStyles,
            backgroundColor: exceedsAP ? gameTheme.colors.danger : gameTheme.colors.highlightPrimary,
          }}
          onClick={handlePrepare}
        >
          Prepare Food ({totalQueuedAP} AP)
        </button>
      )}

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={prepareQueuedMeals}
        title="Confirm Preparation"
        message="Are you sure you want to prepare these meals?"
        confirmText="Cook"
        cancelText="Cancel"
        type="confirm"
      />

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
        confirmText="OK"
        type="error"
      />
    </div>
  );
};

export default PreparationQueue; 