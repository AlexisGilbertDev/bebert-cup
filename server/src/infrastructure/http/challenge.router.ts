import { Router } from 'express';
import { GetSurvivorChallengesUseCase } from '../../application/use-cases/get-survivor-challenges.use-case.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';

export function buildChallengeRouter(dependencies: {
  challengeRepository: ChallengeRepositoryPort;
}): Router {
  const router = Router();

  router.get('/', (_request, response) => {
    const useCase = new GetSurvivorChallengesUseCase(dependencies.challengeRepository);
    response.json(useCase.execute());
  });

  return router;
}
