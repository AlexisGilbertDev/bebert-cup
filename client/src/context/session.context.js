import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const SessionContext = createContext(null);
export function SessionProvider({ children }) {
    const [players, setPlayers] = useState([]);
    return (_jsx(SessionContext.Provider, { value: { players, setPlayers }, children: children }));
}
export function useSession() {
    const context = useContext(SessionContext);
    if (!context)
        throw new Error('useSession must be used within a SessionProvider');
    return context;
}
