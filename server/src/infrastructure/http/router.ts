import { Router } from 'express';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { buildChallengeRouter } from './challenge.router.js';
import { buildDuelRouter } from './duel.router.js';

export interface AppDependencies {
  challengeRepository: ChallengeRepositoryPort;
}

export function buildRouter(dependencies: AppDependencies): Router {
  const router = Router();

  router.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  router.use('/challenges', buildChallengeRouter(dependencies));
  router.use('/duel', buildDuelRouter(dependencies));

  return router;
}
