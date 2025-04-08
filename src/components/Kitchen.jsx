import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { recipes } from '../data/recipeData';
import { ingredients } from '../data/ingredientData';
import InventoryGrid from './InventoryGrid';
import IngredientDetails from './IngredientDetails';
import MealAssignmentTable from './MealAssignmentTable';
import { gameTheme } from '../theme/gameTheme';

// Pixel art icons for tabs (16x16 unicode characters that look pixelated)
const ICONS = {
  inventory: '🎒',
  recipes: '📜',
  cooked: '🍲',
};

const Kitchen = () => {
  const { gameState, cookMeal } = useGame();
  const { inventory, cookedMeals } = gameState;
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory');
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
    if (cookMeal(recipeId)) {
      setSelectedRecipe(null);
    }
  };

  const kitchenStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      height: '100%',
      ...gameTheme.common.panel,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '8px',
        left: '8px',
        right: '8px',
        bottom: '8px',
        border: `2px dashed ${gameTheme.colors.border}`,
        opacity: 0.5,
        pointerEvents: 'none'
      }
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      borderBottom: `2px solid ${gameTheme.colors.border}`,
      paddingBottom: '10px',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-2px',
        left: '0',
        right: '0',
        height: '2px',
        background: `repeating-linear-gradient(
          to right,
          ${gameTheme.colors.border} 0,
          ${gameTheme.colors.border} 4px,
          transparent 4px,
          transparent 8px
        )`,
      }
    },
    content: {
      flex: 1,
      minHeight: '300px',
      overflowY: 'auto',
      position: 'relative',
      padding: '4px',
      '&::-webkit-scrollbar': {
        width: '12px',
      },
      '&::-webkit-scrollbar-track': {
        background: gameTheme.colors.background,
        border: `2px solid ${gameTheme.colors.border}`,
      },
      '&::-webkit-scrollbar-thumb': {
        background: gameTheme.colors.border,
        border: `2px solid ${gameTheme.colors.background}`,
        '&:hover': {
          background: gameTheme.colors.highlightPrimary,
        }
      }
    },
    details: {
      marginTop: '20px',
      ...gameTheme.common.panel,
    },
    cornerDecoration: {
      position: 'absolute',
      width: '16px',
      height: '16px',
      pointerEvents: 'none',
      '&.top-left': {
        top: '4px',
        left: '4px',
        borderTop: `2px solid ${gameTheme.colors.border}`,
        borderLeft: `2px solid ${gameTheme.colors.border}`,
      },
      '&.top-right': {
        top: '4px',
        right: '4px',
        borderTop: `2px solid ${gameTheme.colors.border}`,
        borderRight: `2px solid ${gameTheme.colors.border}`,
      },
      '&.bottom-left': {
        bottom: '4px',
        left: '4px',
        borderBottom: `2px solid ${gameTheme.colors.border}`,
        borderLeft: `2px solid ${gameTheme.colors.border}`,
      },
      '&.bottom-right': {
        bottom: '4px',
        right: '4px',
        borderBottom: `2px solid ${gameTheme.colors.border}`,
        borderRight: `2px solid ${gameTheme.colors.border}`,
      }
    }
  };

  const tabStyles = (isActive) => ({
    ...gameTheme.common.button,
    backgroundColor: isActive ? gameTheme.colors.highlightPrimary : gameTheme.colors.panel,
    color: isActive ? gameTheme.colors.background : gameTheme.colors.text,
    padding: '8px 16px',
    fontSize: '12px',
    border: `2px solid ${isActive ? gameTheme.colors.highlightPrimary : gameTheme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    '&::before': isActive ? {
      content: '""',
      position: 'absolute',
      bottom: '-12px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '0',
      height: '0',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: `6px solid ${gameTheme.colors.highlightPrimary}`,
    } : {},
  });

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
    <div style={kitchenStyles.container}>
      <div style={kitchenStyles.cornerDecoration} className="top-left" />
      <div style={kitchenStyles.cornerDecoration} className="top-right" />
      <div style={kitchenStyles.cornerDecoration} className="bottom-left" />
      <div style={kitchenStyles.cornerDecoration} className="bottom-right" />
      
      <div style={kitchenStyles.tabs}>
        <button 
          style={tabStyles(activeTab === 'inventory')}
          onClick={() => setActiveTab('inventory')}
        >
          {ICONS.inventory} Inventory
        </button>
        <button 
          style={tabStyles(activeTab === 'recipes')}
          onClick={() => setActiveTab('recipes')}
        >
          {ICONS.recipes} Recipes
        </button>
        <button
          style={tabStyles(activeTab === 'cooked')}
          onClick={() => setActiveTab('cooked')}
        >
          {ICONS.cooked} Cooked Meals
        </button>
      </div>
      <div style={kitchenStyles.content}>
        {renderTabContent()}
      </div>
      {selectedRecipe && (
        <IngredientDetails
          item={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onCook={() => handleCook(selectedRecipe)}
        />
      )}
    </div>
  );
};

export default Kitchen;