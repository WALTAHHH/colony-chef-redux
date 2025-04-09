import React from 'react';
import { gameTheme } from '../theme/gameTheme';

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'OK', cancelText = 'Cancel', type = 'confirm' }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div style={overlayStyles}>
      <div style={modalStyles}>
        <div style={headerStyles}>
          <h3 style={titleStyles}>{title}</h3>
        </div>
        <div style={contentStyles}>
          <p style={messageStyles}>{message}</p>
        </div>
        <div style={buttonContainerStyles}>
          {type === 'confirm' && (
            <button 
              style={{
                ...buttonStyles,
                backgroundColor: gameTheme.colors.danger,
                marginRight: '12px'
              }} 
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          <button 
            style={{
              ...buttonStyles,
              backgroundColor: type === 'error' ? gameTheme.colors.danger : gameTheme.colors.highlightPrimary
            }} 
            onClick={type === 'error' ? onClose : handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyles = {
  backgroundColor: gameTheme.colors.panel,
  borderRadius: '8px',
  padding: '20px',
  minWidth: '300px',
  maxWidth: '500px',
  ...gameTheme.common.panel,
  ...gameTheme.common.pixelated,
};

const headerStyles = {
  marginBottom: '16px',
  borderBottom: `2px solid ${gameTheme.colors.border}`,
  paddingBottom: '8px',
};

const titleStyles = {
  margin: 0,
  color: gameTheme.colors.text,
  fontSize: '18px',
  fontWeight: 'bold',
};

const contentStyles = {
  marginBottom: '20px',
};

const messageStyles = {
  margin: 0,
  color: gameTheme.colors.text,
  fontSize: '16px',
};

const buttonContainerStyles = {
  display: 'flex',
  justifyContent: 'flex-end',
};

const buttonStyles = {
  ...gameTheme.common.button,
  padding: '8px 16px',
  color: gameTheme.colors.background,
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

export default Modal; 