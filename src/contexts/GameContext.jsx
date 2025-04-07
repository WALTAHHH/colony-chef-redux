import React, { createContext, useContext, useReducer } from 'react';
import { 
  initialInventory, 
  getItemEmoji,
  addToInventory,
  removeFromInventory
} from '../data/ingredientData';
import { initialCrew } from '../data/crewData';
import { recipes } from '../data/recipeData';
import { hasItems } from '../utils/inventoryUtils';

const GameContext = createContext();

export const GAME_STATE = {
  PLAYING: 'PLAYING',
  VICTORY: 'VICTORY',
  DEFEAT: 'DEFEAT'
};

const initialState = {
  inventory: initialInventory,
  crew: initialCrew,
  recipes,
  day: 1,
  gamePhase: 1,
  progressToNext: 0,
  activeScenario: null,
  scenarioHistory: [],
  mealAssignments: {},
  gameState: GAME_STATE.PLAYING
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload };
    case 'SET_CREW':
      return { ...state, crew: action.payload };
    case 'SET_GAME_PHASE':
      return { ...state, gamePhase: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progressToNext: action.payload };
    case 'SET_ACTIVE_SCENARIO':
      return { ...state, activeScenario: action.payload };
    case 'ADD_SCENARIO_TO_HISTORY':
      return { ...state, scenarioHistory: [...state.scenarioHistory, action.payload] };
    case 'SET_MEAL_ASSIGNMENTS':
      return { ...state, mealAssignments: action.payload };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const canCraftRecipe = (recipeId) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return false;
    return hasItems(state.inventory, recipe.ingredients);
  };

  const craftRecipe = (recipeId) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return { success: false, message: 'Recipe not found' };
    
    if (!canCraftRecipe(recipeId)) {
      return { success: false, message: 'Missing ingredients' };
    }

    let newInventory = { ...state.inventory };
    // Remove ingredients
    for (const [item, quantity] of Object.entries(recipe.ingredients)) {
      newInventory = removeFromInventory(newInventory, item, quantity);
    }
    // Add result
    newInventory = addToInventory(newInventory, recipe.result, 1);
    
    dispatch({ type: 'SET_INVENTORY', payload: newInventory });
    return { success: true, newInventory };
  };

  const value = {
    ...state,
    GAME_STATE,
    getItemEmoji,
    canCraftRecipe,
    craftRecipe,
    setInventory: (inventory) => dispatch({ type: 'SET_INVENTORY', payload: inventory }),
    setCrew: (crew) => dispatch({ type: 'SET_CREW', payload: crew }),
    setGamePhase: (phase) => dispatch({ type: 'SET_GAME_PHASE', payload: phase }),
    setProgress: (progress) => dispatch({ type: 'SET_PROGRESS', payload: progress }),
    setActiveScenario: (scenario) => dispatch({ type: 'SET_ACTIVE_SCENARIO', payload: scenario }),
    addScenarioToHistory: (scenario) => dispatch({ type: 'ADD_SCENARIO_TO_HISTORY', payload: scenario }),
    setMealAssignments: (assignments) => dispatch({ type: 'SET_MEAL_ASSIGNMENTS', payload: assignments }),
    setGameState: (state) => dispatch({ type: 'SET_GAME_STATE', payload: state })
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};