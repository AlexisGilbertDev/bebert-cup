import type { Challenge } from '../entities/challenge.entity.js';

export interface ChallengeRepositoryPort {
  findAll(): Challenge[];
}
