import { Router } from 'express';
import { GetDuelChallengesUseCase } from '../../application/use-cases/get-duel-challenges.use-case.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';

export function buildDuelRouter(dependencies: {
  challengeRepository: ChallengeRepositoryPort;
}): Router {
  const router = Router();

  router.get('/challenges', (_request, response) => {
    const useCase = new GetDuelChallengesUseCase(
      dependencies.challengeRepository,
    );
    response.json(useCase.execute());
  });

  return router;
}
