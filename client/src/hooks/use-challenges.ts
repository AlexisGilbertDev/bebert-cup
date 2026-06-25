import { useEffect, useState } from 'react';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers?: number;
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/challenges')
      .then((response) => response.json())
      .then((data: Challenge[]) => {
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
