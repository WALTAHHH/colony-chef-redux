import React from 'react';
import Kitchen from './Kitchen';
import Status from './Status';
import MealAssignmentTable from './MealAssignmentTable';
import { GAME_STATES, GAME_PHASES } from '../data/gameConstants';
import { useGame } from '../context/GameContext';
import ScenarioModal from './ScenarioModal';
import PlanningPhase from './PlanningPhase';
import ActionPointsBar from './ActionPointsBar';
import { gameTheme } from '../theme/gameTheme';

const Game = () => {
  const { 
    progress, 
    gamePhase, 
    gameState, 
    GAME_STATE, 
    resetGame, 
    day,
    advancePhase,
    advanceDay,
  } = useGame();
  
  const { phase, state } = gameState;
  
  const gameStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: gameTheme.colors.background,
      ...gameTheme.common.pixelated,
      position: 'relative',
      ...gameTheme.common.noiseOverlay,
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      paddingBottom: '0',
      overflowY: 'auto',
    }
  };
  
  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: gameTheme.colors.panel,
    color: gameTheme.colors.text,
    borderBottom: `3px solid ${gameTheme.colors.border}`,
    ...gameTheme.common.panel,
  };
  
  const headerInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };
  
  const weatherDisplayStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: gameTheme.colors.panel,
    padding: '8px 12px',
    borderRadius: '4px',
    border: `2px solid ${gameTheme.colors.border}`,
  };
  
  const dayBadgeStyles = {
    backgroundColor: gameTheme.colors.highlightPrimary,
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: gameTheme.colors.background,
  };
  
  const phaseIndicatorStyles = {
    display: 'flex',
    gap: '8px'
  };

  const phaseStepStyles = {
    width: '30px',
    height: '30px',
    borderRadius: '4px',
    border: `2px solid ${gameTheme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  };

  const mainStyles = {
    flex: '1 0 auto',
    padding: '20px',
    overflowY: 'auto',
    ...gameTheme.common.panel,
    minHeight: 0,
  };

  const footerStyles = {
    backgroundColor: gameTheme.colors.panel,
    borderTop: `3px solid ${gameTheme.colors.border}`,
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...gameTheme.common.panel,
    flexShrink: 0,
    height: '50px',
  };

  const gameOverStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: gameTheme.colors.panel,
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    textAlign: 'center',
    color: gameTheme.colors.text,
    border: `4px solid ${gameTheme.colors.border}`,
    ...gameTheme.common.pixelated,
  };

  const gameOverButtonStyles = {
    ...gameTheme.common.button,
    marginTop: '20px',
  };

  const getFormattedDate = (dayNum) => {
    const startDate = new Date(2024, 0, 1);
    const currentDate = new Date(startDate.getTime() + (dayNum - 1) * 24 * 60 * 60 * 1000);
    return currentDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const currentWeather = {
    icon: '🌧️',
    desc: 'Rainy',
    temp: '65°F'
  };

  const renderPhaseContent = () => {
    switch (phase) {
      case GAME_PHASES.PLANNING:
        return <PlanningPhase />;
      case GAME_PHASES.ACTION:
        return <Kitchen />;
      case GAME_PHASES.SERVING:
        return <MealAssignmentTable />;
      case GAME_PHASES.END_OF_DAY:
        return <Status />;
      default:
        return null;
    }
  };

  const nextPhaseButtonStyles = {
    ...gameTheme.common.button,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: gameTheme.colors.highlightPrimary,
    color: gameTheme.colors.background,
    fontWeight: 'bold',
    marginLeft: 'auto',
  };

  const phaseInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: gameTheme.colors.text,
    fontSize: '14px',
  };

  const handleNextPhase = () => {
    if (phase === GAME_PHASES.END_OF_DAY) {
      advanceDay();
    } else {
      advancePhase();
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case GAME_PHASES.PLANNING:
        return 'Start Cooking →';
      case GAME_PHASES.ACTION:
        return 'Serve Meals →';
      case GAME_PHASES.SERVING:
        return 'End Day →';
      case GAME_PHASES.END_OF_DAY:
        return 'Next Day →';
      default:
        return 'Next Phase →';
    }
  };

  const getCurrentPhaseName = () => {
    switch (phase) {
      case GAME_PHASES.PLANNING:
        return 'Planning Phase';
      case GAME_PHASES.ACTION:
        return 'Action Phase';
      case GAME_PHASES.SERVING:
        return 'Serving Phase';
      case GAME_PHASES.END_OF_DAY:
        return 'End of Day';
      default:
        return 'Unknown Phase';
    }
  };

  return (
    <div style={gameStyles.container}>
      <header style={headerStyles}>
        <div style={headerInfoStyles}>
          <div style={dayBadgeStyles}>Day {day}</div>
          <div>{getFormattedDate(day)}</div>
        </div>
        <div style={phaseIndicatorStyles}>
          {[1, 2, 3, 4].map((phaseNum) => (
            <div
              key={phaseNum}
              style={{
                ...phaseStepStyles,
                backgroundColor: phase === phaseNum - 1 ? gameTheme.colors.highlightPrimary : 'transparent',
                color: phase === phaseNum - 1 ? gameTheme.colors.background : gameTheme.colors.text,
              }}
            >
              {phaseNum}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ActionPointsBar />
          <div style={weatherDisplayStyles}>
            <span style={{ fontSize: '24px' }}>{currentWeather.icon}</span>
            <div>
              <div>{currentWeather.desc}</div>
              <div style={{ fontSize: '14px' }}>{currentWeather.temp}</div>
            </div>
          </div>
        </div>
      </header>
      
      <main style={mainStyles}>
        {renderPhaseContent()}
      </main>
      
      {state === GAME_STATES.PLAYING && (
        <footer style={footerStyles}>
          <div style={phaseInfoStyles}>
            <span>Current Phase:</span>
            <strong>{getCurrentPhaseName()}</strong>
          </div>
          <button 
            onClick={handleNextPhase}
            style={nextPhaseButtonStyles}
          >
            {getPhaseText()}
          </button>
        </footer>
      )}
      
      {state === GAME_STATES.VICTORY && (
        <div style={gameOverStyles}>
          <h2>Victory!</h2>
          <p>You've successfully completed the expedition!</p>
          <p>Your cooking skills kept the crew well-fed and motivated.</p>
          <p>It took you {gameState.day} days to reach your destination.</p>
          <button onClick={resetGame} style={gameOverButtonStyles}>
            Play Again
          </button>
        </div>
      )}
      
      {state === GAME_STATES.DEFEAT && (
        <div style={gameOverStyles}>
          <h2>Expedition Failed</h2>
          <p>All your crew members are starving!</p>
          <p>The expedition has been abandoned on day {gameState.day}.</p>
          <p>Progress made: {Math.floor(gameState.progress)}%</p>
          <button onClick={resetGame} style={gameOverButtonStyles}>
            Try Again
          </button>
        </div>
      )}
      
      <ScenarioModal />
    </div>
  );
};

export default Game;