// Template for adding new ingredients
// Copy this template and modify the values to create new ingredients

const newIngredient = {
  // Required properties
  name: "Ingredient Name",        // Display name of the ingredient
  description: "Description",     // Brief description of the ingredient
  
  // Gameplay properties
  baseValue: 5,                  // Base value of the ingredient (affects meal value)
  spoilageRate: 0.2,            // How quickly the ingredient spoils (0-1)
  storageSpace: 1,              // How much storage space this ingredient takes
  initialQuantity: 3,           // Starting quantity in inventory
  
  // Optional properties (add as needed)
  rarity: "common",             // common, uncommon, rare, etc.
  season: "all",                // all, spring, summer, fall, winter
  source: "garden",             // garden, livestock, fishing, foraging, etc.
  specialEffects: [],           // Array of special effects this ingredient can add to meals
};

// After creating a new ingredient:
// 1. Add it to the ingredients object in ingredientData.js
// 2. Add its emoji to the ingredientEmojiMap
// 3. Update any recipes that use this ingredient

// Example of a complete ingredient:
const exampleIngredient = {
  name: "Tomatoes",
  description: "Juicy red tomatoes grown in the colony's hydroponic gardens",
  baseValue: 4,
  spoilageRate: 0.3,
  storageSpace: 1,
  initialQuantity: 4,
  rarity: "common",
  season: "summer",
  source: "garden",
  specialEffects: ["freshness", "acidity"]
};

// Example of adding to ingredientEmojiMap:
// tomatoes: '🍅' 