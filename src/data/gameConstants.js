// Game State Constants
export const GAME_STATE = {
    PLAYING: 'playing',
    VICTORY: 'victory',
    DEFEAT: 'defeat'
  };
  
  // Hunger Constants
  export const MAX_HUNGER = 100;
  export const BASE_HUNGER_DECREASE = 25;
  export const HARDWORKING_HUNGER_BONUS = 10;
  export const AGILE_HUNGER_BONUS = 5;
  export const DISCIPLINED_HUNGER_BONUS = 5;
  
  // Meal Preference Modifiers
  export const FAVORITE_MEAL_BONUS = 1.5;
  export const DISLIKED_MEAL_PENALTY = 0.7;
  
  // Progress Constants
  export const MAX_DAILY_PROGRESS = 20;
  
  // Scenario Constants
  export const SCENARIO_TRIGGER_CHANCE = 0.7;
  
  // Inventory Constants
  export const MAX_RANDOM_SUPPLY = 3;
  
  // Game Phases
  export const GAME_PHASES = {
    PLANNING: 1,
    PREPARATION: 2,
    SERVING: 3,
    END_OF_DAY: 4
  };