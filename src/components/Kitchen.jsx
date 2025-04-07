import React, { useState } from 'react';
import { useGameState } from '../contexts/GameContext';
import InventoryGrid from './InventoryGrid';
import IngredientDetails from './ingredientDetails';
import MealAssignmentTable from './MealAssignmentTable';

const Kitchen = () => {
  const { sidebarOpen, setSidebarOpen, getItemEmoji } = useGameState();
  const [activeSection, setActiveSection] = useState('profile');
  const [activeTab, setActiveTab] = useState('inventory');
  const { 
    gamePhase,
    meals, 
    recipes, 
    canCraftRecipe, 
    craftRecipe,
    crew,
    setGamePhase,
    removeFromInventory,
    inventory
  } = useGameState();
  
  const handleDragStart = (e, meal, index) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ meal, index }));
  };
  
  const kitchenStyles = {
    flex: '2',
    padding: '20px',
    overflow: 'auto',
    backgroundColor: '#fff3e0',
    maxHeight: '70vh',
    position: 'relative'
  };
  
  const sectionStyles = {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#ffecb3',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  // eslint-disable-next-line no-unused-vars
  const menuToggleStyles = {
    position: 'fixed',
    left: '20px',
    top: '70px',
    backgroundColor: '#8d6e63',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    padding: '10px 15px',
    cursor: 'pointer',
    zIndex: 1000,
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)'
  };
  
  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '10px',
    marginTop: '10px'
  };
  
  const itemStyles = {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };
  
  const buttonStyles = {
    backgroundColor: '#8d6e63',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '5px 0',
    transition: 'background-color 0.2s'
  };
  
  // eslint-disable-next-line no-unused-vars
  const disabledButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  };
  
  
  // eslint-disable-next-line no-unused-vars
  const compactSectionStyles = {
    ...sectionStyles,
    padding: '10px',
    marginBottom: '10px'
  };
  
  const compactGridStyles = {
    ...gridStyles,
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '5px'
  };
  
  const compactItemStyles = {
    ...itemStyles,
    padding: '5px',
    fontSize: '0.8em'
  };
  
  const sidebarStyles = {
    position: 'fixed',
    left: sidebarOpen ? '0' : '-300px',
    top: '0',
    bottom: '0',
    width: '300px',
    maxWidth: '80vw',
    backgroundColor: '#ffecb3',
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
    zIndex: 100,
    transition: 'left 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden'
  };
  
  const closeButtonStyles = {
    position: 'absolute',
    right: '10px',
    top: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#5d4037'
  };
  
  const menuHeaderStyles = {
    padding: '15px',
    borderBottom: '1px solid #e8d5b0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  
  const menuNavStyles = {
    display: 'flex',
    borderBottom: '1px solid #e8d5b0',
    backgroundColor: '#ffe082'
  };
  
  const menuNavItemStyles = (isActive) => ({
    flex: 1,
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: isActive ? '#ffecb3' : 'transparent',
    borderBottom: isActive ? '3px solid #8d6e63' : '3px solid transparent',
    fontWeight: isActive ? 'bold' : 'normal'
  });
  
  const menuContentStyles = {
    padding: '15px',
    overflowY: 'auto',
    flex: 1
  };
  
  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
    display: sidebarOpen ? 'block' : 'none',
    cursor: 'pointer'
  };
  
  return (
    <>
      
      <div 
        style={overlayStyles} 
        onClick={() => setSidebarOpen(false)}
        role="button" 
        aria-label="Close menu"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
      ></div>
      
      <div style={kitchenStyles}>
        {gamePhase === 2 && (
          <nav style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#ffe082',
            borderRadius: '8px 8px 0 0',
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            overflow: 'auto'
          }}>
            {['inventory', 'recipes', 'meals'].map((tab) => (
              <button 
                key={tab}
                style={{
                  padding: '12px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: activeTab === tab ? '#ffecb3' : 'transparent',
                  borderBottom: activeTab === tab ? '3px solid #8d6e63' : '3px solid transparent',
                  fontWeight: activeTab === tab ? 'bold' : 'normal',
                  flex: '1 0 auto',
                  minWidth: '120px',
                  border: 'none',
                  fontSize: '16px',
                  color: '#5d4037'
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'inventory' && `${getItemEmoji('vegetables')} Inventory`}
                {tab === 'recipes' && `${getItemEmoji('stew')} Recipes`}
                {tab === 'meals' && `${getItemEmoji('fishRice')} Prepared Meals`}
              </button>
            ))}
          </nav>
        )}
      <div style={sidebarStyles}>
        <div style={menuHeaderStyles}>
          <h2>Expedition Menu</h2>
          <button 
            style={closeButtonStyles}
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div style={menuNavStyles}>
          <div 
            style={menuNavItemStyles(activeSection === 'profile')}
            onClick={() => setActiveSection('profile')}
          >
            📋 Profile
          </div>
          <div 
            style={menuNavItemStyles(activeSection === 'inventory')}
            onClick={() => setActiveSection('inventory')}
          >
            {getItemEmoji('vegetables')} Inventory
          </div>
          <div 
            style={menuNavItemStyles(activeSection === 'recipes')}
            onClick={() => setActiveSection('recipes')}
          >
            {getItemEmoji('stew')} Recipes
          </div>
          <div 
            style={menuNavItemStyles(activeSection === 'colonists')}
            onClick={() => setActiveSection('colonists')}
          >
            👥 Colonists
          </div>
        </div>
        
        <div style={menuContentStyles}>
          {activeSection === 'profile' && (
            <div>
              <h3>Expedition Profile</h3>
              <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '15px' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '3em' }}>🧭</span>
                  <h3 style={{ margin: '5px 0' }}>Frontier Expedition</h3>
                </div>
                <div style={{ fontSize: '0.9em', color: '#5d4037' }}>
                  <p><strong>Mission:</strong> Cook and serve meals to keep the crew fed and motivated during your journey through the frontier.</p>
                  <p><strong>Goal:</strong> Reach the destination with all crew members alive and well-fed.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}>
                  <span>{getItemEmoji('stew')}</span> Save Expedition
                </button>
                
                <button style={{
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}>
                  <span>{getItemEmoji('fishRice')}</span> Load Expedition
                </button>
                
                <button style={{
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}>
                  <span>❓</span> Help & Tutorial
                </button>
              </div>
            </div>
          )}
          
          {activeSection === 'inventory' && (
            <div>
              <h3>Inventory</h3>
              <InventoryGrid compact={true} />
            </div>
          )}
          
          {activeSection === 'recipes' && (
            <div>
              <h3>Recipes</h3>
              <div style={compactGridStyles}>
                {Object.entries(recipes).map(([recipe, ingredients]) => (
                  <IngredientDetails
                    key={recipe}
                    item={recipe}
                    compact={true}
                    showCookButton={true}
                    onCook={() => {
                      if (canCraftRecipe(recipe)) {
                        Object.entries(recipes[recipe]).forEach(([ingredient, amount]) => {
                          if (ingredient !== 'hungerValue') {
                            removeFromInventory(ingredient, amount);
                          }
                        });
                        craftRecipe(recipe);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {activeSection === 'colonists' && (
            <div>
              <h3>Colonists</h3>
              <div style={compactGridStyles}>
                {crew.map(member => (
                  <div key={member.id} style={compactItemStyles}>
                    <div style={{ fontSize: '1.5em' }}>{member.avatar}</div>
                    <div>{member.name}</div>
                    <div style={{ fontSize: '0.7em', margin: '2px 0' }}>
                      Hunger: {member.hunger}%
                    </div>
                    <div style={{ fontSize: '0.7em', color: '#666' }}>
                      Role: {member.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {gamePhase === 2 && (
        <div>
        {activeTab === 'inventory' && (
          <div style={sectionStyles}>
            <h2>Available Ingredients</h2>
            <InventoryGrid compact={false} />
            {Object.entries(inventory).some(([_, quantity]) => isNaN(quantity) || quantity === undefined) && (
              <div style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeeba',
                borderRadius: '4px',
                color: '#856404'
              }}>
                <p>Some ingredient quantities are invalid. Please check your inventory.</p>
              </div>
            )}
          </div>
        )}
          
          {activeTab === 'recipes' && (
            <div style={sectionStyles}>
              <h2>Recipes</h2>
              <div style={gridStyles}>
                {Object.entries(recipes).map(([recipe, ingredients]) => (
                  <IngredientDetails
                    key={recipe}
                    item={recipe}
                    compact={false}
                    showCookButton={true}
                    onCook={() => {
                      if (canCraftRecipe(recipe)) {
                        Object.entries(recipes[recipe]).forEach(([ingredient, amount]) => {
                          if (ingredient !== 'hungerValue') {
                            removeFromInventory(ingredient, amount);
                          }
                        });
                        craftRecipe(recipe);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'meals' && (
            <div style={sectionStyles}>
              <h2>Prepared Meals</h2>
              <div style={gridStyles}>
                {meals.length > 0 ? (
                  meals.map((meal, index) => (
                    <div 
                      key={index} 
                      style={{cursor: 'grab'}}
                      draggable
                      onDragStart={(e) => handleDragStart(e, meal, index)}
                    >
                      <IngredientDetails 
                        item={meal}
                        compact={false}
                      />
                    </div>
                  ))
                ) : (
                  <div style={{ 
                    padding: '20px', 
                    color: '#888', 
                    fontSize: '1em',
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    width: '100%'
                  }}>
                    No meals prepared yet. Cook something from the Recipes tab!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {gamePhase === 2 && (
        <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', padding: '15px 0' }}>
          <button 
            style={{
              backgroundColor: '#795548',
              color: 'white',
              border: 'none',
              padding: '12px 15px',
              fontSize: '16px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
            onClick={() => setGamePhase(1)}
          >
            <span style={{ fontSize: '20px', marginRight: '5px' }}>←</span> Back to Planning
          </button>
          <button 
            style={{
              flex: 1,
              backgroundColor: '#5d4037',
              color: 'white',
              border: 'none',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }} 
            onClick={() => {
              if (meals.length === 0) {
                const confirmProceed = window.confirm("You haven't prepared any meals. The crew will go hungry. Are you sure you want to proceed?");
                if (confirmProceed) {
                  setGamePhase(3);
                }
              } else {
                setGamePhase(3);
              }
            }}
          >
            Proceed to Serving
          </button>
        </div>
      )}
      {gamePhase === 3 && (
        <>
          <div style={sectionStyles}>
            <h2>Available Meals</h2>
            <p>These are the meals you've prepared. Drag them to assign to crew members below.</p>
            <div style={gridStyles}>
              {meals.length > 0 ? (
                meals.map((meal, index) => (
                  <div 
                    key={index} 
                    style={{cursor: 'grab'}}
                    draggable
                    onDragStart={(e) => handleDragStart(e, meal, index)}
                  >
                    <IngredientDetails 
                      item={meal}
                      compact={false}
                    />
                  </div>
                ))
              ) : (
                <div style={{ 
                  padding: '20px', 
                  color: '#888', 
                  fontSize: '1em',
                  textAlign: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  width: '100%'
                }}>
                  No meals prepared yet. You'll need to go back and prepare some food first.
                </div>
              )}
            </div>
          </div>
          
          <MealAssignmentTable />
        </>
      )}
    </div>
    </>
  );
};
export default Kitchen;