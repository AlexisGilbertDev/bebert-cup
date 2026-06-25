import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { buildApp } from './server.js';

class FakeChallengeRepository implements ChallengeRepositoryPort {
  constructor(private readonly teamPlayChallenges: Challenge[]) {}
  findSurvivorChallenges() { return []; }
  findDuelChallenges() { return []; }
  findTeamPlayChallenges() { return this.teamPlayChallenges; }
}

const fakeTeamPlayChallenges: Challenge[] = [
  {
    id: 'team-play-challenge-1',
    name: 'Team Play Challenge',
    description: 'A team play challenge.',
    minPlayers: 4,
    mode: 'team-play',
  },
];

describe('GET /api/team-play/challenges', () => {
  it('returns the list of team-play challenges', async () => {
    const application = buildApp({
      challengeRepository: new FakeChallengeRepository(fakeTeamPlayChallenges),
    });
    const response = await request(application).get('/api/team-play/challenges');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeTeamPlayChallenges);
  });

  it('returns an empty array when there are no team-play challenges', async () => {
    const application = buildApp({
      challengeRepository: new FakeChallengeRepository([]),
    });
    const response = await request(application).get('/api/team-play/challenges');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
