import { recipes } from './recipeData';
// Define the predefined crew
const predefinedCrew = [
  {
    id: 1,
    name: "Captain Maria",
    role: "Captain",
    hunger: 70,
    morale: 85,
    preferences: { favorite: "curry", disliked: "simpleSalad" },
    traits: ["Leadership", "Disciplined", "Optimistic"],
    avatar: "👩‍✈️"
  },
  {
    id: 2,
    name: "Doc Wilson",
    role: "Medic",
    hunger: 65,
    morale: 75,
    preferences: { favorite: "fishRice", disliked: "stew" },
    traits: ["Caring", "Precise", "Empathetic"],
    avatar: "👨‍⚕️"
  },
  {
    id: 3,
    name: "Engineer Patel",
    role: "Engineer",
    hunger: 80,
    morale: 70,
    preferences: { favorite: "stew", disliked: "curry" },
    traits: ["Resourceful", "Hardworking", "Innovative"],
    avatar: "👩‍🔧"
  },
  {
    id: 4,
    name: "Scout Chen",
    role: "Scout",
    hunger: 60,
    morale: 80,
    preferences: { favorite: "simpleSalad", disliked: "fishRice" },
    traits: ["Observant", "Agile", "Adventurous"],
    avatar: "🧭"
  }
];
const roles = ["Explorer", "Botanist", "Geologist", "Technician", "Cook", "Security"];
const avatars = ["👨‍🚀", "👩‍🚀", "👨‍🔬", "👩‍🔬", "👨‍🍳", "👩‍🍳", "🕵️‍♂️", "🕵️‍♀️"];
const traits = ["Optimistic", "Pessimistic", "Hardworking", "Lazy", "Innovative", "Cautious", "Adventurous", "Empathetic"];
export const generateRandomCrew = (count) => {
  const generatedCrew = [];
  for (let i = 0; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    const crewTraits = [];
    for (let j = 0; j < 3; j++) {
      const trait = traits[Math.floor(Math.random() * traits.length)];
      if (!crewTraits.includes(trait)) {
        crewTraits.push(trait);
      }
    }
    const recipeNames = Object.keys(recipes);
    const favorite = recipeNames[Math.floor(Math.random() * recipeNames.length)];
    let disliked;
    do {
      disliked = recipeNames[Math.floor(Math.random() * recipeNames.length)];
    } while (disliked === favorite);
    generatedCrew.push({
      id: predefinedCrew.length + i + 1,
      name: `Crew Member ${predefinedCrew.length + i + 1}`,
      role: role,
      hunger: Math.floor(Math.random() * 30) + 60, // Random hunger between 60 and 90
      morale: Math.floor(Math.random() * 30) + 60, // Random morale between 60 and 90
      preferences: { favorite, disliked },
      traits: crewTraits,
      avatar: avatar
    });
  }
  return generatedCrew;
};
export const traitEffects = {
  Optimistic: { moraleChange: 2 },
  Pessimistic: { moraleChange: -2 },
  Empathetic: { moraleBoost: 1 },
  Innovative: { problemSolvingBonus: 1 },
  Adventurous: { explorationBonus: 1 }
};
// Generate 2 random crew members to add to the initial crew
const randomCrew = generateRandomCrew(2);
// Export the combined crew
export const initialCrew = [...predefinedCrew, ...randomCrew];

// Define all available crew roles
export const crewRoles = {
  engineer: {
    name: "Engineer",
    description: "Maintains and repairs colony equipment",
    baseHunger: 20,
    favoriteMeals: ["curry", "stew"],
    dislikedMeals: ["simpleSalad"]
  },
  scientist: {
    name: "Scientist",
    description: "Conducts research and experiments",
    baseHunger: 15,
    favoriteMeals: ["fishRice", "grilledFish"],
    dislikedMeals: ["riceBowl"]
  },
  farmer: {
    name: "Farmer",
    description: "Grows and harvests food",
    baseHunger: 25,
    favoriteMeals: ["stew", "riceBowl"],
    dislikedMeals: ["grilledFish"]
  },
  medic: {
    name: "Medic",
    description: "Provides medical care to the crew",
    baseHunger: 18,
    favoriteMeals: ["simpleSalad", "fishRice"],
    dislikedMeals: ["curry"]
  }
};

// Helper function to get crew role by ID
export const getCrewRole = (roleId) => {
  return crewRoles[roleId];
};

// Helper function to get all crew role IDs
export const getAllCrewRoleIds = () => {
  return Object.keys(crewRoles);
};

// Helper function to check if a crew role exists
export const crewRoleExists = (roleId) => {
  return roleId in crewRoles;
};

// Helper function to generate a random crew member
export const generateRandomCrewMember = () => {
  const roleIds = getAllCrewRoleIds();
  const roleId = roleIds[Math.floor(Math.random() * roleIds.length)];
  const role = crewRoles[roleId];

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `Crew Member ${Math.floor(Math.random() * 1000)}`,
    role: roleId,
    hunger: role.baseHunger,
    morale: 50
  };
};