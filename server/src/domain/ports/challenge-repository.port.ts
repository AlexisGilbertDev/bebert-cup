import type { Challenge } from '../entities/challenge.entity.js';

export interface ChallengeRepositoryPort {
  findSurvivorChallenges(): Challenge[];
  findDuelChallenges(): Challenge[];
  findTeamPlayChallenges(): Challenge[];
}
