import React from 'react';
import { useGame } from '../context/GameContext';

const ScenarioModal = ({ scenario, onClose }) => {
  const { 
    getScenarioIcon,
    handleScenarioChoice
  } = useGame();

  // eslint-disable-next-line no-unused-vars
  const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  // eslint-disable-next-line no-unused-vars
  const contentStyles = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
  };
  
  if (!scenario) return null;
  
  const modalOverlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  };
  
  const modalContentStyles = {
    backgroundColor: '#d2b48c', // Parchment color
    backgroundImage: `
      radial-gradient(circle, transparent 20%, #d2b48c 20%, #d2b48c 80%, transparent 80%, transparent),
      radial-gradient(circle, transparent 20%, #d2b48c 20%, #d2b48c 80%, transparent 80%, transparent)
    `,
    backgroundSize: '40px 40px',
    backgroundPosition: '0 0, 20px 20px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5), inset 0 0 100px rgba(120, 100, 80, 0.2)',
    border: '3px solid #8b4513',
    padding: '25px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    position: 'relative',
    color: '#3e2723'
  };
  
  const titleStyles = {
    borderBottom: '2px solid #8b4513',
    paddingBottom: '12px',
    marginBottom: '20px',
    color: '#3e2723',
    fontSize: '28px',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadow: '1px 1px 1px rgba(0,0,0,0.2)'
  };
  
  const descriptionStyles = {
    marginBottom: '25px',
    fontSize: '17px',
    lineHeight: '1.6',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
    border: '1px solid rgba(139, 69, 19, 0.3)'
  };
  
  const choiceButtonStyles = {
    display: 'block',
    width: '100%',
    padding: '15px 20px',
    marginBottom: '15px',
    backgroundColor: '#8b4513',
    color: '#f9f3e5',
    border: '2px solid #5d4037',
    borderRadius: '8px',
    fontSize: '17px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    position: 'relative',
    overflow: 'hidden'
  };
  
  const choiceButtonHoverStyle = {
    ':hover': {
      backgroundColor: '#a0522d',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
    }
  };
  
  const continueButtonStyles = {
    display: 'block',
    width: '100%',
    padding: '15px 20px',
    marginTop: '25px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: '2px solid #2e7d32',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  };
  
  const outcomeStyles = {
    backgroundColor: 'rgba(239, 235, 233, 0.8)',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '25px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    border: '1px solid #8b4513',
    position: 'relative',
    fontStyle: 'italic'
  };
  
  const scenarioIconStyle = {
    position: 'absolute',
    top: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '30px',
    backgroundColor: '#d2b48c',
    borderRadius: '50%',
    padding: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  };
  
  return (
    <div style={modalOverlayStyles}>
      <div style={modalContentStyles}>
        <div style={scenarioIconStyle}>
          {getScenarioIcon(scenario.id)}
        </div>
        <h2 style={titleStyles}>{scenario.title}</h2>
        
        <div style={descriptionStyles}>
          {scenario.description}
        </div>
        
        {!scenario.resolved ? (
          <div>
            {scenario.choices.map((choice, index) => (
              <button
                key={index}
                style={{
                  ...choiceButtonStyles,
                  ...choiceButtonHoverStyle
                }}
                onClick={() => handleScenarioChoice(index)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#a0522d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#8b4513';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                }}
              >
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div style={outcomeStyles}>
              <p><strong>Outcome:</strong> {scenario.outcomeDescription}</p>
            </div>
            <button
              style={continueButtonStyles}
              onClick={onClose}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#57c65c';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#4caf50';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
              }}
            >
              Continue Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioModal;