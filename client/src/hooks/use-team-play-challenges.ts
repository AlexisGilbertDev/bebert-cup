import { useEffect, useState } from 'react';
import type { Challenge } from './use-challenges';

export function useTeamPlayChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/team-play/challenges')
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
