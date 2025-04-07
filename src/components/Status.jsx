import React from 'react';
import { useGameState } from '../contexts/GameContext';
import CrewStatus from './crewStatus';
import ExpeditionMap from './ExpeditionMap';
import ScenarioHistory from './ScenarioHistory';
import MealAssignmentTable from './MealAssignmentTable';

const Status = () => {
  const { 
    gamePhase,
    day,
    progressToNext,
    setGamePhase
  } = useGameState();
  
  const statusStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    marginBottom: '10px'
  };
  
  const sectionStyles = {
    backgroundColor: '#efebe9',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  const progressBarContainerStyles = {
    width: '100%',
    height: '20px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '5px'
  };
  
  const progressBarStyles = {
    height: '100%',
    backgroundColor: '#2196f3',
    width: `${progressToNext}%`,
    transition: 'width 0.5s'
  };
  
  const buttonStyles = {
    backgroundColor: '#8d6e63',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px'
  };
  
  const disabledButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#d7ccc8',
    cursor: 'not-allowed'
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
              <div style={progressBarContainerStyles}>
                <div style={progressBarStyles}></div>
              </div>
              <p>{Math.floor(progressToNext)}% complete</p>
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
              style={progressToNext > 0 ? {...buttonStyles, flex: 1} : {...disabledButtonStyles, flex: 1}}
              onClick={() => setGamePhase(3)}
              disabled={progressToNext === 0}
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
            <button style={{...buttonStyles, flex: 1}} onClick={() => setGamePhase(4)}>
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
              onClick={() => setGamePhase(prev => Math.min(4, prev + 1))}
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