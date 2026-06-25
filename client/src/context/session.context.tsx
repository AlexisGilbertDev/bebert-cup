import { createContext, useContext, useState } from 'react';

type GameMode = 'survivor' | 'duel';

interface SessionContextValue {
  mode: GameMode | null;
  setMode: (mode: GameMode) => void;
  players: string[];
  setPlayers: (players: string[]) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [players, setPlayers] = useState<string[]>([]);

  return (
    <SessionContext.Provider value={{ mode, setMode, players, setPlayers }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error('useSession must be used within a SessionProvider');
  return context;
}
