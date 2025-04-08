import React from 'react';
import { useGame } from '../context/GameContext';
import { GAME_PHASES } from '../data/gameConstants';
import CrewStatus from './crewStatus';
import ExpeditionMap from './ExpeditionMap';
import ScenarioHistory from './ScenarioHistory';
import MealAssignmentTable from './MealAssignmentTable';
import { gameTheme } from '../theme/gameTheme';

const Status = () => {
  const { gameState } = useGame();
  const { phase, day, progress, morale, crew, assignedMeals, inventory } = gameState;

  const caravanIconStyles = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: `calc(${progress}% - 12px)`,
    fontSize: '20px',
  };

  const renderExpeditionProgress = () => (
    <div style={sectionStyles}>
      <h3 style={sectionTitleStyles}>Expedition Progress</h3>
      <div style={progressContainerStyles}>
        <div style={progressMapStyles}>
          <div style={progressBarContainerStyles}>
            <div style={progressTrackStyles} />
            <div 
              style={{
                ...progressFillStyles,
                width: `${progress}%`
              }}
            />
            <div style={caravanIconStyles}>🚃</div>
          </div>
          <div style={milestoneStyles}>
            <span>Start</span>
            <span>Mountain Pass</span>
            <span>River Cross</span>
            <span>Colony</span>
          </div>
        </div>
        <div style={progressStatsStyles}>
          <div style={statBoxStyles}>
            <span style={statLabelStyles}>Distance Covered</span>
            <span style={statValueStyles}>{Math.floor(progress)}%</span>
          </div>
          <div style={statBoxStyles}>
            <span style={statLabelStyles}>Days Traveled</span>
            <span style={statValueStyles}>{day}</span>
          </div>
          <div style={statBoxStyles}>
            <span style={statLabelStyles}>Colony Morale</span>
            <div style={moraleBarStyles}>
              <div 
                style={{
                  ...moraleFillStyles,
                  width: `${morale}%`,
                  backgroundColor: morale > 70 
                    ? gameTheme.colors.success 
                    : morale > 40 
                      ? gameTheme.colors.warning 
                      : gameTheme.colors.danger
                }}
              />
            </div>
            <span style={statValueStyles}>{Math.floor(morale)}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCrewStatus = () => (
    <div style={sectionStyles}>
      <h3 style={sectionTitleStyles}>Crew Status</h3>
      <div style={crewGridStyles}>
        {crew.map(member => (
          <div key={member.id} style={crewCardStyles}>
            <div style={crewHeaderStyles}>
              <span style={crewAvatarStyles}>{member.avatar}</span>
              <div style={crewNameStyles}>
                <div>{member.name}</div>
                <div style={crewRoleStyles}>{member.role}</div>
              </div>
            </div>
            <div style={crewStatsStyles}>
              <div style={crewStatStyles}>
                <span>Hunger</span>
                <div style={statBarContainerStyles}>
                  <div 
                    style={{
                      ...statBarFillStyles,
                      width: `${member.hunger}%`,
                      backgroundColor: member.hunger > 70 
                        ? gameTheme.colors.success 
                        : member.hunger > 30 
                          ? gameTheme.colors.warning 
                          : gameTheme.colors.danger
                    }}
                  />
                </div>
                <span>{member.hunger}%</span>
              </div>
              <div style={crewStatStyles}>
                <span>Morale</span>
                <div style={statBarContainerStyles}>
                  <div 
                    style={{
                      ...statBarFillStyles,
                      width: `${member.morale}%`,
                      backgroundColor: gameTheme.colors.highlightPrimary
                    }}
                  />
                </div>
                <span>{member.morale}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDaySummary = () => (
    <div style={sectionStyles}>
      <h3 style={sectionTitleStyles}>Day Summary</h3>
      <div style={summaryContainerStyles}>
        <div style={summaryColumnStyles}>
          <h4 style={summarySubtitleStyles}>Resources</h4>
          <div style={resourceListStyles}>
            {Object.entries(inventory).map(([item, quantity]) => (
              <div key={item} style={resourceItemStyles}>
                <span>{item}</span>
                <span>x{quantity}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={summaryColumnStyles}>
          <h4 style={summarySubtitleStyles}>Events</h4>
          <div style={eventListStyles}>
            <div style={eventItemStyles}>
              <span style={eventIconStyles}>🌧️</span>
              <span>Rainy weather slowed progress</span>
            </div>
            <div style={eventItemStyles}>
              <span style={eventIconStyles}>🍖</span>
              <span>All crew members were fed</span>
            </div>
            <div style={eventItemStyles}>
              <span style={eventIconStyles}>⭐</span>
              <span>High morale bonus achieved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={containerStyles}>
      {renderExpeditionProgress()}
      {renderCrewStatus()}
      {renderDaySummary()}
    </div>
  );
};

const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '20px',
  height: '100%',
  overflow: 'auto',
  ...gameTheme.common.pixelated,
};

const sectionStyles = {
  backgroundColor: gameTheme.colors.panel,
  border: `2px solid ${gameTheme.colors.border}`,
  padding: '20px',
  ...gameTheme.common.panel,
};

const sectionTitleStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: gameTheme.colors.highlightPrimary,
  margin: '0 0 20px 0',
  textTransform: 'uppercase',
  textAlign: 'center',
  borderBottom: `2px solid ${gameTheme.colors.border}`,
  paddingBottom: '10px',
};

const progressContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const progressMapStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const progressBarContainerStyles = {
  height: '24px',
  backgroundColor: gameTheme.colors.background,
  border: `2px solid ${gameTheme.colors.border}`,
  position: 'relative',
};

const progressTrackStyles = {
  position: 'absolute',
  top: '50%',
  left: '0',
  right: '0',
  height: '2px',
  backgroundColor: gameTheme.colors.border,
  transform: 'translateY(-50%)',
};

const progressFillStyles = {
  height: '100%',
  backgroundColor: gameTheme.colors.highlightPrimary,
  transition: 'width 0.3s ease',
};

const milestoneStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  color: gameTheme.colors.textDim,
};

const progressStatsStyles = {
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
};

const statBoxStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '12px',
  backgroundColor: gameTheme.colors.background,
  border: `2px solid ${gameTheme.colors.border}`,
  minWidth: '120px',
};

const crewGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '16px',
};

const crewCardStyles = {
  backgroundColor: gameTheme.colors.background,
  border: `2px solid ${gameTheme.colors.border}`,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const crewHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const crewAvatarStyles = {
  fontSize: '32px',
};

const crewNameStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const crewRoleStyles = {
  fontSize: '12px',
  color: gameTheme.colors.textDim,
};

const crewStatsStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const crewStatStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
};

const statBarContainerStyles = {
  flex: 1,
  height: '8px',
  backgroundColor: gameTheme.colors.background,
  border: `1px solid ${gameTheme.colors.border}`,
};

const statBarFillStyles = {
  height: '100%',
  transition: 'width 0.3s ease',
};

const summaryContainerStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const summaryColumnStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const summarySubtitleStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: gameTheme.colors.text,
  margin: '0',
  padding: '8px 0',
  borderBottom: `1px solid ${gameTheme.colors.border}`,
};

const resourceListStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const resourceItemStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px',
  backgroundColor: gameTheme.colors.background,
  border: `1px solid ${gameTheme.colors.border}`,
};

const eventListStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const eventItemStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px',
  backgroundColor: gameTheme.colors.background,
  border: `1px solid ${gameTheme.colors.border}`,
};

const eventIconStyles = {
  fontSize: '20px',
};

const moraleBarStyles = {
  height: '8px',
  backgroundColor: gameTheme.colors.background,
  border: `1px solid ${gameTheme.colors.border}`,
};

const moraleFillStyles = {
  height: '100%',
  transition: 'width 0.3s ease',
};

const statLabelStyles = {
  fontSize: '14px',
  color: gameTheme.colors.textDim,
  textTransform: 'uppercase',
};

const statValueStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: gameTheme.colors.text,
};

export default Status;