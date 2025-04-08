import { noiseOverlayStyle } from './noiseTexture';

export const gameTheme = {
  colors: {
    background: '#392b1e',
    panel: '#5c4433',
    border: '#a67c52',
    highlightPrimary: '#c6a664',
    highlightSecondary: '#f2d399',
    danger: '#b05c44',
    text: '#f9f3e5',
  },
  
  // Common styles that can be reused across components
  common: {
    pixelated: {
      imageRendering: 'pixelated',
      fontFamily: '"Press Start 2P", monospace', // We'll need to import this font
    },
    
    panel: {
      backgroundColor: '#5c4433',
      border: '4px solid #a67c52',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      ...noiseOverlayStyle,
    },
    
    button: {
      backgroundColor: '#a67c52',
      border: 'none',
      padding: '8px 16px',
      color: '#f9f3e5',
      cursor: 'pointer',
      imageRendering: 'pixelated',
      transition: 'transform 0.1s, filter 0.1s',
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      position: 'relative',
      '&:hover': {
        filter: 'brightness(1.1)',
      },
      '&:active': {
        transform: 'translateY(1px)',
        filter: 'brightness(0.9)',
      },
      ...noiseOverlayStyle,
    },

    noiseOverlay: noiseOverlayStyle,
  },
}; 