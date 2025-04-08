// Utility functions for inventory management

/**
 * Add items to inventory with validation
 * @param {Object} inventory - Current inventory object
 * @param {Object} items - Object containing items to add (key: itemName, value: quantity)
 * @returns {Object} Updated inventory
 */
export const addItems = (inventory, items) => {
  const newInventory = { ...inventory };
  for (const [item, quantity] of Object.entries(items)) {
    newInventory[item] = (newInventory[item] || 0) + quantity;
  }
  return newInventory;
};

/**
 * Remove items from inventory with validation
 * @param {Object} inventory - Current inventory object
 * @param {Object} items - Object containing items to remove (key: itemName, value: quantity)
 * @returns {Object} Updated inventory
 */
export const removeItems = (inventory, items) => {
  const newInventory = { ...inventory };
  for (const [item, quantity] of Object.entries(items)) {
    if (!newInventory[item] || newInventory[item] < quantity) {
      throw new Error(`Not enough ${item} in inventory`);
    }
    newInventory[item] -= quantity;
    if (newInventory[item] === 0) {
      delete newInventory[item];
    }
  }
  return newInventory;
};

/**
 * Check if inventory has sufficient items
 * @param {Object} inventory - Current inventory object
 * @param {Object} requiredItems - Object containing required items (key: itemName, value: quantity)
 * @returns {Boolean} True if inventory has all required items in sufficient quantities
 */
export const hasItems = (inventory, requiredItems) => {
  return !requiredItems || typeof requiredItems !== 'object' || 
    Object.entries(requiredItems).every(
      ([item, quantity]) => (inventory[item] || 0) >= quantity
    );
};

// Helper function to get total items in inventory
export const getTotalItems = (inventory) => {
  return Object.values(inventory).reduce((sum, quantity) => sum + quantity, 0);
};

// Helper function to get inventory space used
export const getInventorySpaceUsed = (inventory, ingredients) => {
  let spaceUsed = 0;
  for (const [item, quantity] of Object.entries(inventory)) {
    const ingredient = ingredients[item];
    if (ingredient) {
      spaceUsed += quantity * ingredient.storageSpace;
    }
  }
  return spaceUsed;
};

// Helper function to check if inventory is full
export const isInventoryFull = (inventory, ingredients, maxSpace) => {
  return getInventorySpaceUsed(inventory, ingredients) >= maxSpace;
};