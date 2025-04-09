// Define all available recipes
export const recipes = {
  stew: {
    name: "Hearty Stew",
    description: "A warm and filling stew made with meat and vegetables",
    ingredients: {
      vegetables: 2,
      meat: 1,
      spices: 1
    },
    hungerValue: 25,
    moraleBonus: 5,
    preparationTime: 2,
    spoilageTime: 3, // Days until spoiled
    servings: 3, // Feeds 3 crew members
    spoiledStats: {
      name: "Spoiled Stew",
      description: "A rancid stew that's gone bad",
      hungerValue: 10,
      moraleBonus: -5,
      canCause: ["foodPoisoning", "nausea"]
    }
  },
  fishRice: {
    name: "Fish and Rice",
    description: "A simple but nutritious meal of fish and rice",
    ingredients: {
      fish: 1,
      rice: 2
    },
    hungerValue: 20,
    moraleBonus: 3,
    preparationTime: 1,
    spoilageTime: 2, // Fish spoils quickly
    servings: 2, // Feeds 2 crew members
    spoiledStats: {
      name: "Rotten Fish and Rice",
      description: "The fish has gone bad, making this inedible",
      hungerValue: 8,
      moraleBonus: -4,
      canCause: ["foodPoisoning"]
    }
  },
  curry: {
    name: "Spicy Curry",
    description: "A flavorful curry with meat and vegetables",
    ingredients: {
      vegetables: 1,
      meat: 1,
      rice: 1,
      spices: 2
    },
    hungerValue: 30,
    moraleBonus: 8,
    preparationTime: 3,
    spoilageTime: 4, // Spices help preserve
    servings: 4, // Feeds 4 crew members
    spoiledStats: {
      name: "Spoiled Curry",
      description: "Once aromatic curry that's now gone bad",
      hungerValue: 12,
      moraleBonus: -6,
      canCause: ["foodPoisoning", "nausea"]
    }
  },
  simpleSalad: {
    name: "Simple Salad",
    description: "A fresh salad made with vegetables",
    ingredients: {
      vegetables: 3
    },
    hungerValue: 15,
    moraleBonus: 2,
    preparationTime: 1,
    spoilageTime: 2, // Fresh veggies spoil quickly
    servings: 2, // Feeds 2 crew members
    spoiledStats: {
      name: "Wilted Salad",
      description: "A sad, wilted mess of vegetables",
      hungerValue: 5,
      moraleBonus: -2,
      canCause: ["nausea"]
    }
  },
  grilledFish: {
    name: "Grilled Fish",
    description: "Freshly caught fish grilled to perfection",
    ingredients: {
      fish: 2,
      spices: 1
    },
    hungerValue: 22,
    moraleBonus: 4,
    preparationTime: 2,
    spoilageTime: 2, // Fish spoils quickly
    servings: 2, // Feeds 2 crew members
    spoiledStats: {
      name: "Rotten Grilled Fish",
      description: "The grilled fish has gone bad",
      hungerValue: 8,
      moraleBonus: -4,
      canCause: ["foodPoisoning"]
    }
  },
  riceBowl: {
    name: "Rice Bowl",
    description: "A simple bowl of rice with vegetables",
    ingredients: {
      rice: 2,
      vegetables: 1
    },
    hungerValue: 18,
    moraleBonus: 2,
    preparationTime: 1,
    spoilageTime: 3, // Rice preserves decently
    servings: 2, // Feeds 2 crew members
    spoiledStats: {
      name: "Moldy Rice Bowl",
      description: "A bowl of rice that's started to mold",
      hungerValue: 8,
      moraleBonus: -2,
      canCause: ["nausea"]
    }
  }
};

// Helper function to get recipe by ID
export const getRecipe = (recipeId) => {
  return recipes[recipeId];
};

// Helper function to get spoiled version of a recipe
export const getSpoiledRecipe = (recipeId) => {
  const recipe = recipes[recipeId];
  if (!recipe || !recipe.spoiledStats) return null;
  
  return {
    ...recipe,
    ...recipe.spoiledStats,
    isSpoiled: true
  };
};

// Helper function to get all recipe IDs
export const getAllRecipeIds = () => {
  return Object.keys(recipes);
};

// Helper function to check if a recipe exists
export const recipeExists = (recipeId) => {
  return recipeId in recipes;
};