import { describe, expect, it } from 'vitest';
import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { GetSurvivorChallengesUseCase } from './get-survivor-challenges.use-case.js';

class FakeChallengeRepository implements ChallengeRepositoryPort {
  constructor(
    private readonly survivorChallenges: Challenge[],
    private readonly duelChallenges: Challenge[] = [],
  ) {}
  findSurvivorChallenges() { return this.survivorChallenges; }
  findDuelChallenges() { return this.duelChallenges; }
}

describe('GetSurvivorChallengesUseCase', () => {
  it('returns survivor challenges from the repository', () => {
    const challenges: Challenge[] = [
      {
        id: 'crossbar-challenge',
        name: 'Crossbar Challenge',
        description: 'Hit the crossbar.',
        minPlayers: 2,
        mode: 'survivor',
      },
    ];
    const useCase = new GetSurvivorChallengesUseCase(new FakeChallengeRepository(challenges));
    expect(useCase.execute()).toEqual(challenges);
  });

  it('returns an empty array when there are no survivor challenges', () => {
    const useCase = new GetSurvivorChallengesUseCase(new FakeChallengeRepository([]));
    expect(useCase.execute()).toEqual([]);
  });

  it('does not return duel challenges', () => {
    const survivorChallenge: Challenge = {
      id: 'survivor-1',
      name: 'Survivor',
      description: 'A survivor challenge.',
      minPlayers: 2,
      mode: 'survivor',
    };
    const duelChallenge: Challenge = {
      id: 'duel-1',
      name: 'Duel',
      description: 'A duel challenge.',
      minPlayers: 2,
      mode: 'duel',
    };
    const useCase = new GetSurvivorChallengesUseCase(
      new FakeChallengeRepository([survivorChallenge], [duelChallenge]),
    );
    expect(useCase.execute()).toEqual([survivorChallenge]);
    expect(useCase.execute()).not.toContainEqual(duelChallenge);
  });
});
