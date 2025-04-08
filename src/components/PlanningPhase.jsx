import React from 'react';
import { useGame } from '../context/GameContext';
import { gameTheme } from '../theme/gameTheme';

const PlanningPhase = () => {
  const { gameState } = useGame();
  const { progress, day, morale } = gameState;

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      height: '100%'
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      flex: 1
    },
    leftPanel: {
      ...gameTheme.common.panel,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    rightPanel: {
      ...gameTheme.common.panel,
      display: 'flex',
      flexDirection: 'column'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: gameTheme.colors.text,
      marginBottom: '15px',
      borderBottom: `2px solid ${gameTheme.colors.border}`,
      paddingBottom: '10px'
    },
    statusItem: {
      marginBottom: '10px'
    },
    label: {
      color: gameTheme.colors.text,
      marginBottom: '5px',
      opacity: 0.8
    },
    value: {
      fontSize: '16px',
      color: gameTheme.colors.text
    },
    progressBar: {
      height: '8px',
      backgroundColor: gameTheme.colors.background,
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '5px'
    },
    progressFill: {
      height: '100%',
      backgroundColor: gameTheme.colors.highlightPrimary,
      transition: 'width 0.3s ease'
    },
    mapPlaceholder: {
      flex: 1,
      backgroundColor: gameTheme.colors.background,
      borderRadius: '4px',
      border: `2px dashed ${gameTheme.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: gameTheme.colors.text,
      fontSize: '14px',
      marginTop: '15px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.leftPanel}>
          <div>
            <h2 style={styles.sectionTitle}>Expedition Status</h2>
            <div style={styles.statusItem}>
              <div style={styles.label}>Progress</div>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${progress}%`
                  }}
                />
              </div>
              <div style={styles.value}>{Math.floor(progress)}% complete</div>
            </div>
            <div style={styles.statusItem}>
              <div style={styles.label}>Current Location</div>
              <div style={styles.value}>Starting Camp</div>
            </div>
            <div style={styles.statusItem}>
              <div style={styles.label}>Weather Effects</div>
              <div style={styles.value}>Rain may slow progress today</div>
            </div>
            <div style={styles.statusItem}>
              <div style={styles.label}>Expedition Morale</div>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${morale}%`,
                    backgroundColor: morale > 70 ? gameTheme.colors.highlightPrimary : morale > 40 ? '#FFC107' : gameTheme.colors.danger
                  }}
                />
              </div>
              <div style={styles.value}>{morale}%</div>
            </div>
          </div>
          
          <div>
            <h2 style={styles.sectionTitle}>Current Scenario</h2>
            <div style={styles.value}>
              Your journey has just begun. The crew is eager to set out, but the rainy weather might make progress slower than anticipated.
              Plan your first day carefully.
            </div>
          </div>
        </div>

        <div style={styles.rightPanel}>
          <h2 style={styles.sectionTitle}>Expedition Map</h2>
          <div style={styles.mapPlaceholder}>
            [Map visualization will be implemented here]
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningPhase; 