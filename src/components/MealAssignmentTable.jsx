import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { recipes } from '../data/recipeData';
import { crewRoles } from '../data/crewData';
import { MEAL_PREFERENCES } from '../data/gameConstants';
import { gameTheme } from '../theme/gameTheme';

const MealAssignmentTable = () => {
  const { gameState, assignMeal, getMealInfo } = useGame();
  const { crew, cookedMeals, assignedMeals } = gameState;
  const [draggedMeal, setDraggedMeal] = useState(null);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMealAssignment = (crewId, mealId, slotIndex, isSnack = false) => {
    assignMeal(crewId, mealId, slotIndex, isSnack);
  };

  const getMealPreference = (crewMember, mealId) => {
    const role = crewRoles[crewMember.role];
    if (!role) return 'neutral';

    if (role.favoriteMeals.includes(mealId)) {
      return 'favorite';
    }
    if (role.dislikedMeals.includes(mealId)) {
      return 'disliked';
    }
    return 'neutral';
  };

  const handleDragStart = (e, meal) => {
    setDraggedMeal(meal);
    e.dataTransfer.setData('text/plain', JSON.stringify(meal));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, crewId, slotIndex, isSnack) => {
    e.preventDefault();
    if (!draggedMeal) return;
    
    handleMealAssignment(crewId, draggedMeal.id, slotIndex, isSnack);
    setDraggedMeal(null);
  };

  const handleMouseMove = (e) => {
    setTooltipPosition({
      x: e.clientX + 10,
      y: e.clientY + 10
    });
  };

  const renderMealTooltip = (recipe, mealId, crewMember = null) => {
    if (!recipe) return null;

    const mealInfo = mealId ? getMealInfo(mealId) : null;
    const preference = crewMember ? getMealPreference(crewMember, mealId) : null;
    const preferenceBonus = preference === 'favorite' 
      ? `+${MEAL_PREFERENCES.FAVORITE_MEAL_BONUS}%`
      : preference === 'disliked' 
        ? `${MEAL_PREFERENCES.DISLIKED_MEAL_PENALTY}%`
        : null;

    return (
      <div style={tooltipStyles}>
        <div style={tooltipTitleStyles}>{recipe.name}</div>
        <div style={tooltipDescriptionStyles}>{recipe.description}</div>
        <div style={tooltipStatsStyles}>
          <div style={tooltipStatStyles}>
            <span>🍖 Hunger Value:</span>
            <span>{recipe.hungerValue}</span>
          </div>
          <div style={tooltipStatStyles}>
            <span>😊 Morale Bonus:</span>
            <span>{recipe.moraleBonus}</span>
          </div>
          <div style={tooltipStatStyles}>
            <span>⏱️ Prep Time:</span>
            <span>{recipe.preparationTime}</span>
          </div>
          {mealInfo && (
            <div style={tooltipStatStyles}>
              <span>📅 Spoils In:</span>
              <span>{mealInfo.daysUntilSpoiled} days</span>
            </div>
          )}
          {preferenceBonus && (
            <div style={{
              ...tooltipStatStyles,
              color: preference === 'favorite' ? gameTheme.colors.success : gameTheme.colors.danger
            }}>
              <span>⭐ Preference Bonus:</span>
              <span>{preferenceBonus}</span>
            </div>
          )}
        </div>
        {recipe.ingredients && (
          <div style={tooltipIngredientsStyles}>
            <div style={tooltipIngredientsTitleStyles}>Ingredients:</div>
            <div style={tooltipIngredientsGridStyles}>
              {Object.entries(recipe.ingredients).map(([ingredient, amount]) => (
                <div key={ingredient} style={tooltipIngredientStyles}>
                  <span>{ingredient}</span>
                  <span>x{amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSlots = (crewMember, isSnack = false) => {
    const slots = [...Array(3)].map((_, index) => {
      const slotKey = `${crewMember.id}-${isSnack ? 's' : 'm'}${index}`;
      const assignedMealId = assignedMeals[slotKey];
      const recipe = recipes[assignedMealId];
      const preference = assignedMealId ? getMealPreference(crewMember, assignedMealId) : 'neutral';

      return (
        <div 
          key={index}
          style={{
            ...slotStyles,
            ...(assignedMealId ? filledSlotStyles(preference) : emptySlotStyles)
          }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, crewMember.id, index, isSnack)}
          onMouseEnter={(e) => {
            if (recipe) {
              setTooltipContent(renderMealTooltip(recipe, assignedMealId, crewMember));
              handleMouseMove(e);
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltipContent(null)}
        >
          {assignedMealId ? (
            <div style={assignedMealStyles}>
              <div style={mealNameStyles}>{recipe?.name || 'Unknown Meal'}</div>
              <div style={mealStatsStyles}>
                <span>🍖 {recipe?.hungerValue || 0}</span>
              </div>
              <button 
                style={removeMealButtonStyles}
                onClick={() => handleMealAssignment(crewMember.id, null, index, isSnack)}
              >
                ✕
              </button>
            </div>
          ) : (
            <div style={emptySlotContentStyles}>
              <span>{isSnack ? 'S' : 'M'}</span>
            </div>
          )}
        </div>
      );
    });

    return (
      <div style={slotsContainerStyles}>
        <div style={slotTypeStyles}>{isSnack ? 'Snacks' : 'Meals'}</div>
        <div style={slotsGridStyles}>
          {slots}
        </div>
      </div>
    );
  };

  const renderAvailableMeals = () => {
    const mealGroups = cookedMeals.reduce((acc, mealId) => {
      if (!recipes[mealId]) return acc;
      
      const existingGroup = acc.find(g => g.id === mealId);
      if (existingGroup) {
        existingGroup.count++;
      } else {
        acc.push({ id: mealId, count: 1 });
      }
      return acc;
    }, []);

    return (
      <div style={availableMealsStyles.container}>
        <h4 style={availableMealsStyles.title}>Available Meals</h4>
        <div style={availableMealsStyles.grid}>
          {mealGroups.map((meal) => {
            const recipe = recipes[meal.id];
            if (!recipe) return null;

            const assignedCount = Object.values(assignedMeals).filter(id => id === meal.id).length;
            const remaining = meal.count - assignedCount;

            return (
              <div 
                key={meal.id} 
                style={{
                  ...availableMealsStyles.meal,
                  opacity: remaining > 0 ? 1 : 0.5,
                  cursor: remaining > 0 ? 'grab' : 'not-allowed'
                }}
                draggable={remaining > 0}
                onDragStart={(e) => handleDragStart(e, meal)}
                onMouseEnter={(e) => {
                  setTooltipContent(renderMealTooltip(recipe, meal.id));
                  handleMouseMove(e);
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setTooltipContent(null)}
              >
                <div style={availableMealsStyles.mealName}>
                  <span style={availableMealsStyles.mealIcon}>🍽️</span>
                  {recipe.name}
                </div>
                <div style={availableMealsStyles.mealStats}>
                  <div style={availableMealsStyles.stat}>
                    <span>🍖</span> {recipe.hungerValue}
                  </div>
                  <div style={availableMealsStyles.stat}>
                    <span>😊</span> {recipe.moraleBonus}
                  </div>
                </div>
                <div style={availableMealsStyles.servings}>
                  Available: {remaining}/{meal.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyles}>
      <h3 style={titleStyles}>Meal Assignments</h3>
      <div style={contentStyles}>
        {renderAvailableMeals()}
        <div style={crewContainerStyles}>
          {crew.map((member) => (
            <div key={member.id} style={crewCardStyles}>
              <div style={crewInfoStyles}>
                <div style={crewImageContainer}>
                  <div style={crewImagePlaceholder}>
                    👤
                  </div>
                </div>
                <div style={crewDetailsStyles}>
                  <div style={crewNameRoleStyles}>
                    <div style={crewNameStyles}>{member.name}</div>
                    <div style={crewRoleStyles}>{crewRoles[member.role]?.name}</div>
                  </div>
                  <div style={hungerContainerStyles}>
                    <div style={hungerLabelStyles}>Hunger</div>
                    <div style={hungerBarStyles}>
                      <div 
                        style={{
                          ...hungerFillStyles,
                          width: `${member.hunger}%`,
                          backgroundColor: member.hunger > 70 
                            ? gameTheme.colors.success 
                            : member.hunger > 30 
                              ? gameTheme.colors.warning
                              : gameTheme.colors.danger
                        }}
                      />
                    </div>
                    <div style={hungerValueStyles}>{member.hunger}%</div>
                  </div>
                </div>
              </div>
              <div style={assignmentContainerStyles}>
                {renderSlots(member, false)} {/* Meals */}
                {renderSlots(member, true)}  {/* Snacks */}
              </div>
            </div>
          ))}
        </div>
      </div>
      {tooltipContent && (
        <div 
          style={{
            ...tooltipContainerStyles,
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

const containerStyles = {
  backgroundColor: gameTheme.colors.panel,
  color: gameTheme.colors.text,
  padding: '20px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  ...gameTheme.common.panel,
  ...gameTheme.common.pixelated,
};

const titleStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: gameTheme.colors.highlightPrimary,
  textAlign: 'center',
  margin: 0,
  textTransform: 'uppercase',
};

const contentStyles = {
  display: 'flex',
  gap: '20px',
  height: 'calc(100% - 60px)',
};

const crewContainerStyles = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  overflowY: 'auto',
};

const crewCardStyles = {
  backgroundColor: gameTheme.colors.background,
  border: `2px solid ${gameTheme.colors.border}`,
  borderRadius: '4px',
  padding: '12px',
};

const crewInfoStyles = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  marginBottom: '8px',
};

const crewImageContainer = {
  width: '48px',
  height: '48px',
  borderRadius: '4px',
  overflow: 'hidden',
  backgroundColor: gameTheme.colors.panel,
  border: `2px solid ${gameTheme.colors.border}`,
  flexShrink: 0,
};

const crewImagePlaceholder = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  color: gameTheme.colors.textDim,
};

const crewDetailsStyles = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const crewNameRoleStyles = {
  flex: 1,
};

const crewNameStyles = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: gameTheme.colors.text,
  marginBottom: '2px',
};

const crewRoleStyles = {
  fontSize: '12px',
  color: gameTheme.colors.textDim,
};

const hungerContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  position: 'relative',
  minWidth: '140px',
};

const hungerLabelStyles = {
  fontSize: '12px',
  color: gameTheme.colors.textDim,
  whiteSpace: 'nowrap',
};

const hungerBarStyles = {
  width: '80px',
  height: '6px',
  backgroundColor: `${gameTheme.colors.border}22`,
  border: `1px solid ${gameTheme.colors.border}`,
  borderRadius: '3px',
  overflow: 'hidden',
  position: 'relative',
};

const hungerFillStyles = {
  height: '100%',
  transition: 'width 0.3s ease',
  position: 'absolute',
  left: 0,
  top: 0,
};

const hungerValueStyles = {
  fontSize: '12px',
  color: gameTheme.colors.text,
  position: 'absolute',
  right: '-30px',
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0,
  transition: 'opacity 0.2s ease',
};

const assignmentContainerStyles = {
  display: 'flex',
  gap: '16px',
};

const slotsContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const slotTypeStyles = {
  fontSize: '11px',
  color: gameTheme.colors.textDim,
  whiteSpace: 'nowrap',
};

const slotsGridStyles = {
  display: 'flex',
  gap: '6px',
};

const slotStyles = {
  width: '50px',
  height: '50px',
  backgroundColor: gameTheme.colors.background,
  border: `2px solid ${gameTheme.colors.border}`,
  borderRadius: '4px',
  padding: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
};

const filledSlotStyles = (preference) => ({
  borderColor: preference === 'favorite' 
    ? gameTheme.colors.success 
    : preference === 'disliked'
      ? gameTheme.colors.danger
      : gameTheme.colors.border,
  backgroundColor: preference === 'favorite'
    ? `${gameTheme.colors.success}11`
    : preference === 'disliked'
      ? `${gameTheme.colors.danger}11`
      : gameTheme.colors.background,
});

const emptySlotStyles = {
  backgroundColor: `${gameTheme.colors.border}11`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    borderColor: gameTheme.colors.highlightPrimary,
    backgroundColor: `${gameTheme.colors.highlightPrimary}11`,
  },
};

const assignedMealStyles = {
  position: 'relative',
};

const mealNameStyles = {
  fontSize: '14px',
  fontWeight: 'bold',
  marginBottom: '8px',
};

const mealStatsStyles = {
  display: 'flex',
  gap: '12px',
  fontSize: '12px',
  color: gameTheme.colors.textDim,
};

const removeMealButtonStyles = {
  position: 'absolute',
  top: '-8px',
  right: '-8px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: gameTheme.colors.danger,
  color: gameTheme.colors.background,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  opacity: 0,
  transition: 'opacity 0.2s',
  '&:hover': {
    opacity: 1,
  },
};

const emptySlotContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  color: gameTheme.colors.textDim,
};

const availableMealsStyles = {
  container: {
    width: '300px',
    backgroundColor: gameTheme.colors.background,
    border: `2px solid ${gameTheme.colors.border}`,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    height: '100%',
    overflowY: 'auto',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: gameTheme.colors.highlightPrimary,
    textAlign: 'center',
    margin: 0,
    padding: '8px 0',
    borderBottom: `2px solid ${gameTheme.colors.border}`,
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  meal: {
    backgroundColor: gameTheme.colors.panel,
    border: `2px solid ${gameTheme.colors.border}`,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: gameTheme.colors.highlightPrimary,
      transform: 'translateY(-2px)',
    },
  },
  mealName: {
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  mealIcon: {
    fontSize: '20px',
  },
  mealStats: {
    display: 'flex',
    gap: '12px',
    fontSize: '14px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  servings: {
    fontSize: '12px',
    color: gameTheme.colors.textDim,
    borderTop: `1px solid ${gameTheme.colors.border}`,
    paddingTop: '8px',
  },
};

const tooltipContainerStyles = {
  position: 'fixed',
  zIndex: 1000,
  pointerEvents: 'none',
  backgroundColor: gameTheme.colors.panel,
  border: `2px solid ${gameTheme.colors.border}`,
  borderRadius: '4px',
  padding: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  maxWidth: '300px',
  ...gameTheme.common.panel,
};

const tooltipStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const tooltipTitleStyles = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: gameTheme.colors.highlightPrimary,
};

const tooltipDescriptionStyles = {
  fontSize: '12px',
  color: gameTheme.colors.text,
  fontStyle: 'italic',
};

const tooltipStatsStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  borderTop: `1px solid ${gameTheme.colors.border}`,
  paddingTop: '8px',
};

const tooltipStatStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  color: gameTheme.colors.text,
};

const tooltipIngredientsStyles = {
  borderTop: `1px solid ${gameTheme.colors.border}`,
  paddingTop: '8px',
};

const tooltipIngredientsTitleStyles = {
  fontSize: '12px',
  fontWeight: 'bold',
  color: gameTheme.colors.text,
  marginBottom: '4px',
};

const tooltipIngredientsGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '4px',
};

const tooltipIngredientStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  color: gameTheme.colors.textDim,
  padding: '2px 4px',
  backgroundColor: `${gameTheme.colors.border}11`,
  borderRadius: '2px',
};

export default MealAssignmentTable;