const {
  createTask, findById, updateTask, deleteTask, findAllByUser,
} = require('../repositories/taskRepository');

async function create(userId, payload) {
  const data = { ...payload, createdBy: userId };
  const task = await createTask(data);
  return task;
}

async function list(userId, {
  page = 1, limit = 10, status, priority, sortBy, order,
}) {
  const filters = {};
  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  const sort = {};
  if (sortBy) sort.by = sortBy;
  if (order) sort.order = order;
  const result = await findAllByUser(userId, {
    filters, sort, page: Number(page), limit: Number(limit),
  });
  return result;
}

async function getById(userId, id) {
  const task = await findById(id);
  if (!task) throw { status: 404, message: 'Task not found' };
  if (task.createdBy !== userId) throw { status: 403, message: 'Forbidden' };
  return task;
}

async function update(userId, id, updates) {
  const task = await findById(id);
  if (!task) throw { status: 404, message: 'Task not found' };
  if (task.createdBy !== userId) throw { status: 403, message: 'Forbidden' };
  const fields = ['title', 'description', 'status', 'priority', 'dueDate'];
  const payload = {};
  fields.forEach((f) => {
    if (Object.prototype.hasOwnProperty.call(updates, f)) payload[f] = updates[f];
  });
  const updated = await updateTask(id, payload);
  return updated;
}

async function remove(userId, id) {
  const task = await findById(id);
  if (!task) throw { status: 404, message: 'Task not found' };
  if (task.createdBy !== userId) throw { status: 403, message: 'Forbidden' };
  const ok = await deleteTask(id);
  return ok;
}

async function patchStatus(userId, id, status) {
  const task = await findById(id);
  if (!task) throw { status: 404, message: 'Task not found' };
  if (task.createdBy !== userId) throw { status: 403, message: 'Forbidden' };
  const updated = await updateTask(id, { status });
  return updated;
}

module.exports = {
  create, list, getById, update, remove, patchStatus,
};
