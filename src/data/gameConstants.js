// Game state constants
export const GAME_STATES = {
  PLAYING: 'PLAYING',
  VICTORY: 'VICTORY',
  DEFEAT: 'DEFEAT'
};

// Game phase constants
export const GAME_PHASES = {
  PLANNING: 0,
  ACTION: 1,
  SERVING: 2,
  END_OF_DAY: 3
};

// Action Points constants
export const ACTION_POINTS = {
  MAX_AP: 10,
  DEFAULT_MEAL_COST: 2
};

// Hunger constants
export const HUNGER = {
  MAX_HUNGER: 100,
  BASE_HUNGER_DECREASE: 10,
  HUNGER_BONUS: {
    ENGINEER: 5,
    SCIENTIST: 3,
    FARMER: 7,
    MEDIC: 4
  }
};

// Meal preference modifiers
export const MEAL_PREFERENCES = {
  FAVORITE_MEAL_BONUS: 15,
  DISLIKED_MEAL_PENALTY: -10
};

// Progress constants
export const PROGRESS = {
  MAX_DAILY_PROGRESS: 100,
  BASE_DAILY_PROGRESS: 10,
  PROGRESS_BONUS: {
    HIGH_MORALE: 5,
    LOW_MORALE: -5
  }
};

// Scenario constants
export const SCENARIO = {
  TRIGGER_CHANCE: 0.3,
  HUNGER_PENALTY: -10,
  MORALE_PENALTY: -15
};

// Inventory constants
export const INVENTORY = {
  MAX_RANDOM_SUPPLY: 5,
  INITIAL_SUPPLY_MULTIPLIER: 2
};

// Crew constants
export const CREW = {
  MAX_CREW_SIZE: 10,
  MIN_CREW_SIZE: 3,
  MORALE: {
    MAX_MORALE: 100,
    MIN_MORALE: 0,
    BASE_MORALE_CHANGE: 5
  }
};