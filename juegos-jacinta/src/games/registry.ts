// Registro de juegos: la grilla del menú ya muestra la estructura completa.
// Los juegos sin componente aparecen bloqueados (candado) hasta que se construyan.

export interface GameInfo {
  id: string;
  icon: string;
  /** Nombre hablado (Jaci no lee: esto se narra, nunca se muestra como texto necesario). */
  spokenName: string;
  /** Color de fondo de la tarjeta en el menú. */
  color: string;
  available: boolean;
}

export const GAMES: GameInfo[] = [
  {
    id: 'memorice',
    icon: '🐱',
    spokenName: 'El memorice de los animales',
    color: '#ffe0ec',
    available: true,
  },
  {
    id: 'eco-musical',
    icon: '🎵',
    spokenName: 'El eco musical',
    color: '#e0f0ff',
    available: false,
  },
  {
    id: 'quien-suena',
    icon: '👂',
    spokenName: '¿Quién suena?',
    color: '#fff3d6',
    available: false,
  },
  {
    id: 'arma-figura',
    icon: '🧩',
    spokenName: 'Arma la figura',
    color: '#e2ffe5',
    available: false,
  },
  {
    id: 'sigue-serie',
    icon: '🌈',
    spokenName: 'Sigue la serie',
    color: '#f0e4ff',
    available: false,
  },
  {
    id: 'cuenta-conmigo',
    icon: '✋',
    spokenName: 'Cuenta conmigo',
    color: '#ffe9d6',
    available: false,
  },
];
