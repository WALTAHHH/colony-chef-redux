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
    preparationTime: 2
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
    preparationTime: 1
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
    preparationTime: 3
  },
  simpleSalad: {
    name: "Simple Salad",
    description: "A fresh salad made with vegetables",
    ingredients: {
      vegetables: 3
    },
    hungerValue: 15,
    moraleBonus: 2,
    preparationTime: 1
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
    preparationTime: 2
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
    preparationTime: 1
  }
};

// Helper function to get recipe by ID
export const getRecipe = (recipeId) => {
  return recipes[recipeId];
};

// Helper function to get all recipe IDs
export const getAllRecipeIds = () => {
  return Object.keys(recipes);
};

// Helper function to check if a recipe exists
export const recipeExists = (recipeId) => {
  return recipeId in recipes;
};