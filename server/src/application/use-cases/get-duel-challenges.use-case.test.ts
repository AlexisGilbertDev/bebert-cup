import { describe, expect, it } from 'vitest';
import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { GetDuelChallengesUseCase } from './get-duel-challenges.use-case.js';

class FakeChallengeRepository implements ChallengeRepositoryPort {
  constructor(
    private readonly survivorChallenges: Challenge[] = [],
    private readonly duelChallenges: Challenge[],
  ) {}
  findSurvivorChallenges() { return this.survivorChallenges; }
  findDuelChallenges() { return this.duelChallenges; }
  findTeamPlayChallenges() { return []; }
}

describe('GetDuelChallengesUseCase', () => {
  it('returns duel challenges from the repository', () => {
    const challenges: Challenge[] = [
      {
        id: 'duel-1',
        name: 'Duel Challenge',
        description: 'A duel challenge.',
        minPlayers: 2,
      },
    ];
    const useCase = new GetDuelChallengesUseCase(new FakeChallengeRepository([], challenges));
    expect(useCase.execute()).toEqual(challenges);
  });

  it('returns an empty array when there are no duel challenges', () => {
    const useCase = new GetDuelChallengesUseCase(new FakeChallengeRepository([], []));
    expect(useCase.execute()).toEqual([]);
  });

  it('does not return survivor challenges', () => {
    const survivorChallenge: Challenge = {
      id: 'survivor-1',
      name: 'Survivor',
      description: 'A survivor challenge.',
      minPlayers: 2,
    };
    const duelChallenge: Challenge = {
      id: 'duel-1',
      name: 'Duel',
      description: 'A duel challenge.',
      minPlayers: 2,
    };
    const useCase = new GetDuelChallengesUseCase(
      new FakeChallengeRepository([survivorChallenge], [duelChallenge]),
    );
    expect(useCase.execute()).toEqual([duelChallenge]);
    expect(useCase.execute()).not.toContainEqual(survivorChallenge);
  });
});
