import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { buildApp } from './server.js';

class FakeChallengeRepository implements ChallengeRepositoryPort {
  constructor(private readonly duelChallenges: Challenge[]) {}
  findSurvivorChallenges() { return []; }
  findDuelChallenges() { return this.duelChallenges; }
  findTeamPlayChallenges() { return []; }
}

const fakeDuelChallenges: Challenge[] = [
  {
    id: 'duel-challenge-1',
    name: 'Duel Challenge',
    description: 'A duel challenge.',
    minPlayers: 2,
  },
];

describe('GET /api/duel/challenges', () => {
  it('returns the list of duel challenges', async () => {
    const application = buildApp({
      challengeRepository: new FakeChallengeRepository(fakeDuelChallenges),
    });
    const response = await request(application).get('/api/duel/challenges');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeDuelChallenges);
  });

  it('returns an empty array when there are no duel challenges', async () => {
    const application = buildApp({
      challengeRepository: new FakeChallengeRepository([]),
    });
    const response = await request(application).get('/api/duel/challenges');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
