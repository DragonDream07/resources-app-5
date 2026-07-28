import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

const app = createApp();
const PORT = config.port || 3000;

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
