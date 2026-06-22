import express from 'express';
import type { AppDependencies } from './router.js';
import { buildRouter } from './router.js';

export function buildApp(dependencies: AppDependencies): express.Application {
  const application = express();
  application.use(express.json());
  application.use('/api', buildRouter(dependencies));
  return application;
}
