import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';

const CHALLENGES: Challenge[] = [
  {
    id: 'crossbar-challenge',
    name: 'Crossbar Challenge',
    description:
      'Depuis la ligne de la surface, visez la barre transversale. Les joueurs tirent dans un ordre aléatoire. Le dernier à ne pas avoir touché la barre est éliminé.',
    resultType: 'outcome',
    eliminationRule: 'last-unqualified',
    minPlayers: 2,
  },
  {
    id: 'goal-line-precision',
    name: 'Goal Line Precision',
    description:
      'Depuis la ligne médiane, envoyez votre ballon le plus près possible de la ligne de but. Chaque joueur annonce sa distance. Le plus éloigné est éliminé.',
    resultType: 'score',
    eliminationRule: 'highest-score',
    minPlayers: 2,
  },
  {
    id: 'brasileira',
    name: 'Brasileira',
    description:
      "Tous ensemble, gardez le ballon en l'air avec 3 touches maximum par joueur. Celui qui laisse tomber est éliminé.",
    resultType: 'outcome',
    eliminationRule: 'fault',
    minPlayers: 2,
  },
  {
    id: 'qualification',
    name: 'Qualification',
    description:
      'Un joueur tiré au sort va au but. Les autres tirent depuis la ligne de la surface — seuls les buteurs passent au tour suivant. Le dernier survivant choisit qui il veut éliminer.',
    resultType: 'outcome',
    eliminationRule: 'winner-chooses',
    minPlayers: 3,
  },
];

export class InMemoryChallengeRepository implements ChallengeRepositoryPort {
  findAll(): Challenge[] {
    return CHALLENGES;
  }
}
