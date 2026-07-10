import { useState } from 'react';
import { Menu } from './components/Menu';
import { Memorice } from './games/memorice/Memorice';

type View = { screen: 'menu' } | { screen: 'game'; gameId: string };

export default function App() {
  const [view, setView] = useState<View>({ screen: 'menu' });

  const goHome = () => setView({ screen: 'menu' });

  if (view.screen === 'game' && view.gameId === 'memorice') {
    return <Memorice onHome={goHome} />;
  }

  return <Menu onPlay={(gameId) => setView({ screen: 'game', gameId })} />;
}
