# Ingredient System Documentation

## Overview
Ingredients are the basic building blocks of meals in the game. Each ingredient has properties that affect how it can be used in recipes and how it behaves in the game world.

## Required Properties

### Basic Information
- `name`: The display name of the ingredient
- `description`: A brief description of the ingredient and its source

### Gameplay Properties
- `baseValue`: The base value of the ingredient (typically 3-10)
  - Affects the overall value of meals made with this ingredient
  - Higher value ingredients should be rarer or harder to obtain
- `spoilageRate`: How quickly the ingredient spoils (0-1)
  - 0 = never spoils
  - 1 = spoils very quickly
  - Typical range: 0.1-0.4
- `storageSpace`: How much inventory space the ingredient takes (typically 1)
- `initialQuantity`: Starting quantity in the player's inventory

## Optional Properties

### Categorization
- `rarity`: How common the ingredient is
  - Options: common, uncommon, rare, legendary
  - Affects spawn rates and availability
- `season`: When the ingredient is available
  - Options: all, spring, summer, fall, winter
  - Use "all" for ingredients available year-round
- `source`: Where the ingredient comes from
  - Options: garden, livestock, fishing, foraging, etc.
  - Helps categorize ingredients for UI and gameplay mechanics

### Special Properties
- `specialEffects`: Array of special effects this ingredient can add to meals
  - Examples: ["freshness", "spiciness", "healing", "morale_boost"]
  - These can be used to create unique meal combinations

## Adding New Ingredients

1. Use the template in `ingredientTemplate.js` as a reference
2. Add your new ingredient to the `ingredients` object in `ingredientData.js`
3. Add an emoji for your ingredient to the `ingredientEmojiMap`
4. Update any recipes that should use the new ingredient

## Balance Guidelines

### Base Values
- Common ingredients: 3-5
- Uncommon ingredients: 6-8
- Rare ingredients: 9-10

### Spoilage Rates
- Non-perishable: 0.1
- Long-lasting: 0.2
- Perishable: 0.3
- Very perishable: 0.4

### Initial Quantities
- Common ingredients: 3-5
- Uncommon ingredients: 1-2
- Rare ingredients: 0-1

## Example Ingredients

### Basic Ingredient
```javascript
{
  name: "Carrots",
  description: "Fresh carrots from the colony's gardens",
  baseValue: 3,
  spoilageRate: 0.2,
  storageSpace: 1,
  initialQuantity: 4,
  rarity: "common",
  season: "all",
  source: "garden"
}
```

### Special Ingredient
```javascript
{
  name: "Space Truffle",
  description: "A rare fungus that grows in zero-gravity conditions",
  baseValue: 9,
  spoilageRate: 0.4,
  storageSpace: 1,
  initialQuantity: 1,
  rarity: "rare",
  season: "all",
  source: "foraging",
  specialEffects: ["luxury", "morale_boost"]
}
```

## Art Assets

### Replacing Emojis with Custom Art
The game currently uses emojis as placeholders for ingredient icons. To replace these with custom art assets:

1. Create art assets following these specifications:
   - Format: PNG with transparency
   - Size: 32x32 pixels (1x) and 64x64 pixels (2x) for retina displays
   - Style: Consistent with the game's pixel art aesthetic
   - Color palette: Use the game's established color scheme
   - File naming: `ingredient_[name].png` (e.g., `ingredient_tomato.png`)

2. Place the assets in the appropriate directory:
   ```
   src/assets/ingredients/
   ├── 1x/
   │   ├── ingredient_tomato.png
   │   ├── ingredient_carrot.png
   │   └── ...
   └── 2x/
       ├── ingredient_tomato.png
       ├── ingredient_carrot.png
       └── ...
   ```

3. Update the `ingredientEmojiMap` in `ingredientData.js` to use the new assets:
   ```javascript
   // Before:
   export const ingredientEmojiMap = {
     tomato: '🍅',
     carrot: '🥕'
   };

   // After:
   export const ingredientEmojiMap = {
     tomato: 'ingredient_tomato',
     carrot: 'ingredient_carrot'
   };
   ```

4. Update the component that displays ingredients to use the new assets:
   ```javascript
   // Example of how to use the new assets
   <img 
     src={`/assets/ingredients/${ingredientEmojiMap[itemId]}.png`}
     srcSet={`/assets/ingredients/1x/${ingredientEmojiMap[itemId]}.png 1x,
              /assets/ingredients/2x/${ingredientEmojiMap[itemId]}.png 2x`}
     alt={ingredient.name}
     style={{ width: '32px', height: '32px' }}
   />
   ```

### Art Style Guidelines
- Maintain consistent lighting (top-down)
- Use a limited color palette (max 16 colors per sprite)
- Keep details minimal but recognizable
- Ensure good contrast for visibility
- Use pixel-perfect alignment
- Maintain consistent stroke width (1-2 pixels)
- Include a 1-pixel transparent border around the sprite

### Animation Considerations
If you plan to add animations later:
- Keep the base sprite centered in the frame
- Leave room for animation frames (typically 2-3 frames)
- Consider creating a separate animation map:
  ```javascript
  export const ingredientAnimations = {
    tomato: {
      idle: ['ingredient_tomato_1', 'ingredient_tomato_2'],
      harvest: ['ingredient_tomato_harvest_1', 'ingredient_tomato_harvest_2']
    }
  };
  ``` 