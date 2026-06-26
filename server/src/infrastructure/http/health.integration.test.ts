import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildApp } from './server.js';

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const application = buildApp({
      challengeRepository: {
        findSurvivorChallenges: () => [],
        findDuelChallenges: () => [],
        findTeamPlayChallenges: () => [],
      },
    });
    const response = await request(application).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
