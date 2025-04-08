import React, { createContext, useContext, useState, useCallback } from 'react';
import { GAME_STATES, GAME_PHASES } from '../data/gameConstants';
import { recipes } from '../data/recipeData';
import { ingredients } from '../data/ingredientData';
import { addItems, removeItems, hasItems } from '../utils/inventoryUtils';
import { initialCrew } from '../data/crewData';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    state: GAME_STATES.PLAYING,
    phase: GAME_PHASES.PLANNING,
    day: 1,
    inventory: {},
    crew: initialCrew,
    cookedMeals: [],
    assignedMeals: {},
    progress: 0,
    morale: 50
  });

  const advancePhase = useCallback(() => {
    setGameState(prev => {
      const nextPhase = (prev.phase + 1) % Object.keys(GAME_PHASES).length;
      return {
        ...prev,
        phase: nextPhase
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

      return {
        ...prev,
        day: prev.day + 1,
        phase: GAME_PHASES.PLANNING,
        cookedMeals: [],
        assignedMeals: {},
        progress: newProgress,
        morale: newMorale
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

      return {
        ...prev,
        inventory: removeItems(prev.inventory, recipe.ingredients),
        cookedMeals: [...prev.cookedMeals, recipeId]
      };
    });

    return true;
  }, []);

  const assignMeal = useCallback((crewId, mealId) => {
    setGameState(prev => ({
      ...prev,
      assignedMeals: {
        ...prev.assignedMeals,
        [crewId]: mealId
      }
    }));
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

  const value = {
    gameState,
    advancePhase,
    advanceDay,
    addToInventory,
    removeFromInventory,
    cookMeal,
    assignMeal,
    addCrew,
    removeCrew
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