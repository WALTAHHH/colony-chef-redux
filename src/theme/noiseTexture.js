// Create a base64 encoded noise texture
export const noiseTextureDataUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADqSURBVDiNldI9TsNAEIbht9YGgoQQoqKhpOYSHIkLcAZqzsEluAGnoKKkoqZAQoiQ+LFxYWftJI7jfNKMdmae2ZnZzVJK6nmeZ3mej4wxQ2PMhyR0XTfLsuxVUu37/l1SIWmQtNZ1vZdUSILWWtd1/STpGcDMbJIkyUJSKWmQtG6aZifpCcDcbCRls9lsLqmStEjaALgFcA/gZm5Wkop+GN4AVJKWZraRdA3gDsAYwNXcrCUVwzC8BrCStDSzraRrM7sDMAZw+d+slVQMw/AKwErSyszKJEmuANwCGP8xa0kFgEsAhZmVkrYAJgDOz80XkBpz3R8hzaUAAAAASUVORK5CYII=`;

// Update the noiseOverlay style in gameTheme.js to use this instead of a file
export const noiseOverlayStyle = {
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${noiseTextureDataUrl})`,
    opacity: 0.05,
    pointerEvents: 'none',
    mixBlendMode: 'overlay',
  },
}; 