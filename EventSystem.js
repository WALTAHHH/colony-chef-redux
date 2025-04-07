import { scenarios } from 'ScenarioData';
import { getCurrentLandmark, getNextLandmark } from 'landmarkData';
const EVENT_TYPES = {
  RESOURCE: 'resource',
  CREW: 'crew',
  PROGRESS: 'progress',
  SCENARIO: 'scenario'
};
const generalEvents = [
  {
    type: EVENT_TYPES.RESOURCE,
    title: 'Abandoned Cache',
    description: 'Your crew stumbles upon an abandoned supply cache.',
    effect: (gameState) => {
      // Logic to add random resources
      return gameState;
    }
  },
  {
    type: EVENT_TYPES.CREW,
    title: 'Crew Dispute',
    description: 'A heated argument breaks out among the crew members.',
    effect: (gameState) => {
      // Logic to affect crew morale or status
      return gameState;
    }
  },
  {
    type: EVENT_TYPES.PROGRESS,
    title: 'Shortcut Discovered',
    description: 'Your scout finds a potential shortcut through difficult terrain.',
    effect: (gameState) => {
      // Logic to affect progress
      return gameState;
    }
  }
];
const allEvents = [...generalEvents, ...scenarios];
export const generateEvent = (gameState) => {
  const currentLandmark = getCurrentLandmark(gameState.progress, gameState.landmarks);
  const { inventory, crew, day } = gameState;
  
  // Filter events based on current landmark or general events
  const eligibleEvents = allEvents.filter(event => 
    event.type !== EVENT_TYPES.SCENARIO || event.landmark === null || event.landmark === currentLandmark.name
  );
  const randomIndex = Math.floor(Math.random() * eligibleEvents.length);
  const selectedEvent = eligibleEvents[randomIndex];
  
  // Add more detailed and specific information based on event type
  if (selectedEvent.type === EVENT_TYPES.SCENARIO) {
    return {
      ...selectedEvent,
      selectedChoice: null,
      type: EVENT_TYPES.SCENARIO,
      encounterDay: day,
      location: currentLandmark.name,
      possibleOutcomes: selectedEvent.choices.map(choice => ({
        description: choice.text,
        progressEffect: choice.outcome.progressBonus,
        hungerEffect: choice.outcome.hungerPenalty,
        inventoryEffect: choice.outcome.inventoryChanges,
        detailedEffects: {
          progressChange: `${choice.outcome.progressBonus > 0 ? '+' : ''}${choice.outcome.progressBonus}% journey progress`,
          hungerImpact: `${choice.outcome.hungerPenalty > 0 ? '-' : '+'}${Math.abs(choice.outcome.hungerPenalty)} hunger for all crew`,
          inventoryChanges: Object.entries(choice.outcome.inventoryChanges)
            .map(([item, change]) => `${change > 0 ? '+' : ''}${change} ${item}`)
            .join(', ') || 'No inventory changes'
        }
      }))
    };
  } else if (selectedEvent.type === EVENT_TYPES.RESOURCE) {
    // More specific resource event details based on current inventory
    const lowSupplies = Object.entries(inventory).filter(([_, amount]) => amount < 3);
    const resourceNeeds = lowSupplies.length > 0 
      ? lowSupplies.map(([item]) => item) 
      : Object.keys(inventory);
    
    return {
      ...selectedEvent,
      type: EVENT_TYPES.RESOURCE,
      encounterDay: day,
      location: currentLandmark.name,
      specificDescription: `The crew discovers a cache of supplies near ${currentLandmark.name}.`,
      possibleOutcomes: [
        { 
          resourceType: resourceNeeds[0] || 'vegetables', 
          exactAmount: Math.floor(Math.random() * 3) + 2,
          description: `Found some ${resourceNeeds[0] || 'vegetables'}`
        },
        { 
          resourceType: resourceNeeds.length > 1 ? resourceNeeds[1] : 'meat', 
          exactAmount: Math.floor(Math.random() * 2) + 1,
          description: `Discovered some ${resourceNeeds.length > 1 ? resourceNeeds[1] : 'meat'}`
        }
      ]
    };
  } else if (selectedEvent.type === EVENT_TYPES.CREW) {
    // More specific crew event details based on current crew state
    const lowestHungerMember = [...crew].sort((a, b) => a.hunger - b.hunger)[0];
    const highestHungerMember = [...crew].sort((a, b) => b.hunger - a.hunger)[0];
    
    return {
      ...selectedEvent,
      type: EVENT_TYPES.CREW,
      encounterDay: day,
      location: currentLandmark.name,
      specificDescription: `An event affects the crew's condition during the journey.`,
      affectedCrewMember: lowestHungerMember.hunger < 30 ? lowestHungerMember : highestHungerMember,
      possibleOutcomes: [
        { 
          effect: 'hunger',
          exactChange: lowestHungerMember.hunger < 30 ? 15 : -10,
          description: lowestHungerMember.hunger < 30 
            ? `${lowestHungerMember.name} found some berries and shared them` 
            : `${highestHungerMember.name} gave some of their rations to others`
        },
        { 
          effect: 'morale',
          exactChange: day % 2 === 0 ? 10 : -5,
          description: day % 2 === 0 
            ? 'The crew shares stories around the campfire, boosting morale' 
            : 'A minor disagreement affects the crew\'s mood'
        }
      ]
    };
  } else if (selectedEvent.type === EVENT_TYPES.PROGRESS) {
    // More specific progress event details based on current progress and landmark
    const isNearLandmark = Math.abs(gameState.progress - currentLandmark.position) < 5;
    const nextLandmark = getNextLandmark(gameState.progress, gameState.landmarks);
    
    return {
      ...selectedEvent,
      type: EVENT_TYPES.PROGRESS,
      encounterDay: day,
      location: currentLandmark.name,
      specificDescription: isNearLandmark 
        ? `The expedition considers paths forward from ${currentLandmark.name}.` 
        : `The journey towards ${nextLandmark.name} continues.`,
      weatherConditions: ['Clear skies', 'Overcast', 'Light rain', 'Foggy morning', 'Hot and humid'][Math.floor(Math.random() * 5)],
      possibleOutcomes: [
        { 
          effect: 'distance',
          exactChange: isNearLandmark ? 8 : 3,
          description: isNearLandmark 
            ? `Found a clear path beyond ${currentLandmark.name}, making excellent progress` 
            : 'The going is steady but challenging'
        },
        { 
          effect: 'time',
          exactChange: day % 3 === 0 ? 1 : -1,
          description: day % 3 === 0 
            ? 'Good weather allows for faster travel time' 
            : 'Difficult terrain slows the expedition'
        }
      ]
    };
  } else {
    // For any other event types, return with more specific default details
    return {
      ...selectedEvent,
      type: EVENT_TYPES.RESOURCE,
      encounterDay: day,
      location: currentLandmark.name,
      specificDescription: `An unexpected event occurs on day ${day} of the expedition.`,
      possibleOutcomes: [
        { 
          description: 'The unexpected situation is handled with minimal impact',
          exactAmount: 1,
          resourceType: 'spices' 
        }
      ]
    };
  }
};

