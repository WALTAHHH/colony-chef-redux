import React from 'react';
import { useGameState } from 'GameContext';
import CrewStatus from 'CrewStatus';
import ExpeditionMap from 'ExpeditionMap';
import ScenarioHistory from 'ScenarioHistory';
import MealAssignmentTable from 'MealAssignmentTable';
const Status = () => {
  const { 
    crew,
    getAverageCrewHunger,
    progress, 
    day,
    gamePhase,
    setGamePhase,
    feedCrew, 
    nextDay,
    advancePhase,
    meals
  } = useGameState();
  
  const averageHunger = getAverageCrewHunger();
  
  const statusStyles = {
    flex: '1',
    backgroundColor: '#d7ccc8',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    height: '95%'
  };
  // Remove any potential fixed-positioned elements
  React.useEffect(() => {
    // Add styles to ensure no fixed elements at bottom of screen
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      body::after {
        content: none !important;
        display: none !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  const sectionStyles = {
    backgroundColor: '#efebe9',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  const barContainerStyles = {
    width: '100%',
    height: '20px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
    margin: '10px 0'
  };
  
  const hungerBarStyles = {
    height: '100%',
    backgroundColor: averageHunger > 60 ? '#4caf50' : averageHunger > 30 ? '#ff9800' : '#f44336',
    width: `${averageHunger}%`,
    transition: 'width 0.5s, background-color 0.5s'
  };
  
  const progressBarStyles = {
    height: '100%',
    backgroundColor: '#2196f3',
    width: `${progress}%`,
    transition: 'width 0.5s'
  };
  
  const buttonStyles = {
    backgroundColor: '#5d4037',
    color: 'white',
    border: 'none',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '5px',
    transition: 'background-color 0.2s'
  };
  
  const disabledButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  };
  
  const getHungerMessage = () => {
    if (averageHunger > 70) return 'The crew is well-fed and happy!';
    if (averageHunger > 40) return 'The crew could use some more food soon.';
    if (averageHunger > 10) return 'The crew is getting very hungry. Feed them quickly!';
    return 'The crew is starving! They can barely continue!';
  };
  
  const getPhaseDescription = () => {
    switch(gamePhase) {
      case 1: return "Planning Phase - Review your crew and plan for the day";
      case 2: return "Preparation Phase - Gather ingredients and prepare meals";
      case 3: return "Serving Phase - Feed your crew";
      case 4: return "End of Day - Review results and prepare for tomorrow";
      default: return "";
    }
  };
  
  return (
    <div style={statusStyles}>
      {gamePhase !== 3 && (
        <>
          <div style={sectionStyles}>
            <h2>Expedition Status</h2>
            <div>
              <h3>Day {day} - {getPhaseDescription()}</h3>
              <p>Progress:</p>
              <div style={barContainerStyles}>
                <div style={progressBarStyles}></div>
              </div>
              <p>{Math.floor(progress)}% complete</p>
            </div>
          </div>
          
          <ExpeditionMap />
        </>
      )}
      
      <ScenarioHistory />
      
      {(gamePhase === 3 || gamePhase === 4) && (
        <div style={{
          backgroundColor: '#ffecb3',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
          border: '1px solid #e6c35a'
        }}>
          <h2 style={{ color: '#5d4037', marginTop: 0, marginBottom: '15px', borderBottom: '2px solid #e6c35a', paddingBottom: '10px' }}>
            {gamePhase === 3 ? 'Meal Assignment' : 'Meal Assignment Results'}
          </h2>
          {gamePhase === 3 && (
            <p style={{ fontSize: '16px', color: '#5d4037', marginBottom: '20px', backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '10px', borderRadius: '5px' }}>
              Assign meals to your crew members to satisfy their hunger and maintain morale.
            </p>
          )}
          <MealAssignmentTable />
        </div>
      )}
      
      {gamePhase !== 1 && gamePhase !== 3 && gamePhase !== 4 && <CrewStatus />}
      <div style={{ marginTop: 'auto' }}>
        {gamePhase === 3 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              style={{
                ...buttonStyles,
                backgroundColor: '#795548',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 15px'
              }} 
              onClick={() => setGamePhase(2)}
              title="Go back to preparation phase"
            >
              <span style={{ fontSize: '20px', marginRight: '5px' }}>←</span> Back
            </button>
            <button 
              style={meals.length > 0 ? {...buttonStyles, flex: 1} : {...disabledButtonStyles, flex: 1}}
              onClick={feedCrew}
              disabled={meals.length === 0}
            >
              Complete Meal Service
            </button>
          </div>
        )}
        
        {gamePhase === 4 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              style={{
                ...buttonStyles,
                backgroundColor: '#795548',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 15px'
              }} 
              onClick={() => setGamePhase(3)}
              title="Go back to serving phase"
            >
              <span style={{ fontSize: '20px', marginRight: '5px' }}>←</span> Back
            </button>
            <button style={{...buttonStyles, flex: 1}} onClick={nextDay}>
              Start Next Day
            </button>
          </div>
        )}
        
        {(gamePhase === 1 || gamePhase === 2) && (
          <div style={{ display: 'flex', gap: '10px' }}>
            {gamePhase !== 1 && (
              <button 
                style={{
                  ...buttonStyles,
                  backgroundColor: '#795548',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 15px'
                }} 
                onClick={() => setGamePhase(prev => Math.max(1, prev - 1))}
                title="Go back to previous phase"
              >
                <span style={{ fontSize: '20px', marginRight: '5px' }}>←</span> Back
              </button>
            )}
            <button 
              style={{ ...buttonStyles, flex: 1 }} 
              onClick={advancePhase}
            >
              {gamePhase === 1 ? "Prepare Meals" : "Serve Food"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Status;