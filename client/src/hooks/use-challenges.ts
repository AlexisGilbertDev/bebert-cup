import { useEffect, useState } from 'react';
import {
  type ChallengeEquipment,
  isChallengePlayable,
  readEquipmentSettings,
} from '../lib/equipment';

export interface ChallengeDrawSlot {
  role: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration?: number;
  stopwatch?: boolean;
  details?: string;
  minPlayers: number;
  maxPlayers?: number;
  draw?: ChallengeDrawSlot[];
  eliminableRoles?: string[];
  teamDraw?: ChallengeDrawSlot[];
  equipment?: ChallengeEquipment;
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/challenges')
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
