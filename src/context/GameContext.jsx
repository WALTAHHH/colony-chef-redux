import React, { createContext, useContext, useState, useCallback } from 'react';
import { GAME_STATES, GAME_PHASES, ACTION_POINTS } from '../data/gameConstants';
import { recipes, getSpoiledRecipe } from '../data/recipeData';
import { ingredients } from '../data/ingredientData';
import { addItems, removeItems, hasItems } from '../utils/inventoryUtils';
import { initialCrew } from '../data/crewData';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    state: GAME_STATES.PLAYING,
    phase: GAME_PHASES.PLANNING,
    day: 1,
    inventory: {
      vegetables: 5,
      meat: 3,
      fish: 3,
      rice: 4,
      spices: 3
    },
    crew: initialCrew,
    cookedMeals: [],
    assignedMeals: {},
    progress: 0,
    morale: 50,
    actionPoints: {
      total: ACTION_POINTS.MAX_AP,
      spent: 0
    },
    mealQueue: []
  });

  const advancePhase = useCallback(() => {
    setGameState(prev => {
      const nextPhase = (prev.phase + 1) % Object.keys(GAME_PHASES).length;
      return {
        ...prev,
        phase: nextPhase,
        // Reset spent AP when moving to next phase
        actionPoints: {
          ...prev.actionPoints,
          spent: 0
        }
      };
    });
  }, []);

  const advanceDay = useCallback(() => {
    setGameState(prev => {
      // Calculate new progress based on crew satisfaction
      const crewSatisfaction = Object.values(prev.assignedMeals).reduce((sum, meal) => {
        const recipe = recipes[meal];
        return sum + (recipe?.hungerValue || 0);
      }, 0) / (prev.crew.length || 1);

      const newProgress = Math.min(
        prev.progress + crewSatisfaction,
        100
      );

      // Calculate new morale based on crew satisfaction and progress
      const newMorale = Math.min(
        prev.morale + (crewSatisfaction / 10) + (newProgress - prev.progress) / 10,
        100
      );

      // Check for meal spoilage
      const updatedCookedMeals = prev.cookedMeals.map(meal => {
        const recipe = recipes[meal.id];
        if (!recipe) return meal; // Skip if recipe doesn't exist
        
        const daysSinceCooking = prev.day - meal.cookedOn;
        if (!meal.isSpoiled && daysSinceCooking >= recipe.spoilageTime) {
          return { ...meal, isSpoiled: true };
        }
        return meal;
      });

      return {
        ...prev,
        day: prev.day + 1,
        phase: GAME_PHASES.PLANNING,
        cookedMeals: updatedCookedMeals,
        assignedMeals: {},
        progress: newProgress,
        morale: newMorale,
        // Reset AP for new day
        actionPoints: {
          total: ACTION_POINTS.MAX_AP,
          spent: 0
        }
      };
    });
  }, []);

  const spendActionPoints = useCallback((amount) => {
    setGameState(prev => {
      const newSpent = prev.actionPoints.spent + amount;
      if (newSpent > prev.actionPoints.total) {
        return prev; // Not enough AP
      }
      return {
        ...prev,
        actionPoints: {
          ...prev.actionPoints,
          spent: newSpent
        }
      };
    });
  }, []);

  const addToInventory = useCallback((items) => {
    setGameState(prev => ({
      ...prev,
      inventory: addItems(prev.inventory, items)
    }));
  }, []);

  const removeFromInventory = useCallback((items) => {
    setGameState(prev => ({
      ...prev,
      inventory: removeItems(prev.inventory, items)
    }));
  }, []);

  const cookMeal = useCallback((recipeId) => {
    const recipe = recipes[recipeId];
    if (!recipe) return false;

    setGameState(prev => {
      if (!hasItems(prev.inventory, recipe.ingredients)) {
        return prev;
      }

      // Check if we have enough AP
      const apCost = recipe.actionPointCost || ACTION_POINTS.DEFAULT_MEAL_COST;
      if (prev.actionPoints.spent + apCost > prev.actionPoints.total) {
        return prev;
      }

      return {
        ...prev,
        inventory: removeItems(prev.inventory, recipe.ingredients),
        cookedMeals: [...prev.cookedMeals, {
          id: recipeId,
          cookedOn: prev.day,
          isSpoiled: false
        }],
        actionPoints: {
          ...prev.actionPoints,
          spent: prev.actionPoints.spent + apCost
        }
      };
    });

    return true;
  }, []);

  const assignMeal = useCallback((crewId, mealId, slotIndex, isSnack = false) => {
    setGameState(prev => {
      // If mealId is null, we're removing a meal
      if (mealId === null) {
        const newAssignedMeals = { ...prev.assignedMeals };
        delete newAssignedMeals[`${crewId}-${isSnack ? 's' : 'm'}${slotIndex}`];
        return {
          ...prev,
          assignedMeals: newAssignedMeals
        };
      }

      // Check if the meal is still available
      const mealCount = prev.cookedMeals.filter(id => id === mealId).length;
      const assignedCount = Object.values(prev.assignedMeals).filter(id => id === mealId).length;
      
      if (assignedCount >= mealCount) {
        return prev; // No more servings available
      }

      // Check if the slot is already taken
      const slotKey = `${crewId}-${isSnack ? 's' : 'm'}${slotIndex}`;
      const existingMealInSlot = prev.assignedMeals[slotKey];
      if (existingMealInSlot) {
        return prev; // Slot is taken
      }

      return {
        ...prev,
        assignedMeals: {
          ...prev.assignedMeals,
          [slotKey]: mealId
        }
      };
    });
  }, []);

  const addCrew = useCallback((crewMember) => {
    setGameState(prev => ({
      ...prev,
      crew: [...prev.crew, crewMember]
    }));
  }, []);

  const removeCrew = useCallback((crewId) => {
    setGameState(prev => ({
      ...prev,
      crew: prev.crew.filter(member => member.id !== crewId),
      assignedMeals: Object.fromEntries(
        Object.entries(prev.assignedMeals).filter(([id]) => id !== crewId)
      )
    }));
  }, []);

  const addToMealQueue = useCallback((recipeId) => {
    const recipe = recipes[recipeId];
    if (!recipe) return false;

    setGameState(prev => {
      // Check if we have the ingredients
      const hasIngredients = hasItems(prev.inventory, recipe.ingredients);

      return {
        ...prev,
        mealQueue: [
          ...prev.mealQueue,
          {
            recipeId,
            hasIngredients,
            missingIngredients: hasIngredients ? null : recipe.ingredients
          }
        ]
      };
    });

    return true;
  }, []);

  const removeFromMealQueue = useCallback((index) => {
    setGameState(prev => ({
      ...prev,
      mealQueue: prev.mealQueue.filter((_, i) => i !== index)
    }));
  }, []);

  const prepareQueuedMeals = useCallback(() => {
    setGameState(prev => {
      const validMeals = prev.mealQueue.filter(meal => meal.hasIngredients);
      const totalAPCost = validMeals.reduce((sum, meal) => 
        sum + (recipes[meal.recipeId].actionPointCost || ACTION_POINTS.DEFAULT_MEAL_COST), 0);

      if (totalAPCost > prev.actionPoints.total - prev.actionPoints.spent) {
        return prev;
      }

      const newInventory = validMeals.reduce((inv, meal) => 
        removeItems(inv, recipes[meal.recipeId].ingredients), prev.inventory);

      return {
        ...prev,
        inventory: newInventory,
        cookedMeals: [...prev.cookedMeals, ...validMeals.map(meal => meal.recipeId)],
        mealQueue: [],
        actionPoints: {
          ...prev.actionPoints,
          spent: prev.actionPoints.spent + totalAPCost
        }
      };
    });
  }, []);

  const getMealInfo = useCallback((mealId) => {
    const meal = gameState.cookedMeals.find(m => m.id === mealId);
    if (!meal) return null;

    const recipe = meal.isSpoiled ? getSpoiledRecipe(mealId) : recipes[mealId];
    const daysSinceCooking = gameState.day - meal.cookedOn;
    const daysUntilSpoiled = meal.isSpoiled ? 0 : recipe.spoilageTime - daysSinceCooking;

    return {
      ...meal,
      ...recipe,
      daysSinceCooking,
      daysUntilSpoiled
    };
  }, [gameState.cookedMeals, gameState.day]);

  const value = {
    gameState,
    advancePhase,
    advanceDay,
    addToInventory,
    removeFromInventory,
    cookMeal,
    assignMeal,
    addCrew,
    removeCrew,
    spendActionPoints,
    addToMealQueue,
    removeFromMealQueue,
    prepareQueuedMeals,
    getMealInfo
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 