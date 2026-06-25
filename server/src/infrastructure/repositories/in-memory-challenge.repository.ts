import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { DUEL_CHALLENGES } from './duel-challenges.js';
import { SURVIVOR_CHALLENGES } from './survivor-challenges.js';

export class InMemoryChallengeRepository implements ChallengeRepositoryPort {
  findSurvivorChallenges() {
    return SURVIVOR_CHALLENGES;
  }

  findDuelChallenges() {
    return DUEL_CHALLENGES;
  }
}
