import { createContext, useContext, useState } from 'react';

interface SessionContextValue {
  players: string[];
  setPlayers: (players: string[]) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<string[]>([]);

  return (
    <SessionContext.Provider value={{ players, setPlayers }}>
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
