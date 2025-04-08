import React from 'react';
import { ingredients } from '../data/ingredientData';
import { recipes } from '../data/recipeData';
import { gameTheme } from '../theme/gameTheme';

const IngredientDetails = ({ item, onClose, onCook }) => {
  const ingredient = ingredients[item];
  const recipe = recipes[item];

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
      return (
        <div style={contentStyles}>
          <div style={recipeTitleContainerStyles}>
            <h3 style={titleStyles}>{recipe.name}</h3>
            {onCook && (
              <button style={cookButtonStyles} onClick={onCook}>
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
              </div>
            </div>
            <div style={statsColumnStyles}>
              <h4 style={sectionTitleStyles}>Required Ingredients</h4>
              <div style={ingredientsStyles}>
                {Object.entries(recipe.ingredients).map(([ingredient, quantity]) => (
                  <div key={ingredient} style={ingredientStyles}>
                    <span style={ingredientNameStyles}>
                      {ingredients[ingredient]?.name}
                    </span>
                    <span style={ingredientQuantityStyles}>x{quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
};

const titleStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  color: gameTheme.colors.highlightPrimary,
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
  color: gameTheme.colors.text,
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

const ingredientNameStyles = {
  fontSize: '14px',
  color: gameTheme.colors.text,
};

const ingredientQuantityStyles = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: gameTheme.colors.highlightSecondary,
};

const cookButtonStyles = {
  ...gameTheme.common.button,
  backgroundColor: gameTheme.colors.highlightPrimary,
  color: gameTheme.colors.background,
  padding: '8px 16px',
  fontSize: '16px',
};

const closeButtonStyles = {
  ...gameTheme.common.button,
  position: 'absolute',
  top: '20px',
  right: '20px',
  padding: '8px 12px',
  minWidth: '32px',
  backgroundColor: 'transparent',
  color: gameTheme.colors.textDim,
  border: `2px solid ${gameTheme.colors.border}`,
  ':hover': {
    backgroundColor: gameTheme.colors.border,
    color: gameTheme.colors.text,
  }
};

export default IngredientDetails;