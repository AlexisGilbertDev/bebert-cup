import { useEffect, useState } from 'react';
import { isChallengePlayable, readEquipmentSettings } from '../lib/equipment';
import type { Challenge } from './use-challenges';

export function useDuelChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/duel/challenges')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data: Challenge[]) => {
        const equipmentSettings = readEquipmentSettings();
        setChallenges(
          data.filter((challenge) =>
            isChallengePlayable(challenge, equipmentSettings),
          ),
        );
        setLoading(false);
      })
      .catch(() => {
        setError('Impossible de charger les défis.');
        setLoading(false);
      });
  }, []);

  return { challenges, loading, error };
}
