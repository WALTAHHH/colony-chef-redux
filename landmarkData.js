// Define landmarks for scenarios and map
export const landmarks = [
    { position: 0, name: "Base Camp", emoji: "⛺" },
    { position: 20, name: "Dense Forest", emoji: "🌲" },
    { position: 40, name: "Mountain Pass", emoji: "⛰️" },
    { position: 60, name: "River Crossing", emoji: "🌊" },
    { position: 80, name: "Ancient Ruins", emoji: "🏛️" },
    { position: 100, name: "Destination", emoji: "🏁" }
  ];
  
  // Helper function to get current landmark based on progress
  export const getCurrentLandmark = (progress, landmarks) => {
    for (let i = landmarks.length - 1; i >= 0; i--) {
      if (progress >= landmarks[i].position) {
        return landmarks[i];
      }
    }
    return landmarks[0];
  };
  
  // Helper function to get next landmark based on progress
  export const getNextLandmark = (progress, landmarks) => {
    for (let i = 0; i < landmarks.length; i++) {
      if (progress < landmarks[i].position) {
        return landmarks[i];
      }
    }
    return landmarks[landmarks.length - 1];
  };