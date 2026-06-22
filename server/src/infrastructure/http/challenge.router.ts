import { Router } from 'express';
import { GetChallengesUseCase } from '../../application/use-cases/get-challenges.use-case.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';

export function buildChallengeRouter(dependencies: {
  challengeRepository: ChallengeRepositoryPort;
}): Router {
  const router = Router();

  router.get('/', (_request, response) => {
    const useCase = new GetChallengesUseCase(dependencies.challengeRepository);
    response.json(useCase.execute());
  });

  return router;
}
