import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  status: Joi.string().valid('PENDING', 'COMPLETED').optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
});
