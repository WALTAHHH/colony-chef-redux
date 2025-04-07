import React from 'react';
import { useGameState } from 'GameContext';
import { getCurrentLandmark, getNextLandmark } from 'landmarkData';

const ExpeditionMap = () => {
  const { progress, day, landmarks, gamePhase } = useGameState();
  
  const mapContainerStyles = {
    padding: '15px',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: gamePhase === 1 ? '420px' : '320px',
    transition: 'min-height 0.3s ease',
    border: '2px solid #8b4513',
    backgroundImage: 'url(https://play.rosebud.ai/assets/ChatGPT Image Apr 5, 2025, 07_27_02 PM.png?IGrZ)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };
  
  // Use the imported helper functions from landmarkData.js
  const currentLandmark = getCurrentLandmark(progress, landmarks);
  const nextLandmark = getNextLandmark(progress, landmarks);
  
  // Calculate distance to next landmark
  const distanceToNext = nextLandmark.position - currentLandmark.position;
  const progressToNext = distanceToNext > 0 
    ? ((progress - currentLandmark.position) / distanceToNext) * 100 
    : 100;
  
  const pathStyles = {
    position: 'absolute',
    height: '8px',
    backgroundColor: 'rgba(215, 204, 200, 0.7)',
    top: '135px',
    left: '50px',
    right: '50px',
    borderRadius: '4px',
    zIndex: 1
  };
  
  const progressPathStyles = {
    position: 'absolute',
    height: '8px',
    backgroundColor: 'rgba(141, 110, 99, 0.8)',
    top: '135px',
    left: '50px',
    width: `${progress}%`,
    borderRadius: '4px',
    zIndex: 2
  };
  
  const currentPositionStyles = {
    position: 'absolute',
    zIndex: 5,
    top: '120px',
    left: `calc(50px + ${progress}% * 0.83)`,
    transform: 'translateX(-50%)',
    fontSize: '26px',
    filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))'
  };
  
  const landmarkStyles = (position) => ({
    position: 'absolute',
    zIndex: 4,
    top: '120px',
    left: `calc(50px + ${position}% * 0.83)`,
    transform: 'translateX(-50%)',
    fontSize: '26px',
    filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))'
  });
  
  const landmarkLabelStyles = (position) => ({
    position: 'absolute',
    top: '155px',
    left: `calc(50px + ${position}% * 0.83)`,
    transform: 'translateX(-50%)',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '85px',
    color: '#3e2723',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '2px 4px',
    borderRadius: '4px'
  });
  
  const infoBoxStyles = {
    backgroundColor: 'rgba(255, 243, 224, 0.85)',
    padding: '8px 12px',
    borderRadius: '6px',
    marginTop: 'auto',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    border: '1px solid #8b4513',
    fontSize: '14px',
    maxHeight: gamePhase === 1 ? '200px' : '110px',
    transition: 'max-height 0.3s ease',
    overflow: 'auto'
  };
  
  const mapTitleStyles = {
    color: '#3e2723',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 243, 224, 0.85)',
    padding: '5px 10px',
    borderRadius: '6px',
    marginBottom: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    border: '1px solid #8b4513',
    alignSelf: 'center'
  };
  
  return (
    <div style={mapContainerStyles}>
      <h2 style={mapTitleStyles}>
        {gamePhase === 1 ? 'Expedition Planning Map' : 'Expedition Map'}
      </h2>
      
      <div style={pathStyles}></div>
      <div style={progressPathStyles}></div>
      
      {landmarks.map(landmark => (
        <React.Fragment key={landmark.name}>
          <div style={landmarkStyles(landmark.position)}>
            {landmark.emoji}
          </div>
          <div style={landmarkLabelStyles(landmark.position)}>
            {landmark.name}
          </div>
        </React.Fragment>
      ))}
      
      <div style={currentPositionStyles}>🧭</div>
      
      <div style={infoBoxStyles}>
        <div><strong>Current Location:</strong> {currentLandmark.name}</div>
        <div><strong>Next Landmark:</strong> {nextLandmark.name}</div>
        <div><strong>Journey Progress:</strong> {Math.floor(progress)}%</div>
        <div><strong>Days Traveled:</strong> {day}</div>
        
        {gamePhase === 1 && (
          <div style={{ marginTop: '10px', borderTop: '1px solid #8b4513', paddingTop: '10px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#5d4037' }}>Expedition Planning</h4>
            <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
              <p>You're about to embark on a crucial day of your frontier journey. As the expedition's cook, your role is vital for the crew's morale and survival.</p>
              <p>Today's estimated travel distance: <strong>{5 + Math.floor(Math.random() * 8)} miles</strong></p>
              <p>Terrain ahead: <strong>{currentLandmark.name === 'Base Camp' ? 'flatlands leading to forest' : 
                currentLandmark.name === 'Dense Forest' ? 'thick woodland and occasional clearings' :
                currentLandmark.name === 'Mountain Pass' ? 'rocky inclines and narrow paths' :
                currentLandmark.name === 'River Crossing' ? 'riverbanks and potential ford points' :
                currentLandmark.name === 'Ancient Ruins' ? 'crumbling structures and overgrown paths' :
                'varied wilderness'}</strong></p>
              <p>Weather forecast: <strong>{['Clear skies', 'Partly cloudy', 'Overcast', 'Light rain possible', 'Foggy morning'][Math.floor(Math.random() * 5)]}</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpeditionMap;