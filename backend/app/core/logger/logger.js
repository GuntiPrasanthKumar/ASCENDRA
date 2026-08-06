const { config } = require('../../config/env.config');

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

class Logger {
  constructor() {
    this.level = config.logging?.level || 'info';
    this.format = config.logging?.format || 'pretty';
  }

  shouldLog(level) {
    return (LOG_LEVELS[level] !== undefined ? LOG_LEVELS[level] : 2) <= (LOG_LEVELS[this.level] !== undefined ? LOG_LEVELS[this.level] : 2);
  }

  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const pid = process.pid;

    if (this.format === 'json') {
      return JSON.stringify({
        timestamp,
        level: level.toUpperCase(),
        pid,
        message,
        ...context
      });
    }

    const contextStr = Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [PID:${pid}]: ${message}${contextStr}`;
  }

  info(message, context = {}) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  warn(message, context = {}) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message, context = {}) {
    if (this.shouldLog('error')) {
      if (context instanceof Error) {
        context = { stack: context.stack, message: context.message };
      }
      console.error(this.formatMessage('error', message, context));
    }
  }

  debug(message, context = {}) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

const logger = new Logger();
module.exports = logger;
