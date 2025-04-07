import React from 'react';
import Kitchen from './Kitchen';
import Status from './Status';
import ScenarioModal from './ScenarioModal';
import MenuButton from './MenuButton';
import { useGameState } from '../contexts/GameContext';

const Game = () => {
  const { 
    progress, 
    gamePhase, 
    gameState, 
    GAME_STATE, 
    resetGame, 
    day, 
    setSidebarOpen 
  } = useGameState();
  
  const gameStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f3e5',
    color: '#5d4037',
    overflow: 'hidden'
  };
  
  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#5d4037',
    color: '#f9f3e5',
    borderBottom: '3px solid #8d6e63'
  };
  const menuToggleStyles = {
    backgroundColor: '#8d6e63',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '10px'
  };
  
  const headerInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };
  
  const weatherDisplayStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  };
  
  const dayBadgeStyles = {
    backgroundColor: '#8d6e63',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 'bold'
  };
  
  const phaseIndicatorStyles = {
    display: 'flex',
    gap: '5px'
  };
  
  const phaseStepStyles = {
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    border: '1px solid #f9f3e5'
  };
  
  const mainStyles = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
    minHeight: '0',
    maxHeight: 'calc(100vh - 60px)' // Subtract header height
  };
  const gameOverStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    zIndex: 100
  };
  
  const gameOverButtonStyles = {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    fontSize: '18px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '30px',
    transition: 'background-color 0.3s'
  };
// Get day of week name based on day number
const getDayOfWeek = (dayNum) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[(dayNum - 1) % 7];
};
// Get weather based on day number (simplified random but consistent weather per day)
const getWeather = (dayNum) => {
  const weathers = [
    { icon: '☀️', temp: '78°F', desc: 'Sunny' },
    { icon: '⛅', temp: '72°F', desc: 'Partly Cloudy' },
    { icon: '☁️', temp: '68°F', desc: 'Cloudy' },
    { icon: '🌧️', temp: '65°F', desc: 'Rainy' },
    { icon: '⛈️', temp: '63°F', desc: 'Stormy' },
    { icon: '🌫️', temp: '69°F', desc: 'Foggy' },
    { icon: '🌤️', temp: '75°F', desc: 'Mostly Sunny' }
  ];
  const weatherIndex = (dayNum * 3) % weathers.length;
  return weathers[weatherIndex];
};
const currentWeather = getWeather(day);
const getFormattedDate = (dayNum) => {
  const startDate = new Date(2024, 0, 1); // Assuming the expedition starts on January 1, 2024
  const currentDate = new Date(startDate.getTime() + (dayNum - 1) * 24 * 60 * 60 * 1000);
  return currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};
return (
    <div style={gameStyles}>
      <header style={headerStyles}>
        <div style={headerInfoStyles}>
          <button 
            style={menuToggleStyles}
            onClick={() => setSidebarOpen(true)}
          >
            ☰ Menu
          </button>
          <div style={dayBadgeStyles}>Day {day}</div>
          <div>
            {getDayOfWeek(day)}<br />
            {getFormattedDate(day)}
          </div>
        </div>
        <div style={phaseIndicatorStyles}>
          {[1, 2, 3, 4].map((phase) => (
            <div
              key={phase}
              style={{
                ...phaseStepStyles,
                backgroundColor: gamePhase === phase ? '#4caf50' : 'transparent'
              }}
            >
              {phase}
            </div>
          ))}
        </div>
        <div style={weatherDisplayStyles}>
          <span style={{ fontSize: '24px' }}>{currentWeather.icon}</span>
          <div>
            <div>{currentWeather.desc}</div>
            <div style={{ fontSize: '14px' }}>{currentWeather.temp}</div>
          </div>
        </div>
      </header>
      
      <main style={mainStyles}>
        {gamePhase === 2 && <Kitchen />}
        {gamePhase === 3 && <Status />}
        {(gamePhase === 1 || gamePhase === 4) && <Status />}
      </main>
      
      {gameState === GAME_STATE.VICTORY && (
        <div style={gameOverStyles}>
          <h2>Victory!</h2>
          <p>You've successfully completed the expedition!</p>
          <p>Your cooking skills kept the crew well-fed and motivated.</p>
          <p>It took you {day} days to reach your destination.</p>
          <button onClick={resetGame} style={gameOverButtonStyles}>
            Play Again
          </button>
        </div>
      )}
      
      {gameState === GAME_STATE.DEFEAT && (
        <div style={gameOverStyles}>
          <h2>Expedition Failed</h2>
          <p>All your crew members are starving!</p>
          <p>The expedition has been abandoned on day {day}.</p>
          <p>Progress made: {Math.floor(progress)}%</p>
          <button onClick={resetGame} style={gameOverButtonStyles}>
            Try Again
          </button>
        </div>
      )}
      
      <ScenarioModal />
      <MenuButton />
    </div>
  );
};

export default Game;