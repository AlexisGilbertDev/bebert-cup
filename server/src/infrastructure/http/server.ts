import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from '../../config/env.js';
import type { AppDependencies } from './router.js';
import { buildRouter } from './router.js';

export function buildApp(dependencies: AppDependencies): express.Application {
  const application = express();
  application.use(helmet());
  application.use(cors({ origin: env.CORS_ORIGIN }));
  application.use(express.json());
  application.use('/api', buildRouter(dependencies));
  application.use((_error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    console.error(_error);
    response.status(500).json({ error: 'Internal server error' });
  });
  return application;
}
