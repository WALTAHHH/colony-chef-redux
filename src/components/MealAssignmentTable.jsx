import React from 'react';
import { useGameState } from '../contexts/GameContext';
import IngredientDetails from './ingredientDetails';

const MealAssignmentTable = () => {
  const { 
    meals,
    crew,
    assignMealToCrew
  } = useGameState();

  const tableContainerStyles = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  };

  const buttonStyles = {
    backgroundColor: '#8d6e63',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
    marginBottom: '8px'
  };

  return (
    <div style={tableContainerStyles}>
      <h2>Meal Assignment</h2>
      <table>
        <thead>
          <tr>
            <th>Crew Member</th>
            <th>Meal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {crew.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>
                {meals.map((meal, index) => (
                  <button
                    key={index}
                    style={buttonStyles}
                    onClick={() => assignMealToCrew(member.id, meal)}
                  >
                    <IngredientDetails item={meal} />
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MealAssignmentTable;