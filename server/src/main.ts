import { env } from './config/env.js';
import { buildApp } from './infrastructure/http/server.js';
import { InMemoryChallengeRepository } from './infrastructure/repositories/in-memory-challenge.repository.js';

const dependencies = {
  challengeRepository: new InMemoryChallengeRepository(),
};

const application = buildApp(dependencies);

application.listen(env.PORT);
