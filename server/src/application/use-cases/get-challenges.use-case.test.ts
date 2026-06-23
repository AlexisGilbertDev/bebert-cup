import { describe, expect, it } from 'vitest';
import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { GetChallengesUseCase } from './get-challenges.use-case.js';

class FakeChallengeRepository implements ChallengeRepositoryPort {
  constructor(private readonly challenges: Challenge[]) {}
  findAll(): Challenge[] {
    return this.challenges;
  }
}

describe('GetChallengesUseCase', () => {
  it('returns all challenges from the repository', () => {
    const challenges: Challenge[] = [
      {
        id: 'crossbar-challenge',
        name: 'Crossbar Challenge',
        description: 'Hit the crossbar.',
        minPlayers: 2,
      },
    ];
    const useCase = new GetChallengesUseCase(
      new FakeChallengeRepository(challenges),
    );
    expect(useCase.execute()).toEqual(challenges);
  });

  it('returns an empty array when there are no challenges', () => {
    const useCase = new GetChallengesUseCase(new FakeChallengeRepository([]));
    expect(useCase.execute()).toEqual([]);
  });
});
