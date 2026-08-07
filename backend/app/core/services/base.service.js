const logger = require('../logger/logger');

/**
 * Base Service Class for Clean Architecture Domain Services
 */
class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  async getById(id) {
    return await this.repository.findById(id);
  }

  async list(query = {}, options = {}) {
    return await this.repository.findMany(query, options);
  }

  async create(data) {
    logger.debug(`[${this.constructor.name}] Creating entity`, { data });
    return await this.repository.create(data);
  }

  async update(id, data) {
    logger.debug(`[${this.constructor.name}] Updating entity ${id}`, { data });
    return await this.repository.updateById(id, data);
  }

  async delete(id) {
    logger.debug(`[${this.constructor.name}] Deleting entity ${id}`);
    return await this.repository.deleteById(id);
  }
}

module.exports = BaseService;
