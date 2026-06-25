import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';

export class GetTeamPlayChallengesUseCase {
  constructor(private readonly challengeRepository: ChallengeRepositoryPort) {}

  execute(): Challenge[] {
    return this.challengeRepository.findTeamPlayChallenges();
  }
}
