import type { Challenge, ChallengeMode } from '../entities/challenge.entity.js';

export interface ChallengeRepositoryPort {
  findAll(): Challenge[];
  findByMode(mode: ChallengeMode): Challenge[];
}
