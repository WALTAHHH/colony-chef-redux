import React from 'react';
import { useGame } from '../context/GameContext';
import { recipes } from '../data/recipeData';
import { crewRoles } from '../data/crewData';
import { MEAL_PREFERENCES } from '../data/gameConstants';
import { gameTheme } from '../theme/gameTheme';

const MealAssignmentTable = () => {
  const { gameState, assignMeal } = useGame();
  const { crew, cookedMeals, assignedMeals } = gameState;

  const handleMealAssignment = (crewId, mealId) => {
    assignMeal(crewId, mealId);
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

  const getMealPreferenceBonus = (preference) => {
    switch (preference) {
      case 'favorite':
        return `+${MEAL_PREFERENCES.FAVORITE_MEAL_BONUS}`;
      case 'disliked':
        return MEAL_PREFERENCES.DISLIKED_MEAL_PENALTY;
      default:
        return '0';
    }
  };

  const renderAvailableMeals = () => (
    <div style={availableMealsStyles.container}>
      <h4 style={availableMealsStyles.title}>Available Meals</h4>
      <div style={availableMealsStyles.grid}>
        {cookedMeals.map((mealId) => {
          const recipe = recipes[mealId];
          const assignedCount = Object.values(assignedMeals).filter(id => id === mealId).length;
          const remaining = recipe.servings - assignedCount;

          return (
            <div key={mealId} style={availableMealsStyles.meal}>
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
                Servings: {remaining}/{recipe.servings}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={containerStyles}>
      <h3 style={titleStyles}>Meal Assignments</h3>
      <div style={contentStyles}>
        {renderAvailableMeals()}
        <div style={tableContainerStyles}>
          <div style={tableStyles}>
            <div style={headerStyles}>
              <div style={headerCellStyles}>Crew Member</div>
              <div style={headerCellStyles}>Role</div>
              <div style={headerCellStyles}>Hunger</div>
              <div style={headerCellStyles}>Meals Left</div>
              {cookedMeals.map((mealId) => (
                <div key={mealId} style={headerCellStyles}>
                  {recipes[mealId]?.name}
                </div>
              ))}
            </div>
            {crew.map((member) => (
              <div key={member.id} style={rowStyles}>
                <div style={cellStyles}>{member.name}</div>
                <div style={cellStyles}>{crewRoles[member.role]?.name}</div>
                <div style={cellStyles}>
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
                  {member.hunger}%
                </div>
                <div style={cellStyles}>
                  <div style={mealCountStyles}>
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i} 
                        style={{
                          ...mealSlotStyles,
                          opacity: i < member.mealsRemaining ? 1 : 0.3
                        }}
                      >
                        M
                      </div>
                    ))}
                  </div>
                </div>
                {cookedMeals.map((mealId) => {
                  const preference = getMealPreference(member, mealId);
                  const isAssigned = assignedMeals[member.id] === mealId;
                  const bonus = getMealPreferenceBonus(preference);

                  return (
                    <div
                      key={mealId}
                      style={mealCellStyles(isAssigned, preference)}
                      onClick={() => handleMealAssignment(member.id, mealId)}
                    >
                      {isAssigned ? (
                        <>
                          <div style={mealIndicatorStyles}>M</div>
                          <div style={bonusStyles}>
                            {bonus > 0 ? '+' : ''}{bonus}%
                          </div>
                        </>
                      ) : (
                        <div style={emptySlotStyles}>
                          Click to Assign
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyles = {
  backgroundColor: gameTheme.colors.panel,
  color: gameTheme.colors.text,
  ...gameTheme.common.panel,
  ...gameTheme.common.pixelated,
};

const contentStyles = {
  display: 'flex',
  gap: '20px',
  height: 'calc(100vh - 300px)', // Adjust based on your header/footer heights
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
    overflowY: 'auto',
  },
  meal: {
    backgroundColor: gameTheme.colors.panel,
    border: `2px solid ${gameTheme.colors.border}`,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
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

const tableContainerStyles = {
  flex: 1,
  overflowX: 'auto',
};

const titleStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  color: gameTheme.colors.highlightPrimary,
  textAlign: 'center',
  textTransform: 'uppercase',
};

const tableStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const headerStyles = {
  display: 'grid',
  gridTemplateColumns: '150px 120px 100px 100px repeat(auto-fit, minmax(120px, 1fr))',
  gap: '8px',
  padding: '12px',
  backgroundColor: gameTheme.colors.background,
  border: `2px solid ${gameTheme.colors.border}`,
  fontWeight: 'bold',
};

const headerCellStyles = {
  padding: '8px',
  textAlign: 'center',
  color: gameTheme.colors.highlightSecondary,
  fontSize: '14px',
};

const rowStyles = {
  display: 'grid',
  gridTemplateColumns: '150px 120px 100px 100px repeat(auto-fit, minmax(120px, 1fr))',
  gap: '8px',
  padding: '12px',
  backgroundColor: gameTheme.colors.background,
  border: `2px solid ${gameTheme.colors.border}`,
  alignItems: 'center',
};

const cellStyles = {
  padding: '8px',
  textAlign: 'center',
  fontSize: '14px',
};

const hungerBarStyles = {
  width: '100%',
  height: '8px',
  backgroundColor: gameTheme.colors.background,
  border: `1px solid ${gameTheme.colors.border}`,
  marginBottom: '4px',
};

const hungerFillStyles = {
  height: '100%',
  transition: 'width 0.3s ease',
};

const mealCountStyles = {
  display: 'flex',
  gap: '4px',
  justifyContent: 'center',
};

const mealSlotStyles = {
  width: '20px',
  height: '20px',
  backgroundColor: gameTheme.colors.background,
  border: `1px solid ${gameTheme.colors.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontFamily: 'monospace',
  color: gameTheme.colors.text,
};

const mealCellStyles = (isAssigned, preference) => ({
  padding: '12px',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: isAssigned
    ? preference === 'favorite'
      ? gameTheme.colors.success + '33'
      : preference === 'disliked'
      ? gameTheme.colors.danger + '33'
      : gameTheme.colors.background
    : gameTheme.colors.background,
  border: `2px solid ${
    isAssigned
      ? preference === 'favorite'
        ? gameTheme.colors.success
        : preference === 'disliked'
        ? gameTheme.colors.danger
        : gameTheme.colors.border
      : gameTheme.colors.border
  }`,
  transition: 'all 0.2s',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  minHeight: '60px',
  justifyContent: 'center',
  '&:hover': {
    borderColor: gameTheme.colors.highlightPrimary,
    backgroundColor: gameTheme.colors.highlightPrimary + '11',
  },
});

const mealIndicatorStyles = {
  width: '24px',
  height: '24px',
  backgroundColor: gameTheme.colors.background,
  border: `2px solid ${gameTheme.colors.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  color: gameTheme.colors.highlightPrimary,
};

const bonusStyles = {
  fontSize: '12px',
  fontWeight: 'bold',
};

const emptySlotStyles = {
  fontSize: '12px',
  color: gameTheme.colors.textDim,
  fontStyle: 'italic',
};

export default MealAssignmentTable;