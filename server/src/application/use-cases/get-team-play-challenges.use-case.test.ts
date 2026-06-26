import { describe, expect, it } from 'vitest';
import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { GetTeamPlayChallengesUseCase } from './get-team-play-challenges.use-case.js';

class FakeChallengeRepository implements ChallengeRepositoryPort {
  constructor(private readonly teamPlayChallenges: Challenge[] = []) {}
  findSurvivorChallenges() {
    return [];
  }
  findDuelChallenges() {
    return [];
  }
  findTeamPlayChallenges() {
    return this.teamPlayChallenges;
  }
}

describe('GetTeamPlayChallengesUseCase', () => {
  it('returns team-play challenges from the repository', () => {
    const challenges: Challenge[] = [
      {
        id: 'team-play-1',
        name: 'Team Play Challenge',
        description: 'A team play challenge.',
        minPlayers: 4,
      },
    ];
    const useCase = new GetTeamPlayChallengesUseCase(
      new FakeChallengeRepository(challenges),
    );
    expect(useCase.execute()).toEqual(challenges);
  });

  it('returns an empty array when there are no team-play challenges', () => {
    const useCase = new GetTeamPlayChallengesUseCase(
      new FakeChallengeRepository([]),
    );
    expect(useCase.execute()).toEqual([]);
  });

  it('does not return survivor or duel challenges', () => {
    const teamPlayChallenge: Challenge = {
      id: 'team-play-1',
      name: 'Team Play',
      description: 'A team play challenge.',
      minPlayers: 4,
    };

    class MixedFakeRepository implements ChallengeRepositoryPort {
      findSurvivorChallenges(): Challenge[] {
        return [
          {
            id: 'survivor-1',
            name: 'Survivor',
            description: 'S',
            minPlayers: 2,
          },
        ];
      }
      findDuelChallenges(): Challenge[] {
        return [
          { id: 'duel-1', name: 'Duel', description: 'D', minPlayers: 2 },
        ];
      }
      findTeamPlayChallenges(): Challenge[] {
        return [teamPlayChallenge];
      }
    }

    const useCase = new GetTeamPlayChallengesUseCase(new MixedFakeRepository());
    expect(useCase.execute()).toEqual([teamPlayChallenge]);
  });
});
