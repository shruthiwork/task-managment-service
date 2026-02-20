const { v4: uuidv4 } = require('uuid');
const store = require('../store/inMemoryStore');

async function createTask(data) {
  const now = new Date().toISOString();
  const task = {
    id: uuidv4(),
    title: data.title,
    description: data.description || '',
    status: data.status || 'todo',
    priority: data.priority || 'medium',
    dueDate: data.dueDate || null,
    createdBy: data.createdBy,
    createdAt: now,
    updatedAt: now,
  };
  store.tasks.push(task);
  return task;
}

async function findById(id) {
  return store.tasks.find((t) => t.id === id) || null;
}

async function updateTask(id, updates) {
  const task = await findById(id);
  if (!task) return null;
  Object.assign(task, updates, { updatedAt: new Date().toISOString() });
  return task;
}

async function deleteTask(id) {
  const idx = store.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  store.tasks.splice(idx, 1);
  return true;
}

async function findAllByUser(userId, {
  filters = {}, sort = {}, page = 1, limit = 10,
}) {
  let items = store.tasks.filter((t) => t.createdBy === userId);

  if (filters.status) items = items.filter((t) => t.status === filters.status);
  if (filters.priority) items = items.filter((t) => t.priority === filters.priority);

  if (sort.by) {
    const dir = sort.order === 'desc' ? -1 : 1;
    items.sort((a, b) => {
      if (!a[sort.by]) return 1 * dir;
      if (!b[sort.by]) return -1 * dir;
      return (a[sort.by] > b[sort.by] ? 1 : -1) * dir;
    });
  }

  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);
  return { items: paged, total };
}

module.exports = {
  createTask, findById, updateTask, deleteTask, findAllByUser,
};
