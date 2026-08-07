const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class ConfigValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'ConfigValidationError';
    this.details = details;
  }
}

/**
 * Enterprise Configuration System
 * Validates and exposes environment variables with type safety and defaults.
 */
class ConfigurationSystem {
  constructor() {
    this.config = {};
    this.initialized = false;
  }

  load() {
    if (this.initialized) return this.config;

    const env = process.env.NODE_ENV || 'development';
    const errors = [];

    // Helper for required variables
    const getRequired = (key) => {
      const val = process.env[key];
      if (!val && env !== 'test') {
        errors.push(`Missing mandatory environment variable: ${key}`);
      }
      return val;
    };

    // Helper for optional variables with fallback defaults
    const getOptional = (key, defaultValue) => {
      return process.env[key] !== undefined ? process.env[key] : defaultValue;
    };

    const getNumber = (key, defaultValue) => {
      const val = process.env[key];
      if (val === undefined) return defaultValue;
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        errors.push(`Environment variable ${key} must be a valid integer`);
        return defaultValue;
      }
      return parsed;
    };

    const getBoolean = (key, defaultValue) => {
      const val = process.env[key];
      if (val === undefined) return defaultValue;
      return val === 'true' || val === '1';
    };

    this.config = {
      env: env,
      isProduction: env === 'production',
      isDevelopment: env === 'development',
      isTest: env === 'test',
      
      server: {
        port: getNumber('PORT', 5000),
        host: getOptional('HOST', '0.0.0.0'),
        apiPrefix: getOptional('API_PREFIX', '/api'),
        apiVersion: getOptional('API_VERSION', 'v1'),
      },

      db: {
        uri: getOptional('MONGODB_URI', 'mongodb://127.0.0.1:27017/ascendra_db'),
        maxPoolSize: getNumber('MONGODB_MAX_POOL_SIZE', 10),
        minPoolSize: getNumber('MONGODB_MIN_POOL_SIZE', 2),
        connectTimeoutMS: getNumber('MONGODB_CONNECT_TIMEOUT_MS', 10000),
        socketTimeoutMS: getNumber('MONGODB_SOCKET_TIMEOUT_MS', 45000),
      },

      jwt: {
        secret: getOptional('JWT_SECRET', 'ascendra_enterprise_jwt_secret_key_change_in_production_2026'),
        expire: getOptional('JWT_EXPIRE', '7d'),
      },

      cors: {
        origin: getOptional('CORS_ORIGIN', 'http://localhost:5173,http://localhost:5174,http://localhost:5175').split(','),
        credentials: getBoolean('CORS_CREDENTIALS', true),
      },

      rateLimit: {
        windowMs: getNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 minutes
        max: getNumber('RATE_LIMIT_MAX', 200), // Limit each IP to 200 requests per window
      },

      logging: {
        level: getOptional('LOG_LEVEL', env === 'production' ? 'info' : 'debug'),
        format: getOptional('LOG_FORMAT', env === 'production' ? 'json' : 'pretty'),
      },

      storage: {
        driver: getOptional('STORAGE_DRIVER', 'local'), // 'local' or 'gcs' or 's3'
        uploadDir: getOptional('STORAGE_UPLOAD_DIR', path.resolve(__dirname, '../../uploads')),
      },

      featureFlags: {
        enableAiProctoring: getBoolean('FF_AI_PROCTORING', true),
        enableCodeLabMonaco: getBoolean('FF_CODELAB_MONACO', true),
        enableLiveAudio: getBoolean('FF_LIVE_AUDIO', true),
        enableSwaggerDocs: getBoolean('FF_SWAGGER_DOCS', true),
      }
    };

    if (errors.length > 0 && env === 'production') {
      throw new ConfigValidationError('Configuration initialization failed due to validation errors', errors);
    }

    this.initialized = true;
    return this.config;
  }

  get(keyPath) {
    if (!this.initialized) {
      this.load();
    }
    return keyPath.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), this.config);
  }
}

const configInstance = new ConfigurationSystem();
module.exports = {
  config: configInstance.load(),
  configSystem: configInstance,
  ConfigValidationError
};
