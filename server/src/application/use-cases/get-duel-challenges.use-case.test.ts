import { describe, expect, it } from 'vitest';
import type { Challenge, ChallengeMode } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { GetDuelChallengesUseCase } from './get-duel-challenges.use-case.js';

class FakeChallengeRepository implements ChallengeRepositoryPort {
  constructor(private readonly challenges: Challenge[]) {}
  findAll(): Challenge[] {
    return this.challenges;
  }
  findByMode(mode: ChallengeMode): Challenge[] {
    return this.challenges.filter((challenge) => challenge.mode === mode);
  }
}

describe('GetDuelChallengesUseCase', () => {
  it('returns duel challenges from the repository', () => {
    const challenges: Challenge[] = [
      {
        id: 'duel-1',
        name: 'Duel Challenge',
        description: 'A duel challenge.',
        minPlayers: 2,
        mode: 'duel',
      },
    ];
    const useCase = new GetDuelChallengesUseCase(
      new FakeChallengeRepository(challenges),
    );
    expect(useCase.execute()).toEqual(challenges);
  });

  it('returns an empty array when there are no duel challenges', () => {
    const useCase = new GetDuelChallengesUseCase(new FakeChallengeRepository([]));
    expect(useCase.execute()).toEqual([]);
  });

  it('does not return survivor challenges', () => {
    const challenges: Challenge[] = [
      {
        id: 'survivor-1',
        name: 'Survivor',
        description: 'A survivor challenge.',
        minPlayers: 2,
        mode: 'survivor',
      },
      {
        id: 'duel-1',
        name: 'Duel',
        description: 'A duel challenge.',
        minPlayers: 2,
        mode: 'duel',
      },
    ];
    const useCase = new GetDuelChallengesUseCase(new FakeChallengeRepository(challenges));
    expect(useCase.execute()).toEqual([challenges[1]]);
  });
});
