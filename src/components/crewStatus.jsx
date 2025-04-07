import React from 'react';
import { useGameState } from '../contexts/GameContext';

const CrewStatus = () => {
  const { crew } = useGameState();
  
  const crewContainerStyles = {
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: '#efebe9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  const crewGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
    marginTop: '10px'
  };
  
  const crewMemberStyles = {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column'
  };
  
  const avatarStyles = {
    fontSize: '2em',
    marginBottom: '5px',
    textAlign: 'center'
  };
  
  const hungerBarContainerStyles = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    margin: '8px 0'
  };
  
  const getHungerBarStyles = (hunger) => ({
    height: '100%',
    backgroundColor: hunger > 60 ? '#4caf50' : hunger > 30 ? '#ff9800' : '#f44336',
    width: `${hunger}%`,
    transition: 'width 0.5s, background-color 0.5s'
  });
  
  const getHungerText = (hunger) => {
    if (hunger > 70) return 'Well fed';
    if (hunger > 40) return 'Hungry';
    if (hunger > 10) return 'Very hungry';
    return 'Starving!';
  };
  
  const getMoraleText = (morale) => {
    if (morale > 70) return 'High spirits';
    if (morale > 40) return 'Content';
    if (morale > 10) return 'Discouraged';
    return 'Demoralized';
  };
  
  return (
    <div style={crewContainerStyles}>
      <h2>Expedition Crew</h2>
      <div style={crewGridStyles}>
        {crew.map(member => (
          <div key={member.id} style={crewMemberStyles}>
            <div style={avatarStyles}>{member.avatar}</div>
            <div style={{ fontWeight: 'bold' }}>{member.name}</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>{member.role}</div>
            
            <div style={hungerBarContainerStyles}>
              <div style={getHungerBarStyles(member.hunger)}></div>
            </div>
            <div style={{ fontSize: '0.8em', display: 'flex', justifyContent: 'space-between' }}>
              <span>Hunger: {member.hunger}%</span>
              <span>{getHungerText(member.hunger)}</span>
            </div>
            
            <div style={hungerBarContainerStyles}>
              <div style={{
                height: '100%',
                backgroundColor: member.morale > 60 ? '#4caf50' : member.morale > 30 ? '#ff9800' : '#f44336',
                width: `${member.morale}%`,
                transition: 'width 0.5s, background-color 0.5s'
              }}></div>
            </div>
            <div style={{ fontSize: '0.8em', display: 'flex', justifyContent: 'space-between' }}>
              <span>Morale: {member.morale}%</span>
              <span>{getMoraleText(member.morale)}</span>
            </div>
            
            <div style={{ fontSize: '0.8em', marginTop: '5px' }}>
              <div>❤️ {member.preferences.favorite}</div>
              <div>👎 {member.preferences.disliked}</div>
              <div>{member.traits.join(", ")}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrewStatus;