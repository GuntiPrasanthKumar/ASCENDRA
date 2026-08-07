const fs = require('fs').promises;
const path = require('path');
const { config } = require('../../config/env.config');
const logger = require('../logger/logger');

/**
 * Storage Abstraction Provider Interface
 */
class LocalStorageProvider {
  constructor(baseDir) {
    this.baseDir = baseDir || config.storage.uploadDir;
  }

  async ensureDirectoryExists(targetPath) {
    const dir = path.dirname(targetPath);
    await fs.mkdir(dir, { recursive: true });
  }

  async save(filename, buffer) {
    const fullPath = path.join(this.baseDir, filename);
    await this.ensureDirectoryExists(fullPath);
    await fs.writeFile(fullPath, buffer);
    logger.debug(`[LocalStorageProvider] Saved file: ${filename}`);
    return {
      filename,
      path: fullPath,
      size: buffer.length,
      driver: 'local'
    };
  }

  async read(filename) {
    const fullPath = path.join(this.baseDir, filename);
    return await fs.readFile(fullPath);
  }

  async delete(filename) {
    const fullPath = path.join(this.baseDir, filename);
    try {
      await fs.unlink(fullPath);
      logger.debug(`[LocalStorageProvider] Deleted file: ${filename}`);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') return false;
      throw err;
    }
  }

  async exists(filename) {
    const fullPath = path.join(this.baseDir, filename);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Cloud Storage Provider (GCS / S3 Abstract Placeholder)
 */
class CloudStorageProvider {
  constructor(bucketName) {
    this.bucketName = bucketName || 'ascendra-cloud-bucket';
  }

  async save(filename, buffer) {
    logger.info(`[CloudStorageProvider] Simulated Cloud Upload: ${filename} to ${this.bucketName}`);
    return {
      filename,
      url: `https://storage.googleapis.com/${this.bucketName}/${filename}`,
      size: buffer.length,
      driver: 'cloud'
    };
  }

  async read(filename) {
    throw new Error(`CloudStorageProvider read not implemented for ${filename}`);
  }

  async delete(filename) {
    logger.info(`[CloudStorageProvider] Simulated Cloud Delete: ${filename}`);
    return true;
  }

  async exists(filename) {
    return false;
  }
}

class StorageService {
  constructor() {
    const driver = config.storage.driver;
    if (driver === 'gcs' || driver === 's3') {
      this.provider = new CloudStorageProvider();
    } else {
      this.provider = new LocalStorageProvider();
    }
  }

  save(filename, buffer) {
    return this.provider.save(filename, buffer);
  }

  read(filename) {
    return this.provider.read(filename);
  }

  delete(filename) {
    return this.provider.delete(filename);
  }

  exists(filename) {
    return this.provider.exists(filename);
  }
}

const storageService = new StorageService();
module.exports = {
  storageService,
  StorageService,
  LocalStorageProvider,
  CloudStorageProvider
};
