// Define initial inventory
export const initialInventory = {
    vegetables: 5,
    meat: 3,
    fish: 2,
    rice: 4,
    spices: 3
  };
  
  // Define ingredient emoji map
  export const ingredientEmojiMap = {
    vegetables: '🥕',
    meat: '🥩',
    fish: '🐟',
    rice: '🍚',
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
  
  import { addItems, removeItems } from 'inventoryUtils';
  // Helper function to add items to inventory
  export const addToInventory = (inventory, item, quantity) => {
    return addItems(inventory, { [item]: quantity });
  };
  // Helper function to remove items from inventory
  export const removeFromInventory = (inventory, item, quantity) => {
    return removeItems(inventory, { [item]: quantity });
  };