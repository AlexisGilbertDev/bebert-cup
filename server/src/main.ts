import { buildApp } from './infrastructure/http/server.js';
import { env } from './config/env.js';

const application = buildApp();

application.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
