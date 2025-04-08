import React from 'react';
import { useGame } from '../context/GameContext';
import { SCENARIO } from '../data/gameConstants';

const ScenarioHistory = () => {
  const { gameState } = useGame();
  const { scenarios } = gameState;

  const getScenarioColor = (type) => {
    switch (type) {
      case 'positive':
        return '#4CAF50';
      case 'negative':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  return (
    <div style={containerStyles}>
      <h3 style={titleStyles}>Scenario History</h3>
      <div style={scenariosStyles}>
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            style={{
              ...scenarioStyles,
              borderLeft: `4px solid ${getScenarioColor(scenario.type)}`
            }}
          >
            <div style={scenarioHeaderStyles}>
              <div style={scenarioTitleStyles}>{scenario.title}</div>
              <div style={scenarioDateStyles}>Day {scenario.day}</div>
            </div>
            <div style={scenarioDescriptionStyles}>
              {scenario.description}
            </div>
            {scenario.effects && (
              <div style={effectsStyles}>
                {Object.entries(scenario.effects).map(([effect, value]) => (
                  <div key={effect} style={effectStyles}>
                    <span style={effectLabelStyles}>{effect}:</span>
                    <span
                      style={{
                        ...effectValueStyles,
                        color: value > 0 ? '#4CAF50' : '#F44336'
                      }}
                    >
                      {value > 0 ? `+${value}` : value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const containerStyles = {
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginTop: '20px'
};

const titleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
  color: '#333'
};

const scenariosStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const scenarioStyles = {
  padding: '15px',
  backgroundColor: '#f9f9f9',
  borderRadius: '4px',
  transition: 'transform 0.2s',
  ':hover': {
    transform: 'translateX(5px)'
  }
};

const scenarioHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const scenarioTitleStyles = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333'
};

const scenarioDateStyles = {
  fontSize: '14px',
  color: '#666'
};

const scenarioDescriptionStyles = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '10px'
};

const effectsStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px'
};

const effectStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
};

const effectLabelStyles = {
  fontSize: '14px',
  color: '#666'
};

const effectValueStyles = {
  fontSize: '14px',
  fontWeight: 'bold'
};

export default ScenarioHistory;