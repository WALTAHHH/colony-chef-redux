# Recipe System Documentation

## Overview
Recipes define the meals that can be prepared in the game. Each recipe specifies required ingredients, preparation time, and the effects it has on the crew.

## Required Properties

### Basic Information
- `name`: The display name of the recipe
- `description`: A brief description of the meal and its effects

### Gameplay Properties
- `ingredients`: Object mapping ingredient IDs to required quantities
  - Example: `{ vegetables: 2, meat: 1 }`
  - All ingredients must exist in the ingredient system
- `hungerValue`: How much hunger this meal satisfies (typically 15-30)
- `moraleBonus`: Bonus to crew morale when eaten (typically 2-10)
- `preparationTime`: Time units needed to prepare (typically 1-3)

## Optional Properties

### Categorization
- `difficulty`: How challenging the recipe is to prepare
  - Options: easy, medium, hard
  - Affects success chance and experience gain
- `category`: Type of meal
  - Options: main, side, dessert, snack
  - Helps with meal planning and UI organization

### Progression
- `requiredSkill`: Minimum cooking skill level needed
  - null = no requirement
  - Higher levels unlock more complex recipes
- `experienceGain`: XP awarded for successfully preparing
  - Typically 10-20 for basic recipes
  - More for complex or special recipes
- `unlockLevel`: Level at which recipe becomes available
  - 1 = available from start
  - Higher levels require progression

### Special Properties
- `specialEffects`: Array of special effects this meal provides
  - Examples: ["morale_boost", "healing", "energy_boost"]
  - Can stack with ingredient effects
- `seasonal`: Whether the recipe is only available in certain seasons
- `season`: If seasonal, which season(s) it's available in
  - Options: all, spring, summer, fall, winter
- `variants`: Array of alternative versions of the recipe
  - Allows for ingredient substitutions
  - Can have different effects/values

## Adding New Recipes

1. Use the template in `recipeTemplate.js` as a reference
2. Add your new recipe to the `recipes` object in `recipeData.js`
3. Add an emoji for your recipe to the `recipeEmojiMap` (if different from default)
4. Update any progression or unlock requirements

## Balance Guidelines

### Hunger Values
- Snacks: 10-15
- Sides: 15-20
- Main dishes: 20-30
- Special/Feast dishes: 30+

### Morale Bonuses
- Basic meals: 2-4
- Well-prepared meals: 5-7
- Special/Feast dishes: 8-10

### Preparation Times
- Quick meals: 1 unit
- Standard meals: 2 units
- Complex meals: 3 units
- Special/Feast dishes: 4+ units

### Experience Gain
- Basic recipes: 10 XP
- Intermediate recipes: 15 XP
- Advanced recipes: 20 XP
- Special recipes: 25+ XP

## Example Recipes

### Basic Recipe
```javascript
{
  name: "Simple Salad",
  description: "A fresh salad made with vegetables",
  ingredients: {
    vegetables: 3
  },
  hungerValue: 15,
  moraleBonus: 2,
  preparationTime: 1,
  difficulty: "easy",
  category: "side"
}
```

### Complex Recipe
```javascript
{
  name: "Festive Space Feast",
  description: "A celebratory meal combining the best of space-grown ingredients",
  ingredients: {
    vegetables: 3,
    meat: 2,
    fish: 1,
    rice: 2,
    spices: 3
  },
  hungerValue: 35,
  moraleBonus: 10,
  preparationTime: 4,
  difficulty: "hard",
  category: "main",
  specialEffects: ["morale_boost", "team_bonding", "celebration"],
  requiredSkill: 5,
  experienceGain: 30,
  unlockLevel: 10,
  seasonal: true,
  season: "winter",
  variants: [
    {
      name: "Vegetarian Feast",
      ingredients: {
        vegetables: 5,
        rice: 3,
        spices: 3
      },
      hungerValue: 30,
      moraleBonus: 8
    }
  ]
}
```

## Recipe Variants
Recipe variants allow for alternative versions of the same basic meal, typically with different ingredients or effects. When creating variants:

1. Include only the properties that differ from the base recipe
2. Maintain the same general theme and category
3. Balance the hunger/morale values appropriately
4. Consider the availability of alternative ingredients

Example variant structure:
```javascript
variants: [
  {
    name: "Alternative Name",
    ingredients: {
      // Only include changed ingredients
      alternativeIngredient: 2
    },
    hungerValue: 20,    // Adjusted value
    moraleBonus: 5,     // Adjusted value
    specialEffects: []  // Different effects if any
  }
]
``` 