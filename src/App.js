import Game from './components/Game';
import { gameTheme } from './theme/gameTheme';

const App = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: gameTheme.colors.background,
      ...gameTheme.common.pixelated,
    }}>
      <Game />
    </div>
  );
};

export default App; 