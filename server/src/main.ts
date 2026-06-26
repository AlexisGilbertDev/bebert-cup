import { existsSync } from 'fs';
import { resolve } from 'path';
import express from 'express';
import { env } from './config/env.js';
import { buildApp } from './infrastructure/http/server.js';
import { InMemoryChallengeRepository } from './infrastructure/repositories/in-memory-challenge.repository.js';

const dependencies = {
  challengeRepository: new InMemoryChallengeRepository(),
};

const application = buildApp(dependencies);

const clientDist = resolve(__dirname, '../../client/dist');
if (existsSync(clientDist)) {
  application.use(express.static(clientDist));
  application.get('*', (_request, response) => {
    response.sendFile(resolve(clientDist, 'index.html'));
  });
}

application.listen(env.PORT);