export const applyEventEffect = (event, gameState) => {
  const { progress, crew, inventory } = gameState;
  let updatedProgress = progress;
  let updatedCrew = crew;
  let updatedInventory = { ...inventory };
  switch (event.type) {
    case EVENT_TYPES.SCENARIO:
      if (event.selectedChoice) {
        const outcome = event.selectedChoice.outcome;
        updatedProgress = Math.max(0, Math.min(100, progress + outcome.progressBonus));
        updatedCrew = crew.map(member => ({
          ...member,
          hunger: Math.max(0, Math.min(100, member.hunger - outcome.hungerPenalty))
        }));
        updatedInventory = Object.entries(outcome.inventoryChanges).reduce((inv, [item, change]) => {
          inv[item] = (inv[item] || 0) + change;
          return inv;
        }, updatedInventory);
      }
      break;
    case EVENT_TYPES.RESOURCE:
      if (event.possibleOutcomes && event.possibleOutcomes.length > 0) {
        const outcome = event.possibleOutcomes[Math.floor(Math.random() * event.possibleOutcomes.length)];
        const amount = Math.floor(Math.random() * (outcome.maxAmount - outcome.minAmount + 1)) + outcome.minAmount;
        updatedInventory[outcome.resourceType] = (updatedInventory[outcome.resourceType] || 0) + amount;
      }
      break;
    case EVENT_TYPES.CREW:
      if (event.possibleOutcomes && event.possibleOutcomes.length > 0) {
        const outcome = event.possibleOutcomes[Math.floor(Math.random() * event.possibleOutcomes.length)];
        const change = Math.floor(Math.random() * (outcome.maxChange - outcome.minChange + 1)) + outcome.minChange;
        updatedCrew = crew.map(member => ({
          ...member,
          [outcome.effect]: Math.max(0, Math.min(100, member[outcome.effect] + change))
        }));
      }
      break;
    case EVENT_TYPES.PROGRESS:
      if (event.possibleOutcomes && event.possibleOutcomes.length > 0) {
        const outcome = event.possibleOutcomes[Math.floor(Math.random() * event.possibleOutcomes.length)];
        const change = Math.floor(Math.random() * (outcome.maxChange - outcome.minChange + 1)) + outcome.minChange;
        if (outcome.effect === 'distance') {
          updatedProgress = Math.max(0, Math.min(100, progress + change));
        } else if (outcome.effect === 'time') {
          // Implement time effect if needed
        }
      }
      break;
    default:
      console.warn(`Unknown event type: ${event.type}`);
  }
  return {
    ...gameState,
    progress: updatedProgress,
    crew: updatedCrew,
    inventory: updatedInventory
  };
};