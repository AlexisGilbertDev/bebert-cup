import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';

const CHALLENGES: Challenge[] = [
  {
    id: 'crossbar-challenge',
    name: 'Crossbar Challenge',
    description:
      "Depuis la ligne de la surface, visez la barre transversale. Les joueurs tirent dans un ordre aléatoire — dès que vous touchez la barre, vous êtes qualifié ! On continue jusqu'à ce qu'il ne reste plus qu'un joueur sans succès... qui est éliminé.",
    resultType: 'outcome',
    minPlayers: 2,
  },
];

export class InMemoryChallengeRepository implements ChallengeRepositoryPort {
  findAll(): Challenge[] {
    return CHALLENGES;
  }
}
