import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { recipes } from '../data/recipeData';
import { ingredients } from '../data/ingredientData';
import InventoryGrid from './InventoryGrid';
import IngredientDetails from './IngredientDetails';
import PreparationQueue from './PreparationQueue';
import { gameTheme } from '../theme/gameTheme';

// Update the ICONS object to include labels
const TABS = {
  inventory: { icon: '🎒', label: 'Inventory' },
  recipes: { icon: '📜', label: 'Recipes' },
  cooked: { icon: '🍲', label: 'Cooked' },
};

const Kitchen = () => {
  const { gameState, addToMealQueue } = useGame();
  const { inventory, cookedMeals } = gameState;
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory');
  const [warningMessage, setWarningMessage] = useState(null);
  const { 
    gamePhase,
    meals, 
    recipes: gameRecipes, 
    canCraftRecipe, 
    craftRecipe,
    crew,
    setGamePhase,
    removeFromInventory,
  } = gameState;
  
  const handleCook = (recipeId) => {
    const recipe = recipes[recipeId];
    if (!recipe) return;

    // Calculate ingredients already allocated in queue
    const allocatedIngredients = gameState.mealQueue.reduce((acc, meal) => {
      const mealRecipe = recipes[meal.recipeId];
      Object.entries(mealRecipe.ingredients).forEach(([ingredient, quantity]) => {
        acc[ingredient] = (acc[ingredient] || 0) + quantity;
      });
      return acc;
    }, {});

    // Check if we have enough available ingredients
    const hasEnoughIngredients = Object.entries(recipe.ingredients).every(([ingredient, quantity]) => {
      const currentAmount = gameState.inventory[ingredient] || 0;
      const allocated = allocatedIngredients[ingredient] || 0;
      const available = currentAmount - allocated;
      return available >= quantity;
    });

    if (hasEnoughIngredients) {
      addToMealQueue(recipeId);
      setWarningMessage(null);
    } else {
      setWarningMessage("Not enough ingredients available!");
      // Clear warning after 3 seconds
      setTimeout(() => setWarningMessage(null), 3000);
    }
  };

  const containerStyles = {
    display: 'flex',
    gap: '20px',
    height: '100%',
  };

  const mainPanelStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const queuePanelStyles = {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
  };

  const kitchenStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      backgroundColor: gameTheme.colors.panel,
      ...gameTheme.common.panel,
      overflow: 'hidden',
    },
    tabs: {
      display: 'flex',
      gap: '4px',
      padding: '0 20px',
      position: 'relative',
      backgroundColor: gameTheme.colors.background,
      marginBottom: '-2px',
    },
    content: {
      flex: 1,
      padding: '20px',
      backgroundColor: gameTheme.colors.panel,
      borderTop: `2px solid ${gameTheme.colors.border}`,
      overflow: 'auto',
      position: 'relative',
      zIndex: 1,
    },
    cornerDecoration: {
      position: 'absolute',
      width: '20px',
      height: '20px',
      border: `2px solid ${gameTheme.colors.border}`,
      '&.top-left': {
        top: '10px',
        left: '10px',
        borderRight: 'none',
        borderBottom: 'none',
      },
      '&.top-right': {
        top: '10px',
        right: '10px',
        borderLeft: 'none',
        borderBottom: 'none',
      },
      '&.bottom-left': {
        bottom: '10px',
        left: '10px',
        borderRight: 'none',
        borderTop: 'none',
      },
      '&.bottom-right': {
        bottom: '10px',
        right: '10px',
        borderLeft: 'none',
        borderTop: 'none',
      },
    },
  };

  const tabStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: `2px solid ${gameTheme.colors.border}`,
    borderBottom: 'none',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    position: 'relative',
    backgroundColor: gameTheme.colors.panel,
    color: gameTheme.colors.text,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: gameTheme.colors.highlightPrimary,
      color: gameTheme.colors.background,
    },
  };

  const activeTabStyles = {
    ...tabStyles,
    backgroundColor: gameTheme.colors.highlightPrimary,
    color: gameTheme.colors.background,
    borderColor: gameTheme.colors.highlightPrimary,
    zIndex: 2,
  };

  const recipesStyles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '12px',
      padding: '20px'
    },
    recipe: {
      ...gameTheme.common.panel,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
        borderColor: gameTheme.colors.highlightPrimary,
      }
    },
    recipeName: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: gameTheme.colors.text,
      textAlign: 'center',
      padding: '4px 0',
      borderBottom: `1px solid ${gameTheme.colors.border}`,
    },
    recipeStats: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      fontSize: '12px',
      color: gameTheme.colors.textDim,
    },
    recipeStat: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    recipeIcon: {
      fontSize: '16px',
      marginRight: '4px',
    }
  };

  const cookedStyles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '15px',
      padding: '20px'
    },
    meal: {
      ...gameTheme.common.panel,
      position: 'relative',
      '&::after': {
        content: '"✓"',
        position: 'absolute',
        top: '10px',
        right: '10px',
        color: gameTheme.colors.highlightPrimary,
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    mealName: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: gameTheme.colors.text,
      marginBottom: '5px'
    },
    mealDescription: {
      fontSize: '12px',
      color: gameTheme.colors.text,
      opacity: 0.8
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <InventoryGrid
            inventory={inventory}
            ingredients={ingredients}
            onSelect={setSelectedRecipe}
          />
        );
      case 'recipes':
        return renderRecipes();
      case 'cooked':
        return (
          <div style={cookedStyles.container}>
            {cookedMeals.map((mealId) => (
              <div key={mealId} style={cookedStyles.meal}>
                <div style={cookedStyles.mealName}>
                  {recipes[mealId]?.name}
                </div>
                <div style={cookedStyles.mealDescription}>
                  {recipes[mealId]?.description}
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderRecipes = () => (
    <div style={recipesStyles.container}>
      {Object.entries(recipes).map(([id, recipe]) => (
        <div
          key={id}
          style={recipesStyles.recipe}
          onClick={() => setSelectedRecipe(id)}
        >
          <div style={recipesStyles.recipeName}>
            <span style={recipesStyles.recipeIcon}>📖</span>
            {recipe.name}
          </div>
          <div style={recipesStyles.recipeStats}>
            <div style={recipesStyles.recipeStat}>
              <span>🍖</span>{recipe.hungerValue}
            </div>
            <div style={recipesStyles.recipeStat}>
              <span>😊</span>{recipe.moraleBonus}
            </div>
            <div style={recipesStyles.recipeStat}>
              <span>⏱️</span>{recipe.preparationTime}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleDragStart = (e, meal, index) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ meal, index }));
  };
  
  const sectionStyles = {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#ffecb3',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '10px',
    marginTop: '10px'
  };
  
  const itemStyles = {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };
  
  const buttonStyles = {
    backgroundColor: '#8d6e63',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '5px 0',
    transition: 'background-color 0.2s'
  };
  
  const disabledButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  };
  
  return (
    <div style={containerStyles}>
      <div style={mainPanelStyles}>
        <div style={kitchenStyles.container}>
          <div style={kitchenStyles.cornerDecoration} className="top-left" />
          <div style={kitchenStyles.cornerDecoration} className="top-right" />
          <div style={kitchenStyles.cornerDecoration} className="bottom-left" />
          <div style={kitchenStyles.cornerDecoration} className="bottom-right" />
          
          <div style={kitchenStyles.tabs}>
            {Object.entries(TABS).map(([key, { icon, label }]) => (
              <button
                key={key}
                style={activeTab === key ? activeTabStyles : tabStyles}
                onClick={() => setActiveTab(key)}
              >
                <span style={{ fontSize: '20px' }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
          <div style={kitchenStyles.content}>
            {renderTabContent()}
          </div>
        </div>
        {selectedRecipe && (
          <div style={kitchenStyles.details}>
            {warningMessage && (
              <div style={{
                backgroundColor: gameTheme.colors.danger,
                color: gameTheme.colors.background,
                padding: '8px 16px',
                marginBottom: '12px',
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {warningMessage}
              </div>
            )}
            <IngredientDetails
              item={selectedRecipe}
              onClose={() => {
                setSelectedRecipe(null);
                setWarningMessage(null);
              }}
              onCook={() => handleCook(selectedRecipe)}
            />
          </div>
        )}
      </div>
      <div style={queuePanelStyles}>
        <PreparationQueue />
      </div>
    </div>
  );
};

export default Kitchen;