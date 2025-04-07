import React from 'react';
import { useGameState } from '../contexts/GameContext';

const ScenarioHistory = () => {
  const { scenarioHistory } = useGameState();
  
  const historyContainerStyles = {
    backgroundColor: '#efebe9',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'auto'
  };
  
  if (!scenarioHistory || scenarioHistory.length === 0) {
    return (
      <div style={historyContainerStyles}>
        <h2>Journey Log</h2>
        <p style={{ color: '#777', fontStyle: 'italic' }}>
          Your journey has just begun. Decisions you make will appear here.
        </p>
      </div>
    );
  }
  
  const eventStyles = {
    borderLeft: '3px solid #8d6e63',
    padding: '10px 15px',
    margin: '10px 0',
    backgroundColor: '#fff',
    borderRadius: '0 5px 5px 0',
    position: 'relative'
  };
  
  const dayLabelStyles = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '3px 8px',
    backgroundColor: '#5d4037',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px'
  };
  
  const choiceStyles = {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    marginTop: '8px',
    borderRadius: '5px'
  };
  
  const locationStyles = {
    color: '#8d6e63',
    fontWeight: 'bold',
    marginBottom: '5px'
  };
  
  const getEventIcon = (scenarioId) => {
    const iconMap = {
      'dense_forest': '🌲',
      'mountain_pass': '⛰️',
      'river_crossing': '🌊',
      'ancient_ruins': '🏛️',
      'hunting_opportunity': '🏹',
      'wild_berries': '🍒',
      'bad_weather': '🌧️'
    };
    
    return iconMap[scenarioId] || '📜';
  };
  
  return (
    <div style={historyContainerStyles}>
      <h2>Journey Log</h2>
      
      {scenarioHistory.map((event, index) => (
        <div key={index} style={eventStyles}>
          <div style={dayLabelStyles}>Day {event.day}</div>
          
          <div style={locationStyles}>
            {getEventIcon(event.scenario.id)} {event.location}
          </div>
          
          <p><strong>{event.scenario.title}</strong></p>
          <p>{event.scenario.description}</p>
          
          <div style={choiceStyles}>
            <p>
              <strong>Your choice:</strong> {event.scenario.choices[event.choiceIndex].text}
            </p>
            <p>
              <strong>Outcome:</strong> {event.scenario.choices[event.choiceIndex].outcome.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScenarioHistory;