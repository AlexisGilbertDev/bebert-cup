import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';

const CHALLENGES: Challenge[] = [
  {
    id: 'crossbar-challenge',
    name: 'Crossbar Challenge',
    description:
      "Depuis la ligne de la surface, visez la barre transversale. Les joueurs tirent dans un ordre aléatoire — dès que vous touchez la barre, vous êtes qualifié ! On continue jusqu'à ce qu'il ne reste plus qu'un joueur sans succès... qui est éliminé.",
    resultType: 'outcome',
    eliminationRule: 'last-unqualified',
    minPlayers: 2,
  },
  {
    id: 'goal-line-precision',
    name: 'Goal Line Precision',
    description:
      'Depuis la ligne médiane, envoyez votre ballon le plus près possible de la ligne de but ! Chaque joueur tire à son tour, puis annonce (honnêtement 😅) sa distance estimée en mètres. Le joueur dont le ballon est le plus loin de la ligne de but est éliminé.',
    resultType: 'score',
    eliminationRule: 'highest-score',
    minPlayers: 2,
  },
  {
    id: 'brasileira',
    name: 'Brasileira',
    description:
      "La brésilienne, c'est sacré ! Tous ensemble, gardez le ballon en l'air — 3 touches maximum par joueur à chaque passage. Celui qui laisse le ballon toucher le sol est directement éliminé. Pas de pitié pour les maladroits !",
    resultType: 'outcome',
    eliminationRule: 'fault',
    minPlayers: 2,
  },
];

export class InMemoryChallengeRepository implements ChallengeRepositoryPort {
  findAll(): Challenge[] {
    return CHALLENGES;
  }
}
