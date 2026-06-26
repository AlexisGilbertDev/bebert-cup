import { useEffect, useState } from 'react';
export function useChallenges() {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch('/api/challenges')
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
