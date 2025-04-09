import React from 'react';
import { useGame } from '../context/GameContext';
import { recipes } from '../data/recipeData';
import { ingredients } from '../data/ingredientData';
import { gameTheme } from '../theme/gameTheme';

const IngredientDetails = ({ item, onClose, onCook, isViewingRecipe = false }) => {
  const { gameState, getMealInfo } = useGame();
  const ingredient = ingredients[item];
  const recipe = recipes[item];

  // Calculate ingredients already allocated in queue
  const allocatedIngredients = gameState.mealQueue.reduce((acc, meal) => {
    const recipe = recipes[meal.recipeId];
    Object.entries(recipe.ingredients).forEach(([ingredient, quantity]) => {
      acc[ingredient] = (acc[ingredient] || 0) + quantity;
    });
    return acc;
  }, {});

  const renderContent = () => {
    if (ingredient) {
      return (
        <div style={contentStyles}>
          <h3 style={titleStyles}>{ingredient.name}</h3>
          <p style={descriptionStyles}>{ingredient.description}</p>
          <div style={statsStyles}>
            <div style={statStyles}>
              <span style={statLabelStyles}>Base Value:</span>
              <span style={statValueStyles}>{ingredient.baseValue}</span>
            </div>
            <div style={statStyles}>
              <span style={statLabelStyles}>Spoilage Rate:</span>
              <span style={statValueStyles}>{ingredient.spoilageRate}</span>
            </div>
            <div style={statStyles}>
              <span style={statLabelStyles}>Storage Space:</span>
              <span style={statValueStyles}>{ingredient.storageSpace}</span>
            </div>
          </div>
        </div>
      );
    }

    if (recipe) {
      // Group meals by days until spoiled
      const spoilageGroups = {};
      gameState.cookedMeals
        .filter(meal => meal.id === item)
        .forEach(meal => {
          const mealInfo = getMealInfo(meal.id);
          if (!mealInfo) return;

          const key = mealInfo.isSpoiled ? 'spoiled' : mealInfo.daysUntilSpoiled.toString();
          spoilageGroups[key] = (spoilageGroups[key] || 0) + 1;
        });

      return (
        <div style={contentStyles}>
          <div style={recipeTitleContainerStyles}>
            <h3 style={titleStyles}>{recipe.name}</h3>
            {onCook && isViewingRecipe && (
              <button 
                style={cookButtonStyles} 
                onClick={(e) => {
                  e.preventDefault();
                  onCook();
                }}
              >
                Cook 🔥
              </button>
            )}
          </div>
          <p style={descriptionStyles}>{recipe.description}</p>
          <div style={statsContainerStyles}>
            <div style={statsColumnStyles}>
              <h4 style={sectionTitleStyles}>Stats</h4>
              <div style={statsStyles}>
                <div style={statStyles}>
                  <span style={statLabelStyles}>Hunger Value:</span>
                  <span style={statValueStyles}>{recipe.hungerValue}</span>
                </div>
                <div style={statStyles}>
                  <span style={statLabelStyles}>Morale Bonus:</span>
                  <span style={statValueStyles}>{recipe.moraleBonus}</span>
                </div>
                <div style={statStyles}>
                  <span style={statLabelStyles}>Prep Time:</span>
                  <span style={statValueStyles}>{recipe.preparationTime}</span>
                </div>
                <div style={statStyles}>
                  <span style={statLabelStyles}>Spoils In:</span>
                  <span style={statValueStyles}>{recipe.spoilageTime} days</span>
                </div>
              </div>
            </div>
            <div style={statsColumnStyles}>
              <h4 style={sectionTitleStyles}>Required Ingredients</h4>
              <div style={ingredientsStyles}>
                {Object.entries(recipe.ingredients).map(([ingredient, quantity]) => {
                  const currentAmount = gameState.inventory[ingredient] || 0;
                  const allocated = allocatedIngredients[ingredient] || 0;
                  const available = currentAmount - allocated;
                  const hasEnough = available >= quantity;
                  return (
                    <div key={ingredient} style={ingredientStyles}>
                      <span>{ingredients[ingredient]?.name || ingredient}</span>
                      <span style={{
                        ...ingredientQuantityStyles,
                        color: hasEnough ? gameTheme.colors.background : gameTheme.colors.danger
                      }}>
                        {quantity}/{available}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {Object.keys(spoilageGroups).length > 0 && (
            <div style={spoilageContainerStyles}>
              <h4 style={sectionTitleStyles}>Spoilage Information</h4>
              <div style={spoilageListStyles}>
                {Object.entries(spoilageGroups)
                  .sort(([timeA], [timeB]) => {
                    if (timeA === 'spoiled') return 1;
                    if (timeB === 'spoiled') return -1;
                    return parseInt(timeA) - parseInt(timeB);
                  })
                  .map(([time, count]) => (
                    <div 
                      key={time} 
                      style={{
                        ...spoilageItemStyles,
                        color: time === 'spoiled' 
                          ? gameTheme.colors.danger 
                          : parseInt(time) <= 1 
                            ? gameTheme.colors.warning 
                            : gameTheme.colors.text
                      }}
                    >
                      {count}x {time === 'spoiled' 
                        ? 'spoiled' 
                        : `spoils in ${time} day${time !== '1' ? 's' : ''}`}
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div style={containerStyles}>
      {renderContent()}
      {onClose && (
        <button style={closeButtonStyles} onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};

const containerStyles = {
  position: 'fixed',
  bottom: '0',
  left: '0',
  right: '0',
  padding: '20px',
  paddingBottom: '80px',
  backgroundColor: gameTheme.colors.panel,
  color: gameTheme.colors.text,
  borderTop: `3px solid ${gameTheme.colors.border}`,
  zIndex: 99,
  ...gameTheme.common.panel,
  ...gameTheme.common.pixelated,
};

const contentStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const recipeTitleContainerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  paddingRight: '40px',
};

const titleStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  color: gameTheme.colors.background,
  textTransform: 'uppercase',
};

const descriptionStyles = {
  fontSize: '16px',
  color: gameTheme.colors.text,
  margin: '0',
  fontStyle: 'italic',
};

const statsContainerStyles = {
  display: 'flex',
  gap: '40px',
};

const statsColumnStyles = {
  flex: 1,
};

const sectionTitleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  color: gameTheme.colors.text,
  borderBottom: `2px solid ${gameTheme.colors.border}`,
  paddingBottom: '5px',
};

const statsStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const statStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '4px 0',
};

const statLabelStyles = {
  fontSize: '14px',
  color: gameTheme.colors.textDim,
};

const statValueStyles = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: gameTheme.colors.background,
};

const ingredientsStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const ingredientStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '4px 0',
};

const ingredientQuantityStyles = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: gameTheme.colors.background,
};

const cookButtonStyles = {
  ...gameTheme.common.button,
  backgroundColor: gameTheme.colors.highlightPrimary,
  color: gameTheme.colors.background,
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: 'bold',
  marginLeft: '12px',
};

const closeButtonStyles = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  backgroundColor: 'transparent',
  border: 'none',
  color: gameTheme.colors.text,
  cursor: 'pointer',
  fontSize: '20px',
  padding: '8px',
  zIndex: 2,
  borderRadius: '4px',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
};

const spoilageContainerStyles = {
  marginTop: '20px',
  borderTop: `2px solid ${gameTheme.colors.border}`,
  paddingTop: '20px',
};

const spoilageListStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '12px',
};

const spoilageItemStyles = {
  fontSize: '14px',
  color: gameTheme.colors.warning,
  padding: '4px 8px',
  backgroundColor: `${gameTheme.colors.warning}11`,
  borderRadius: '4px',
};

export default IngredientDetails;