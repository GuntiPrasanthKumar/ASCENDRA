process.env.NODE_ENV = 'test';
process.env.PORT = '5001';

const logger = require('../core/logger/logger');

logger.info('[TestSetup] Environment initialized for automated testing execution');
