const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().optional(),
});

const updateTaskSchema = createTaskSchema.partial();

const patchStatusSchema = z.object({ status: z.enum(['todo', 'in-progress', 'completed']) });

module.exports = {
  registerSchema, loginSchema, createTaskSchema, updateTaskSchema, patchStatusSchema,
};
