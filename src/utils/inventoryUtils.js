// Utility functions for inventory management

/**
 * Add items to inventory with validation
 * @param {Object} inventory - Current inventory object
 * @param {Object} items - Object containing items to add (key: itemName, value: quantity)
 * @returns {Object} Updated inventory
 */
export const addItems = (inventory, items) => {
    if (!items || typeof items !== 'object') return inventory;
    
    const newInventory = { ...inventory };
    
    Object.entries(items).forEach(([item, quantity]) => {
      if (quantity <= 0) return; // Skip non-positive quantities
      
      newInventory[item] = (newInventory[item] || 0) + quantity;
    });
    
    return newInventory;
  };
  
  /**
   * Remove items from inventory with validation
   * @param {Object} inventory - Current inventory object
   * @param {Object} items - Object containing items to remove (key: itemName, value: quantity)
   * @returns {Object} Updated inventory
   */
  export const removeItems = (inventory, items) => {
    if (!items || typeof items !== 'object') return inventory;
    
    const newInventory = { ...inventory };
    
    Object.entries(items).forEach(([item, quantity]) => {
      if (quantity <= 0 || !newInventory[item]) return; // Skip non-positive quantities or missing items
      
      newInventory[item] = Math.max(0, newInventory[item] - quantity);
      
      // Remove the item completely if quantity is 0
      if (newInventory[item] === 0) {
        delete newInventory[item];
      }
    });
    
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