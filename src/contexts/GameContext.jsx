import React, { createContext, useContext, useState, useEffect } from 'react';
import { scenarios, getRandomScenario } from '../data/ScenarioData';
import { initialCrew } from '../data/crewData';
import { recipes } from '../data/recipeData';
import { landmarks, getCurrentLandmark, getNextLandmark } from '../data/landmarkData';
import ingredients from '../data/ingredientsConfig';
import { getItemEmoji, addToInventory as addInventoryItem, removeFromInventory as removeInventoryItem } from '../data/ingredientData';
import { addItems, removeItems, hasItems } from '../utils/inventoryUtils';
import {
  GAME_STATE,
  MAX_HUNGER,
  BASE_HUNGER_DECREASE,
  HARDWORKING_HUNGER_BONUS,
  AGILE_HUNGER_BONUS,
  DISCIPLINED_HUNGER_BONUS,
  FAVORITE_MEAL_BONUS,
  DISLIKED_MEAL_PENALTY,
  MAX_DAILY_PROGRESS,
  SCENARIO_TRIGGER_CHANCE,
  MAX_RANDOM_SUPPLY,
  GAME_PHASES
} from '../data/gameConstants';
const GameContext = createContext();
export const useGameState = () => useContext(GameContext);
export const GameProvider = ({ children }) => {
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Inventory state
  const [inventory, setInventory] = useState(() => {
    return Object.fromEntries(
      Object.entries(ingredients).map(([item, data]) => [item, data.initialQuantity])
    );
  });
  
  // Crafted meals - now with assignments to crew members
  const [meals, setMeals] = useState([]);
  
  // Track meal and snack assignments to crew members
  const [mealAssignments, setMealAssignments] = useState({});
  const [snackAssignments, setSnackAssignments] = useState({});
  
  // Individual crew members
  const [crew, setCrew] = useState(initialCrew);
  // Function to assign a meal to a crew member
  const assignMealToCrew = (crewId, mealIndex, slot) => {
    setMealAssignments(prev => ({
      ...prev,
      [crewId]: {
        ...prev[crewId],
        [slot]: mealIndex
      }
    }));
  };
  // Function to assign a snack to a crew member
  const assignSnackToCrew = (crewId, snackIndex, slot) => {
    setSnackAssignments(prev => ({
      ...prev,
      [crewId]: {
        ...prev[crewId],
        [slot]: snackIndex
      }
    }));
  };
  
  // Expedition progress (0-100)
  const [progress, setProgress] = useState(0);
  
  // Day counter
  const [day, setDay] = useState(1);
  
  // Game state (playing, victory, defeat)
  const [gameState, setGameState] = useState(GAME_STATE.PLAYING);
  
  // Active scenario
  const [activeScenario, setActiveScenario] = useState(null);
  
  // Track if we just handled a scenario outcome
  const [scenarioResolved, setScenarioResolved] = useState(false);
  
  // Scenario history
  const [scenarioHistory, setScenarioHistory] = useState([]);
  
  // Game phase (1-4)
  // 1: Start day & review
  // 2: Gather ingredients & prepare meals
  // 3: Serve food & see results
  // 4: End day
  const [gamePhase, setGamePhase] = useState(1);
  
  // Recipe definitions are now imported from recipeData.js
  
  // Check if we can craft a recipe
  const canCraftRecipe = (recipe) => {
    if (!recipes[recipe]) return false;
    const ingredients = Object.entries(recipes[recipe])
      .filter(([key]) => key !== 'hungerValue')
      .reduce((acc, [ingredient, amount]) => {
        acc[ingredient] = amount;
        return acc;
      }, {});
    return hasItems(inventory, ingredients);
  };
  
  // Craft a recipe
  const craftRecipe = (recipe) => {
    if (!canCraftRecipe(recipe)) return false;
    
    // Gather ingredients to remove
    const ingredientsToRemove = Object.entries(recipes[recipe])
      .filter(([key]) => key !== 'hungerValue')
      .reduce((acc, [ingredient, amount]) => {
        acc[ingredient] = amount;
        return acc;
      }, {});
    
    // Use the removeItems utility function to consume ingredients
    setInventory(prevInventory => removeItems(prevInventory, ingredientsToRemove));
    
    // Add meal to meals
    setMeals(prevMeals => [...prevMeals, recipe]);
    
    return true;
  };
  
  // Function to assign a meal to a crew member
  craftRecipe.assignMealToCrew = (mealIndex, crewId) => {
    setMealAssignments(prev => ({
      ...prev,
      [crewId]: mealIndex
    }));
  };
  
  // Constants for meal preference modifiers are now imported from gameConstants.js
  // Feed the crew based on meal and snack assignments
  const feedCrew = () => {
    if (meals.length === 0 && Object.keys(snackAssignments).length === 0) return false;
    
    const mealEffects = calculateMealEffects();
    const newCrew = crew.map(member => {
      const effect = mealEffects[member.id];
      if (effect) {
        let moraleChange = effect.moraleChange;
        let newHunger = effect.newHunger;
        // Apply trait effects
        if (member.traits.includes("Optimistic")) moraleChange += 2;
        if (member.traits.includes("Pessimistic")) moraleChange -= 2;
        if (member.traits.includes("Empathetic")) {
          const crewAverageMorale = crew.reduce((sum, m) => sum + m.morale, 0) / crew.length;
          moraleChange += crewAverageMorale > member.morale ? 1 : -1;
        }
        if (member.traits.includes("Hardworking")) {
          newHunger = Math.max(0, newHunger - 5); // Hardworking members get slightly less hungry
        }
        if (member.traits.includes("Disciplined")) {
          moraleChange += 1; // Disciplined members get a small morale boost
        }
        // Calculate final morale and hunger values
        const finalMorale = Math.max(0, Math.min(100, member.morale + moraleChange));
        const finalHunger = Math.max(0, Math.min(100, newHunger));
        return {
          ...member,
          hunger: finalHunger,
          morale: finalMorale
        };
      }
      return member;
    });
    
    // Remove all assigned meals
    const assignedMealIndices = new Set(Object.values(mealAssignments).flatMap(Object.values));
    const remainingUnassignedMeals = meals.filter((_, index) => !assignedMealIndices.has(index));
    
    setCrew(newCrew);
    
    // Update meals to only include unassigned meals
    setMeals(remainingUnassignedMeals);
    
    // Clear meal assignments
    setMealAssignments({});
    
    // Move to next game phase
    setGamePhase(4);
    
    return true;
  };
  
  // Calculate the effects of assigned meals on crew hunger and morale
  const calculateMealEffects = () => {
    const effects = {};
    const crewMealTypes = {};
    
    crew.forEach(member => {
      const memberMeals = mealAssignments[member.id] || {};
      let hungerChange = 0;
      let moraleChange = 0;
      let mealCount = 0;
      const mealTypes = new Set();
      
      Object.values(memberMeals).forEach(mealIndex => {
        if (mealIndex !== undefined) {
          const meal = meals[mealIndex];
          const recipe = recipes[meal];
          mealCount++;
          mealTypes.add(meal);
          
          if (recipe) {
            let mealEffect = recipe.hungerValue;
            
            // Apply preference modifiers
            if (meal === member.preferences.favorite) {
              mealEffect *= FAVORITE_MEAL_BONUS;
              moraleChange += 15; // Increased bonus for favorite meal
            } else if (meal === member.preferences.disliked) {
              mealEffect *= DISLIKED_MEAL_PENALTY;
              moraleChange -= 10; // Increased penalty for disliked meal
            } else {
              moraleChange += 5; // Small morale boost for neutral meals
            }
            
            hungerChange += mealEffect;
          }
        }
      });
      
      // Variety bonus
      const varietyBonus = mealTypes.size > 1 ? 5 * (mealTypes.size - 1) : 0;
      moraleChange += varietyBonus;
      
      // Meal quantity effects
      if (mealCount === 0) {
        moraleChange -= 20; // Big morale hit for no meals
      } else if (mealCount === 1) {
        moraleChange -= 5; // Small morale hit for only one meal
      } else if (mealCount >= 3) {
        moraleChange += 10; // Bonus for three or more meals
      }
      
      // Hunger satisfaction bonus
      const hungerSatisfactionBonus = Math.min(20, Math.max(0, hungerChange - 50));
      moraleChange += hungerSatisfactionBonus;
      
      // Cap hunger at MAX_HUNGER
      const newHunger = Math.min(member.hunger + hungerChange, MAX_HUNGER);
      
      effects[member.id] = {
        hungerChange: newHunger - member.hunger,
        newHunger: newHunger,
        moraleChange: moraleChange
      };
      
      crewMealTypes[member.id] = Array.from(mealTypes);
    });
    
    // Social effects based on meal types across crew
    crew.forEach(member => {
      const memberMealTypes = new Set(crewMealTypes[member.id]);
      let socialBonus = 0;
      
      crew.forEach(otherMember => {
        if (member.id !== otherMember.id) {
          const otherMealTypes = new Set(crewMealTypes[otherMember.id]);
          const sharedMeals = new Set([...memberMealTypes].filter(x => otherMealTypes.has(x)));
          socialBonus += sharedMeals.size * 2; // 2 points for each shared meal type
        }
      });
      
      effects[member.id].moraleChange += socialBonus;
    });
    
    return effects;
  };
  
  // Choose a scenario choice
  const chooseScenarioOption = (choiceIndex) => {
    if (!activeScenario) return;
    
    const choice = activeScenario.choices[choiceIndex];
    const outcome = choice.outcome;
    
    // Apply progress bonus/penalty
    const newProgress = Math.max(0, Math.min(100, progress + outcome.progressBonus));
    setProgress(newProgress);
    
    // Apply hunger penalties to crew
    const newCrew = crew.map(member => ({
      ...member,
      hunger: Math.max(0, Math.min(100, member.hunger - outcome.hungerPenalty))
    }));
    setCrew(newCrew);
    
    // Apply inventory changes
    setInventory(prevInventory => {
      let updatedInventory = { ...prevInventory };
      
      // Remove items using the imported removeInventoryItem function
      Object.entries(outcome.inventoryChanges)
        .filter(([_, change]) => change < 0)
        .forEach(([item, change]) => {
          updatedInventory = removeInventoryItem(updatedInventory, item, -change);
        });
      
      // Add items using the imported addInventoryItem function
      Object.entries(outcome.inventoryChanges)
        .filter(([_, change]) => change > 0)
        .forEach(([item, change]) => {
          updatedInventory = addInventoryItem(updatedInventory, item, change);
        });
      
      return updatedInventory;
    });
    
    // Mark scenario as resolved and clear it
    setScenarioResolved(true);
    
    // Create updated scenario with resolution info and selectedChoice for EventSystem
    const resolvedScenario = {
      ...activeScenario,
      resolved: true,
      selectedChoice: {
        ...choice,
        index: choiceIndex
      },
      outcomeDescription: outcome.description
    };
    
    setActiveScenario(resolvedScenario);
    
    // Find current landmark based on progress
    const currentLandmark = getCurrentLandmark(progress, landmarks);
    
    // Add to scenario history
    setScenarioHistory(prev => [...prev, {
      day,
      location: currentLandmark.name,
      scenario: activeScenario,
      choiceIndex,
      outcome: outcome
    }]);
  };
  
  // Clear the active scenario
  const clearScenario = () => {
    setActiveScenario(null);
    setScenarioResolved(false);
  };
  
  // Check for victory based on progress
  useEffect(() => {
    if (progress >= 100 && gameState === GAME_STATE.PLAYING) {
      setGameState(GAME_STATE.VICTORY);
    }
  }, [progress, gameState]);
  
  // Constants for nextDay function are now imported from gameConstants.js
  // Advance to next day
  const nextDay = () => {
    // Crew gets hungry
    const newCrew = crew.map(member => {
      // Hunger decreases based on traits
      let hungerDecrease = BASE_HUNGER_DECREASE;
      
      // Traits affect hunger decrease
      if (member.traits.includes("Hardworking")) hungerDecrease += HARDWORKING_HUNGER_BONUS;
      if (member.traits.includes("Agile")) hungerDecrease -= AGILE_HUNGER_BONUS;
      if (member.traits.includes("Disciplined")) hungerDecrease -= DISCIPLINED_HUNGER_BONUS;
      
      return {
        ...member,
        hunger: Math.max(member.hunger - hungerDecrease, 0)
      };
    });
    
    setCrew(newCrew);
    
    // Check if all crew members are starving (hunger at 0)
    const allStarving = newCrew.every(member => member.hunger === 0);
    if (allStarving) {
      setGameState(GAME_STATE.DEFEAT);
      return; // Don't continue with the day if game is over
    }
    
    // Calculate average crew hunger
    const avgHunger = newCrew.reduce((sum, member) => sum + member.hunger, 0) / newCrew.length;
    
    // Progress based on crew hunger
    const dayProgress = (avgHunger / 100) * MAX_DAILY_PROGRESS;
    const newProgress = Math.min(progress + dayProgress, 100);
    setProgress(newProgress);
    
    // Check for victory
    if (newProgress >= 100) {
      setGameState(GAME_STATE.VICTORY);
      return;
    }
    
    // Potentially trigger a new scenario for the next day
    const currentLandmark = getCurrentLandmark(newProgress, landmarks);
    
    // Chance to trigger a scenario at the start of a day
    if (Math.random() < SCENARIO_TRIGGER_CHANCE) {
      const newScenario = getRandomScenario(currentLandmark);
      if (newScenario) {
        setActiveScenario(newScenario);
      }
    }
    
    // Consume meals
    setMeals([]);
    setMealAssignments({});
    
    // Random new supplies
    const newInventory = {...inventory};
    const randomSupply = () => Math.floor(Math.random() * MAX_RANDOM_SUPPLY);
    newInventory.vegetables += randomSupply();
    newInventory.meat += randomSupply();
    newInventory.fish += randomSupply();
    newInventory.rice += randomSupply();
    newInventory.spices += randomSupply();
    setInventory(newInventory);
    
    setDay(day + 1);
    setGamePhase(1); // Reset to first phase of the day
  };
  
  // Advance to next game phase
  const advancePhase = () => {
    setGamePhase(current => (current < 4) ? current + 1 : 1);
    
    // If advancing to phase 1, it means we're starting a new day
    if (gamePhase === 4) {
      nextDay();
    }
  };
  // Calculate average crew hunger for display purposes
  const getAverageCrewHunger = () => {
    return crew.reduce((sum, member) => sum + member.hunger, 0) / crew.length;
  };
  
  // Reset the game
  const resetGame = () => {
    // Clear any active scenarios
    setActiveScenario(null);
    setScenarioResolved(false);
    setScenarioHistory([]);
    // Reset inventory using modular ingredient data
    setInventory(
      Object.fromEntries(
        Object.entries(ingredients).map(([item, data]) => [item, data.initialQuantity])
      )
    );
    
    // Reset meals
    setMeals([]);
    
    // Reset crew
    setCrew(initialCrew);
    
    // Reset progress and day
    setProgress(0);
    setDay(1);
    
    // Reset game phase
    setGamePhase(1);
    
    // Reset game state
    setGameState(GAME_STATE.PLAYING);
  };
  // Add to inventory function
  const addToInventory = (item, quantity) => {
    setInventory(prev => {
      if (recipes[item]) {
        // If it's a meal, add its ingredients back to the inventory
        let updatedInventory = { ...prev };
        Object.entries(recipes[item]).forEach(([ingredient, amount]) => {
          if (ingredient !== 'hungerValue') {
            updatedInventory[ingredient] = (updatedInventory[ingredient] || 0) + amount * quantity;
          }
        });
        return updatedInventory;
      } else if (ingredients[item]) {
        // If it's a defined ingredient, add it to the inventory
        return {
          ...prev,
          [item]: (prev[item] || 0) + quantity
        };
      } else {
        // If it's neither a meal nor a defined ingredient, log a warning and return the unchanged inventory
        console.warn(`Attempted to add unknown item "${item}" to inventory.`);
        return prev;
      }
    });
  };
  // Remove from inventory function
  const removeFromInventory = (item, quantity) => {
    setInventory(prev => {
      if (recipes[item]) {
        // If it's a meal, remove its ingredients from the inventory
        let updatedInventory = { ...prev };
        Object.entries(recipes[item]).forEach(([ingredient, amount]) => {
          if (ingredient !== 'hungerValue') {
            updatedInventory[ingredient] = Math.max(0, (updatedInventory[ingredient] || 0) - amount * quantity);
          }
        });
        return updatedInventory;
      } else if (ingredients[item]) {
        // If it's a defined ingredient, remove it from the inventory
        return {
          ...prev,
          [item]: Math.max(0, (prev[item] || 0) - quantity)
        };
      } else {
        // If it's neither a meal nor a defined ingredient, log a warning and return the unchanged inventory
        console.warn(`Attempted to remove unknown item "${item}" from inventory.`);
        return prev;
      }
    });
  };
  return (
    <GameContext.Provider value={{
      // UI state
      sidebarOpen,
      setSidebarOpen,
      
      // Game state
      inventory,
      meals,
      crew,
      setCrew,
      progress,
      day,
      gamePhase,
      gameState,
      GAME_STATE,
      recipes,
      canCraftRecipe,
      craftRecipe,
      feedCrew,
      nextDay,
      advancePhase,
      getAverageCrewHunger,
      resetGame,
      landmarks,
      activeScenario,
      chooseScenarioOption,
      clearScenario,
      scenarioResolved,
      scenarioHistory,
      mealAssignments,
      setGamePhase,
      addToInventory,
      removeFromInventory, // Add the new removeFromInventory function to the context
      getItemEmoji // Export the getItemEmoji function
    }}>
      {children}
    </GameContext.Provider>
  );
};