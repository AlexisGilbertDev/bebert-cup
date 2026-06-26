import { Router } from 'express';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';
import { buildChallengeRouter } from './challenge.router.js';
import { buildDuelRouter } from './duel.router.js';
import { buildTeamPlayRouter } from './team-play.router.js';

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
  router.use('/team-play', buildTeamPlayRouter(dependencies));

  router.use((_request, response) => {
    response.status(404).json({ error: 'Not found' });
  });

  return router;
}
