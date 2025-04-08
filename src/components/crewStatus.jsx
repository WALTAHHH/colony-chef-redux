import React from 'react';
import { useGame } from '../context/GameContext';
import { crewRoles } from '../data/crewData';
import { HUNGER } from '../data/gameConstants';

const CrewStatus = () => {
  const { gameState } = useGame();
  const { crew } = gameState;

  const getHungerColor = (hunger) => {
    if (hunger > 70) return '#4CAF50';
    if (hunger > 40) return '#FFC107';
    return '#F44336';
  };

  const getHungerLabel = (hunger) => {
    if (hunger > 70) return 'Well Fed';
    if (hunger > 40) return 'Hungry';
    return 'Starving';
  };

  return (
    <div style={containerStyles}>
      <h3 style={titleStyles}>Crew Status</h3>
      <div style={crewStyles}>
        {crew.map((member) => {
          const role = crewRoles[member.role];
          return (
            <div key={member.id} style={memberStyles}>
              <div style={memberHeaderStyles}>
                <div style={memberNameStyles}>{member.name}</div>
                <div style={memberRoleStyles}>{role?.name}</div>
              </div>
              <div style={memberDescriptionStyles}>
                {role?.description}
              </div>
              <div style={hungerStyles}>
                <div style={hungerLabelStyles}>
                  Hunger: {getHungerLabel(member.hunger)}
                </div>
                <div style={hungerBarStyles}>
                  <div
                    style={{
                      ...hungerFillStyles,
                      width: `${member.hunger}%`,
                      backgroundColor: getHungerColor(member.hunger)
                    }}
                  />
                </div>
                <div style={hungerValueStyles}>{member.hunger}%</div>
              </div>
              <div style={preferencesStyles}>
                <div style={preferencesTitleStyles}>Meal Preferences</div>
                <div style={preferencesListStyles}>
                  <div style={favoritesStyles}>
                    <div style={preferenceLabelStyles}>Favorites:</div>
                    {role?.favoriteMeals.map((meal) => (
                      <div key={meal} style={preferenceItemStyles}>
                        {meal}
                      </div>
                    ))}
                  </div>
                  <div style={dislikedStyles}>
                    <div style={preferenceLabelStyles}>Disliked:</div>
                    {role?.dislikedMeals.map((meal) => (
                      <div key={meal} style={preferenceItemStyles}>
                        {meal}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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

const crewStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px'
};

const memberStyles = {
  padding: '15px',
  border: '1px solid #eee',
  borderRadius: '4px',
  backgroundColor: '#f9f9f9'
};

const memberHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const memberNameStyles = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333'
};

const memberRoleStyles = {
  fontSize: '14px',
  color: '#666',
  padding: '4px 8px',
  backgroundColor: '#f0f0f0',
  borderRadius: '4px'
};

const memberDescriptionStyles = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '15px'
};

const hungerStyles = {
  marginBottom: '15px'
};

const hungerLabelStyles = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '5px'
};

const hungerBarStyles = {
  height: '8px',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  overflow: 'hidden',
  marginBottom: '5px'
};

const hungerFillStyles = {
  height: '100%',
  transition: 'width 0.3s ease'
};

const hungerValueStyles = {
  fontSize: '12px',
  color: '#666',
  textAlign: 'right'
};

const preferencesStyles = {
  marginTop: '15px'
};

const preferencesTitleStyles = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '10px'
};

const preferencesListStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const favoritesStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const dislikedStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const preferenceLabelStyles = {
  fontSize: '12px',
  color: '#666',
  marginBottom: '5px'
};

const preferenceItemStyles = {
  fontSize: '12px',
  color: '#333',
  padding: '4px 8px',
  backgroundColor: '#f0f0f0',
  borderRadius: '4px'
};

export default CrewStatus;