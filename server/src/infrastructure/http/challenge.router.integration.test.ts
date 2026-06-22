import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { buildApp } from './server.js';

class FakeChallengeRepository implements ChallengeRepositoryPort {
  constructor(private readonly challenges: Challenge[]) {}
  findAll(): Challenge[] {
    return this.challenges;
  }
}

const fakeChallenges: Challenge[] = [
  {
    id: 'crossbar-challenge',
    name: 'Crossbar Challenge',
    description: 'Hit the crossbar.',
    resultType: 'outcome',
    minPlayers: 2,
  },
];

describe('GET /api/challenges', () => {
  it('returns the list of challenges', async () => {
    const application = buildApp({
      challengeRepository: new FakeChallengeRepository(fakeChallenges),
    });
    const response = await request(application).get('/api/challenges');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeChallenges);
  });

  it('returns an empty array when there are no challenges', async () => {
    const application = buildApp({
      challengeRepository: new FakeChallengeRepository([]),
    });
    const response = await request(application).get('/api/challenges');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
