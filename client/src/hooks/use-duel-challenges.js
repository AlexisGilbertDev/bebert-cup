import { useEffect, useState } from 'react';
export function useDuelChallenges() {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch('/api/duel/challenges')
            .then((response) => {
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
            .then((data) => {
            setChallenges(data);
            setLoading(false);
        })
            .catch(() => {
            setError('Impossible de charger les défis.');
            setLoading(false);
        });
    }, []);
    return { challenges, loading, error };
}
