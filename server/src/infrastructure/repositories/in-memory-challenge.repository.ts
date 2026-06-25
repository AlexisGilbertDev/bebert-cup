import type { ChallengeMode } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { DUEL_CHALLENGES } from './duel-challenges.js';
import { SURVIVOR_CHALLENGES } from './survivor-challenges.js';

const ALL_CHALLENGES = [...SURVIVOR_CHALLENGES, ...DUEL_CHALLENGES];

export class InMemoryChallengeRepository implements ChallengeRepositoryPort {
  findAll() {
    return ALL_CHALLENGES;
  }

  findByMode(mode: ChallengeMode) {
    return ALL_CHALLENGES.filter((challenge) => challenge.mode === mode);
  }
}
