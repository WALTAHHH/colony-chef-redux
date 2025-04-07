// Scenario events that can occur during the expedition
export const scenarios = [
    {
      id: 'dense_forest',
      title: 'Dense Forest Shortcut',
      description: 'Your scout has found a potential shortcut through the dense forest, but it might be risky.',
      landmark: 'Dense Forest',
      choices: [
        {
          text: 'Take the shortcut',
          outcome: {
            description: 'The shortcut was indeed faster, but the difficult terrain made everyone hungrier.',
            progressBonus: 5,
            hungerPenalty: 15,
            inventoryChanges: {}
          }
        },
        {
          text: 'Stick to the main path',
          outcome: {
            description: 'The main path was longer but safer. The crew found some wild vegetables along the way.',
            progressBonus: -1,
            hungerPenalty: 5,
            inventoryChanges: { vegetables: 2 }
          }
        }
      ]
    },
    {
      id: 'mountain_pass',
      title: 'Mountain Pass Decision',
      description: 'The mountain pass ahead is steep. You can take an easier route that requires more food, or push hard through the difficult path.',
      landmark: 'Mountain Pass',
      choices: [
        {
          text: 'Take the easier route',
          outcome: {
            description: 'The easier route saved energy but took longer. The crew needed more food along the way.',
            progressBonus: -2,
            hungerPenalty: 20,
            inventoryChanges: { meat: -1, vegetables: -1 }
          }
        },
        {
          text: 'Push through the difficult path',
          outcome: {
            description: 'The difficult path was exhausting but quick. Everyone is very hungry now.',
            progressBonus: 7,
            hungerPenalty: 25,
            inventoryChanges: {}
          }
        }
      ]
    },
    {
      id: 'river_crossing',
      title: 'River Crossing Challenge',
      description: 'A wide river blocks your path. You can build a raft (requiring time and energy) or search for a bridge that might be miles away.',
      landmark: 'River Crossing',
      choices: [
        {
          text: 'Build a raft',
          outcome: {
            description: 'Building the raft was hard work, but crossing the river was quick. The crew is tired and hungry.',
            progressBonus: 3,
            hungerPenalty: 18,
            inventoryChanges: {}
          }
        },
        {
          text: 'Search for a bridge',
          outcome: {
            description: 'You found a bridge! The detour took time, but you discovered an abandoned campsite with supplies.',
            progressBonus: -3,
            hungerPenalty: 10,
            inventoryChanges: { spices: 2, rice: 1, fish: 1 }
          }
        }
      ]
    },
    {
      id: 'ancient_ruins',
      title: 'Ancient Ruins Discovery',
      description: 'Your expedition has discovered ancient ruins. Explore them for potential supplies, or bypass them to save time?',
      landmark: 'Ancient Ruins',
      choices: [
        {
          text: 'Explore the ruins',
          outcome: {
            description: 'The ruins contained preserved food stores! Your supply situation has improved dramatically.',
            progressBonus: -2,
            hungerPenalty: 12,
            inventoryChanges: { meat: 2, vegetables: 3, spices: 2 }
          }
        },
        {
          text: 'Bypass the ruins',
          outcome: {
            description: 'Bypassing the ruins saved time, but the crew is disappointed about missing the opportunity.',
            progressBonus: 4,
            hungerPenalty: 15,
            inventoryChanges: {}
          }
        }
      ]
    },
    {
      id: 'hunting_opportunity',
      title: 'Hunting Opportunity',
      description: 'Your scout has spotted game animals nearby. Take time to hunt or continue marching?',
      landmark: null, // Can happen anywhere
      choices: [
        {
          text: 'Stop to hunt',
          outcome: {
            description: 'The hunting was successful! Fresh meat will boost morale.',
            progressBonus: -1,
            hungerPenalty: 5,
            inventoryChanges: { meat: 3 }
          }
        },
        {
          text: 'Continue marching',
          outcome: {
            description: 'You pressed on, making good time but missing the food opportunity.',
            progressBonus: 2,
            hungerPenalty: 12,
            inventoryChanges: {}
          }
        }
      ]
    },
    {
      id: 'wild_berries',
      title: 'Wild Berry Patch',
      description: 'You\'ve found a patch of wild berries. They look edible, but no one is certain.',
      landmark: null, // Can happen anywhere
      choices: [
        {
          text: 'Gather and eat the berries',
          outcome: {
            description: 'The berries were nutritious and delicious! Everyone feels better.',
            progressBonus: 0,
            hungerPenalty: -10, // Reduces hunger
            inventoryChanges: {}
          }
        },
        {
          text: 'Ignore the berries',
          outcome: {
            description: 'Better safe than sorry. You continue your journey without incident.',
            progressBonus: 1,
            hungerPenalty: 8,
            inventoryChanges: {}
          }
        }
      ]
    },
    {
      id: 'bad_weather',
      title: 'Approaching Storm',
      description: 'Dark clouds are gathering. Set up camp early or try to push through before the storm hits?',
      landmark: null, // Can happen anywhere
      choices: [
        {
          text: 'Set up camp early',
          outcome: {
            description: 'You set up camp just in time. The storm passed overnight, and everyone rested well.',
            progressBonus: -2,
            hungerPenalty: 10,
            inventoryChanges: {}
          }
        },
        {
          text: 'Push through the storm',
          outcome: {
            description: 'The storm was brutal. Everyone got soaked and is exhausted, but you covered more ground.',
            progressBonus: 1,
            hungerPenalty: 20,
            inventoryChanges: {}
          }
        }
      ]
    }
  ];
  
  // Helper function to get a random scenario
  export const getRandomScenario = (currentLandmark) => {
    // Filter scenarios by current landmark or get general scenarios
    const eligibleScenarios = scenarios.filter(scenario => 
      scenario.landmark === null || scenario.landmark === currentLandmark.name
    );
    
    // If no eligible scenarios, return null
    if (eligibleScenarios.length === 0) return null;
    
    // Return a random scenario from eligible ones
    return eligibleScenarios[Math.floor(Math.random() * eligibleScenarios.length)];
  };