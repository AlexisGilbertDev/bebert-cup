import { env } from './config/env.js';
import { buildApp } from './infrastructure/http/server.js';

const application = buildApp();

application.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
