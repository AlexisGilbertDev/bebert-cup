import { Router } from 'express';
import { GetTeamPlayChallengesUseCase } from '../../application/use-cases/get-team-play-challenges.use-case.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';

export function buildTeamPlayRouter(dependencies: {
  challengeRepository: ChallengeRepositoryPort;
}): Router {
  const router = Router();

  router.get('/challenges', (_request, response) => {
    const useCase = new GetTeamPlayChallengesUseCase(
      dependencies.challengeRepository,
    );
    response.json(useCase.execute());
  });

  return router;
}
