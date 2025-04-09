import { addItems, removeItems } from '../utils/inventoryUtils';

// Define all available ingredients
export const ingredients = {
  vegetables: {
    name: "Vegetables",
    description: "Fresh vegetables from the colony's hydroponic gardens",
    baseValue: 5,
    spoilageRate: 0.2,
    storageSpace: 1,
    initialQuantity: 5
  },
  meat: {
    name: "Meat",
    description: "Protein-rich meat from the colony's livestock",
    baseValue: 8,
    spoilageRate: 0.3,
    storageSpace: 1,
    initialQuantity: 3
  },
  fish: {
    name: "Fish",
    description: "Freshly caught fish from the colony's aquaculture",
    baseValue: 7,
    spoilageRate: 0.4,
    storageSpace: 1,
    initialQuantity: 2
  },
  rice: {
    name: "Rice",
    description: "Staple grain grown in the colony's fields",
    baseValue: 3,
    spoilageRate: 0.1,
    storageSpace: 1,
    initialQuantity: 4
  },
  spices: {
    name: "Spices",
    description: "Flavorful seasonings to enhance meals",
    baseValue: 4,
    spoilageRate: 0.1,
    storageSpace: 1,
    initialQuantity: 3
  }
};

// Define ingredient emoji map
export const ingredientEmojiMap = {
  vegetables: '🥕',
  meat: '🥩',
  fish: '🐟',
  rice: '��',
  spices: '🌶️',
  stew: '🍲',
  fishRice: '🍣',
  curry: '🍛',
  simpleSalad: '🥗'
};

// Helper function to get emoji for an item
export const getItemEmoji = (item) => {
  return ingredientEmojiMap[item] || '📦';
};

// Helper function to add items to inventory
export const addToInventory = (inventory, item, quantity) => {
  return addItems(inventory, { [item]: quantity });
};

// Helper function to remove items from inventory
export const removeFromInventory = (inventory, item, quantity) => {
  return removeItems(inventory, { [item]: quantity });
};

// Helper function to get ingredient by ID
export const getIngredient = (ingredientId) => {
  return ingredients[ingredientId];
};

// Helper function to get all ingredient IDs
export const getAllIngredientIds = () => {
  return Object.keys(ingredients);
};

// Helper function to check if an ingredient exists
export const ingredientExists = (ingredientId) => {
  return ingredientId in ingredients;
};