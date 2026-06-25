import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { Challenge, ChallengeMode } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { buildApp } from './server.js';

class FakeChallengeRepository implements ChallengeRepositoryPort {
  constructor(private readonly challenges: Challenge[]) {}
  findAll(): Challenge[] {
    return this.challenges;
  }
  findByMode(mode: ChallengeMode): Challenge[] {
    return this.challenges.filter((challenge) => challenge.mode === mode);
  }
}

const fakeDuelChallenges: Challenge[] = [
  {
    id: 'duel-challenge-1',
    name: 'Duel Challenge',
    description: 'A duel challenge.',
    minPlayers: 2,
    mode: 'duel',
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
