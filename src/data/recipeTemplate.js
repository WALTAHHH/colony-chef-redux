// Template for adding new recipes
// Copy this template and modify the values to create new recipes

const newRecipe = {
  // Required properties
  name: "Recipe Name",           // Display name of the recipe
  description: "Description",    // Brief description of the meal
  
  // Gameplay properties
  ingredients: {                // Required ingredients and quantities
    ingredient1: 1,            // ingredient ID and required amount
    ingredient2: 2
  },
  hungerValue: 20,             // How much hunger this meal satisfies
  moraleBonus: 5,              // Bonus to crew morale when eaten
  preparationTime: 2,          // Time units needed to prepare
  
  // Optional properties (add as needed)
  difficulty: "easy",          // easy, medium, hard
  category: "main",            // main, side, dessert, snack
  specialEffects: [],          // Array of special effects this meal provides
  requiredSkill: null,         // Required cooking skill level (if any)
  experienceGain: 10,          // Experience points gained from cooking
  unlockLevel: 1,              // Level at which this recipe becomes available
  seasonal: false,             // Whether this recipe is seasonal
  season: "all",               // If seasonal, which season(s) it's available in
  variants: []                 // Array of possible ingredient substitutions
};

// Example of a complete recipe:
const exampleRecipe = {
  name: "Space Tacos",
  description: "A fusion of Earth's favorite handheld meal with space-grown ingredients",
  ingredients: {
    vegetables: 2,
    meat: 1,
    spices: 2
  },
  hungerValue: 25,
  moraleBonus: 8,
  preparationTime: 3,
  difficulty: "medium",
  category: "main",
  specialEffects: ["morale_boost", "team_bonding"],
  requiredSkill: 2,
  experienceGain: 15,
  unlockLevel: 3,
  seasonal: false,
  variants: [
    {
      name: "Vegetarian Space Tacos",
      ingredients: {
        vegetables: 3,
        spices: 2
      },
      hungerValue: 20,
      moraleBonus: 6
    }
  ]
};

// After creating a new recipe:
// 1. Add it to the recipes object in recipeData.js
// 2. Add its emoji to the recipeEmojiMap (if different from default)
// 3. Update any unlock conditions or progression requirements 