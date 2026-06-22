import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from './server.js';

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const application = buildApp();
    const response = await request(application).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
