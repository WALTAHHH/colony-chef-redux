import React, { useState, useRef, useEffect } from 'react';
import { useGameState } from 'GameContext';
import IngredientDetails from 'IngredientDetails';
const MealAssignmentTable = () => {
  const { meals, crew, recipes, craftRecipe, setGamePhase, gamePhase, mealAssignments, assignMealToCrew } = useGameState();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [remainingMeals, setRemainingMeals] = useState([]);
  const [availableMeals, setAvailableMeals] = useState([]);
  useEffect(() => {
    if (gamePhase === 3 || gamePhase === 4) {
      setAssignments(mealAssignments);
      const assignedMealIndices = new Set(Object.values(mealAssignments).flatMap(Object.values).filter(v => v !== undefined));
      const unassignedMeals = meals.filter((_, index) => !assignedMealIndices.has(index));
      setRemainingMeals(unassignedMeals);
    } else {
      setAssignments({});
      setRemainingMeals([]);
    }
    
    // Update available meals
    const assignedMealIndices = new Set(Object.values(mealAssignments).flatMap(Object.values).filter(v => v !== undefined));
    setAvailableMeals(meals.filter((_, index) => !assignedMealIndices.has(index)));
  }, [gamePhase, meals, mealAssignments]);
  React.useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
// Handle meal selection
const handleMealSelect = (mealIndex) => {
  if (selectedMeal === mealIndex) {
    // Deselect the meal if it's already selected
    setSelectedMeal(null);
  } else {
    // Select the new meal
    setSelectedMeal(mealIndex);
  }
};
// Handle meal assignment
const handleMealAssign = (crewId, slot) => {
  if (selectedMeal !== null) {
    try {
      const selectedMealName = availableMeals[selectedMeal];
      console.log(`Assigning meal: ${selectedMealName} to crew ${crewId} in slot ${slot}`);
      
      setAssignments(prev => {
        const newAssignments = { ...prev };
        if (!newAssignments[crewId]) {
          newAssignments[crewId] = {};
        }
        
        // Check if the meal is already assigned
        const isAlreadyAssigned = Object.values(newAssignments).some(
          crewAssignments => Object.values(crewAssignments).includes(selectedMeal)
        );
        
        if (isAlreadyAssigned) {
          console.log(`Meal ${selectedMealName} is already assigned. Cannot assign again.`);
          return prev; // Return previous state without changes
        }
        
        // Assign to the specified slot
        newAssignments[crewId][slot] = selectedMeal;
        return newAssignments;
      });
      
      assignMealToCrew(crewId, selectedMealName, slot);
      
      // Remove the assigned meal from availableMeals
      setAvailableMeals(prevMeals => prevMeals.filter((_, index) => index !== selectedMeal));
      
      setSelectedMeal(null);
      console.log(`Successfully assigned ${selectedMealName} to crew ${crewId} in slot ${slot}`);
    } catch (error) {
      console.error(`Error assigning meal: ${error.message}`);
      // You might want to show an error message to the user here
    }
  }
};
  
// Remove assignment
const removeAssignment = (crewId, slot) => {
  setAssignments(prev => {
    const newAssignments = { ...prev };
    if (newAssignments[crewId] && newAssignments[crewId][slot] !== undefined) {
      const removedMealIndex = newAssignments[crewId][slot];
      
      // Remove the assignment for the specific slot
      delete newAssignments[crewId][slot];
      
      // If no more assignments for this crew member, remove the entry
      if (Object.keys(newAssignments[crewId]).length === 0) {
        delete newAssignments[crewId];
      } else {
        // Shift remaining assignments to fill the gap
        const slots = Object.keys(newAssignments[crewId]).sort();
        const updatedSlots = {};
        slots.forEach((existingSlot, index) => {
          updatedSlots[index] = newAssignments[crewId][existingSlot];
        });
        newAssignments[crewId] = updatedSlots;
      }
      
      // Find the actual meal that was removed and add it back to availableMeals
      const removedMeal = meals[removedMealIndex];
      if (removedMeal) {
        setAvailableMeals(prevMeals => {
          // Check if the meal is already in availableMeals to avoid duplicates
          if (!prevMeals.includes(removedMeal)) {
            return [...prevMeals, removedMeal];
          }
          return prevMeals;
        });
      }
    }
    return newAssignments;
  });
  
  // Update the assignment in the game context
  assignMealToCrew(crewId, undefined, slot);
};
  
  // Get preference indicator
  const getPreferenceIndicator = (crewMember, mealType) => {
    if (mealType === crewMember.preferences.favorite) {
      return <span style={{ color: 'green' }}>❤️</span>;
    }
    if (mealType === crewMember.preferences.disliked) {
      return <span style={{ color: 'red' }}>👎</span>;
    }
    return null;
  };
  
  // Container styles
  const containerStyles = {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflowX: 'auto'
  };
  
  // Styles for the meals panel
  const mealsContainerStyles = {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    gap: '10px',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px'
  };
  
  // Styles for individual meal
  const mealItemStyles = {
    minWidth: '80px',
    height: '80px',
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    padding: '8px',
    textAlign: 'center',
    fontSize: '0.9em'
  };
  
  // Styles for responsive table (card layout)
  const responsiveTableStyles = {
    display: isSmallScreen ? 'flex' : 'table',
    flexDirection: isSmallScreen ? 'column' : 'initial',
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    marginTop: '15px',
  };
  // Styles for individual cards/rows
  const cardStyles = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: isSmallScreen ? '15px' : '0',
    display: isSmallScreen ? 'block' : 'table-row',
  };
  // Styles for card/row content
  const contentStyles = {
    display: isSmallScreen ? 'block' : 'table-cell',
    padding: '10px',
    verticalAlign: 'middle',
    borderBottom: '1px solid #eeeeee',
  };
  // Styles for card header / first column
  const headerStyles = {
    ...contentStyles,
    backgroundColor: isSmallScreen ? '#f5f5f5' : 'transparent',
    fontWeight: 'bold',
    display: isSmallScreen ? 'flex' : 'table-cell',
    alignItems: 'center',
    borderBottom: isSmallScreen ? '1px solid #e0e0e0' : '1px solid #eeeeee',
  };
  
  // Styles for the table
  const tableStyles = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    marginTop: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
  };
  
  // Styles for table cells
  const cellStyles = {
    padding: '10px',
    border: '1px solid #eeeeee',
    textAlign: 'left',
    verticalAlign: 'middle'
  };
  
  // Styles for table headers
  const headerCellStyles = {
    ...cellStyles,
    backgroundColor: '#8d6e63',
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '12px',
    letterSpacing: '0.5px'
  };
  
  // Styles for the drop zone
  const dropZoneStyles = {
    minHeight: '90px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    padding: '10px',
    transition: 'all 0.3s ease',
    position: 'relative',
    cursor: 'pointer'
  };
  
  // Styles for assigned meal
  const assignedMealStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px'
  };
  
  // Styles for remove button
  const removeButtonStyles = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 2
  };
  
  // If no meals, show message
  if (meals.length === 0) {
    return (
      <div style={containerStyles}>
        <h2 style={{ color: '#5d4037', marginTop: 0, marginBottom: '15px' }}>Meal Assignments</h2>
        <div style={{ 
          padding: '25px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px', 
          textAlign: 'center',
          borderLeft: '4px solid #ff9800'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🍽️</div>
          <p style={{ color: '#5d4037', fontStyle: 'italic', fontSize: '16px' }}>
            No meals prepared yet. Cook something first!
          </p>
          <button 
            style={{
              backgroundColor: '#8d6e63',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              marginTop: '15px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            onClick={() => setGamePhase(2)}
          >
            Go to Kitchen
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={containerStyles}>
      <h2>{gamePhase === 4 ? "Meal Assignment Results" : "Assign Meals to Crew"}</h2>
      {gamePhase === 3 && <p>Click on a meal and then on a crew member to assign:</p>}
      
      {gamePhase === 3 && (
      <div style={mealsContainerStyles}>
          {availableMeals.map((meal, index) => {
            const mealIndex = meals.indexOf(meal);
            const isAssigned = Object.values(mealAssignments).some(assignments => 
              Object.values(assignments).includes(mealIndex)
            );
            return (
              <div 
                key={index} 
                style={{
                  ...mealItemStyles,
                  backgroundColor: selectedMeal === mealIndex ? '#e6f7ff' : isAssigned ? '#f5f5f5' : 'white',
                  border: selectedMeal === mealIndex ? '2px solid #1890ff' : '2px solid transparent',
                  transform: selectedMeal === mealIndex ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  cursor: isAssigned ? 'not-allowed' : 'pointer',
                  opacity: isAssigned ? 0.6 : 1
                }}
                onClick={() => !isAssigned && handleMealSelect(mealIndex)}
                onMouseEnter={(e) => {
                  if (!isAssigned && selectedMeal !== meals.indexOf(meal)) {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isAssigned && selectedMeal !== meals.indexOf(meal)) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <IngredientDetails
                  item={meal}
                  compact={true}
                />
                {selectedMeal === meals.indexOf(meal) && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    backgroundColor: '#1890ff',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>
                    ✓
                  </div>
                )}
                {isAssigned && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '5px'
                  }}>
                    Assigned
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {selectedMeal !== null && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#f0f5ff',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          <strong>Selected Meal:</strong> {meals[selectedMeal]}. Click on a crew member to assign this meal.
        </div>
      )}
      
      <div style={responsiveTableStyles}>
        {crew.map(member => (
          <div key={member.id} style={cardStyles}>
            <div style={headerStyles}>
              <span style={{ fontSize: '24px', marginRight: '8px' }}>{member.avatar}</span>
              <div>
                <div><strong>{member.name}</strong></div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>{member.role}</div>
              </div>
            </div>
            <div style={contentStyles}>
              <div style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                <div style={{ marginBottom: '5px' }}>
                  Hunger: {member.hunger}%
                </div>
                <div>
                  <span style={{ marginRight: '5px' }}>❤️ {member.preferences.favorite}</span>
                  <span>👎 {member.preferences.disliked}</span>
                </div>
              </div>
            </div>
            <div style={contentStyles}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                {[0, 1, 2].map((slot) => (
                  <div
                    key={slot}
                    style={{
                      ...dropZoneStyles,
                      flex: 1,
                      cursor: selectedMeal !== null ? 'pointer' : 'default',
                      backgroundColor: selectedMeal !== null ? '#e6f7ff' : '#f9f9f9',
                      borderColor: selectedMeal !== null ? '#1890ff' : '#ccc'
                    }}
                    onClick={() => selectedMeal !== null && handleMealAssign(member.id, slot)}
                    onMouseEnter={(e) => {
                      if (selectedMeal !== null) {
                        e.currentTarget.style.backgroundColor = '#bae7ff';
                        e.currentTarget.style.borderColor = '#69c0ff';
                        e.currentTarget.style.boxShadow = '0 0 8px rgba(24, 144, 255, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedMeal !== null) {
                        e.currentTarget.style.backgroundColor = '#e6f7ff';
                        e.currentTarget.style.borderColor = '#1890ff';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {assignments[member.id] && assignments[member.id][slot] !== undefined ? (
                      gamePhase === 3 ? (
                        <div style={assignedMealStyles}>
                          <button 
                            style={removeButtonStyles}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAssignment(member.id, slot);
                            }}
                          >
                            ✕
                          </button>
                          <IngredientDetails
                            item={meals[assignments[member.id][slot]]}
                            compact={true}
                          />
                          {getPreferenceIndicator(member, meals[assignments[member.id][slot]])}
                        </div>
                      ) : (
                        <div style={assignedMealStyles}>
                          <IngredientDetails
                            item={meals[assignments[member.id][slot]]}
                            compact={true}
                          />
                          {getPreferenceIndicator(member, meals[assignments[member.id][slot]])}
                        </div>
                      )
                    ) : (
                      <div>
                        {gamePhase === 3 && selectedMeal !== null ? 'Click to assign meal' : 'Empty slot'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {gamePhase === 4 && (
        <div>
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '10px' }}>Meal Assignment Results</h3>
            <p>Total meals prepared: {meals.length}</p>
            <p>Meals assigned: {Object.values(assignments).flat().length}</p>
            <p>Crew members fed: {Object.keys(assignments).length}</p>
          </div>
          
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '10px' }}>Meal Assignments</h3>
            {crew.map(member => (
              <div key={member.id} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '5px' }}>
                <h4>{member.name}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {[0, 1, 2].map(slot => (
                    <div key={slot} style={{ flex: '1 1 30%', minWidth: '100px' }}>
                      {assignments[member.id] && assignments[member.id][slot] !== undefined ? (
                        <IngredientDetails
                          item={meals[assignments[member.id][slot]]}
                          compact={true}
                        />
                      ) : (
                        <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px', textAlign: 'center' }}>
                          No meal assigned
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {remainingMeals.length > 0 && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#e0f2f1',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '10px' }}>Remaining Unassigned Meals</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '10px',
                marginTop: '10px'
              }}>
                {remainingMeals.map((meal, index) => (
                  <IngredientDetails
                    key={index}
                    item={meal}
                    compact={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default MealAssignmentTable;