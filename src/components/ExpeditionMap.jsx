import React from 'react';
import { useGame } from '../context/GameContext';
import { landmarks } from '../data/landmarkData';

const ExpeditionMap = () => {
  const { progressToNext } = useGame();

  const mapContainerStyles = {
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative',
    height: '100px',
    overflow: 'hidden'
  };

  const progressBarStyles = {
    position: 'absolute',
    top: '50%',
    left: '0',
    height: '4px',
    backgroundColor: '#4caf50',
    width: `${progressToNext}%`,
    transform: 'translateY(-50%)',
    transition: 'width 0.5s ease',
    zIndex: 1
  };

  const landmarksContainerStyles = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px'
  };

  const landmarkStyles = (position) => ({
    position: 'absolute',
    left: `${position}%`,
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2
  });

  const landmarkEmojiStyles = {
    fontSize: '24px',
    marginBottom: '5px'
  };

  const landmarkNameStyles = {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    maxWidth: '80px',
    wordBreak: 'break-word'
  };

  const currentPositionStyles = {
    position: 'absolute',
    left: `${progressToNext}%`,
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '20px',
    height: '20px',
    backgroundColor: '#f44336',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 0 0 2px #f44336',
    zIndex: 3
  };

  return (
    <div style={mapContainerStyles}>
      <div style={progressBarStyles}></div>
      <div style={currentPositionStyles}></div>
      <div style={landmarksContainerStyles}>
        {landmarks.map((landmark) => (
          <div key={landmark.name} style={landmarkStyles(landmark.position)}>
            <div style={landmarkEmojiStyles}>{landmark.emoji}</div>
            <div style={landmarkNameStyles}>{landmark.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpeditionMap;