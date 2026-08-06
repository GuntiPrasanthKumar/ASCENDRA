const { DatabaseError, NotFoundError } = require('../errors/app.error');

/**
 * Base Repository Pattern for Clean Architecture
 * Wraps Mongoose Data Access Operations
 */
class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('BaseRepository requires a Mongoose Model');
    }
    this.model = model;
  }

  async create(data) {
    try {
      return await this.model.create(data);
    } catch (err) {
      throw new DatabaseError(`Failed to create ${this.model.modelName}`, err.message);
    }
  }

  async findById(id, select = '') {
    try {
      const doc = await this.model.findById(id).select(select);
      if (!doc) {
        throw new NotFoundError(this.model.modelName);
      }
      return doc;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError(`Failed to find ${this.model.modelName} by ID`, err.message);
    }
  }

  async findOne(query = {}, select = '') {
    try {
      return await this.model.findOne(query).select(select);
    } catch (err) {
      throw new DatabaseError(`Failed to find ${this.model.modelName}`, err.message);
    }
  }

  async findMany(query = {}, options = {}) {
    try {
      const { page = 1, limit = 20, sort = { createdAt: -1 }, select = '' } = options;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.model.find(query).select(select).sort(sort).skip(skip).limit(limit),
        this.model.countDocuments(query)
      ]);

      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (err) {
      throw new DatabaseError(`Failed to query ${this.model.modelName} collection`, err.message);
    }
  }

  async updateById(id, updateData, options = { new: true, runValidators: true }) {
    try {
      const doc = await this.model.findByIdAndUpdate(id, updateData, options);
      if (!doc) {
        throw new NotFoundError(this.model.modelName);
      }
      return doc;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError(`Failed to update ${this.model.modelName}`, err.message);
    }
  }

  async deleteById(id) {
    try {
      const doc = await this.model.findByIdAndDelete(id);
      if (!doc) {
        throw new NotFoundError(this.model.modelName);
      }
      return doc;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError(`Failed to delete ${this.model.modelName}`, err.message);
    }
  }
}

module.exports = BaseRepository;
