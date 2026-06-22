import express from 'express';
import { buildRouter } from './router.js';

export function buildApp(): express.Application {
  const application = express();
  application.use(express.json());
  application.use('/api', buildRouter());
  return application;
}
