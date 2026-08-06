const mongoose = require('mongoose');
const logger = require('../logger/logger');
const { config } = require('../../config/env.config');

class MongooseConnectionLayer {
  constructor() {
    this.isConnected = false;
    this.connection = null;
    this.reconnectTimer = null;
  }

  async connect() {
    if (this.isConnected && mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const options = {
      maxPoolSize: config.db.maxPoolSize,
      minPoolSize: config.db.minPoolSize,
      connectTimeoutMS: config.db.connectTimeoutMS,
      socketTimeoutMS: config.db.socketTimeoutMS,
    };

    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      logger.info('MongoDB database connection established successfully', {
        host: mongoose.connection.host,
        name: mongoose.connection.name
      });
    });

    mongoose.connection.on('error', (err) => {
      this.isConnected = false;
      logger.error('MongoDB database connection error encountered', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      logger.warn('MongoDB database connection disconnected');
    });

    try {
      this.connection = await mongoose.connect(config.db.uri, options);
      this.isConnected = true;
      return this.connection;
    } catch (err) {
      this.isConnected = false;
      logger.error('Failed to establish MongoDB database connection', { error: err.message });
      if (config.isProduction) {
        throw err;
      }
      return null;
    }
  }

  async disconnect() {
    if (!this.isConnected && mongoose.connection.readyState === 0) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('MongoDB database connection closed gracefully');
    } catch (err) {
      logger.error('Error during MongoDB database disconnect', { error: err.message });
    }
  }

  getStatus() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    };
    const readyState = mongoose.connection ? mongoose.connection.readyState : 0;
    return {
      state: states[readyState] || 'unknown',
      readyState,
      isConnected: readyState === 1,
      host: mongoose.connection ? mongoose.connection.host : null,
      dbName: mongoose.connection ? mongoose.connection.name : null
    };
  }
}

const databaseInstance = new MongooseConnectionLayer();

const connectDB = async () => {
  return await databaseInstance.connect();
};

module.exports = {
  connectDB,
  databaseInstance,
  MongooseConnectionLayer
};
