const store = require('../store/inMemoryStore');
const { createTask, updateTask, findAllByUser } = require('../repositories/taskRepository');

describe('taskRepository', () => {
  beforeEach(() => {
    store.tasks.length = 0;
  });

  test('updateTask strips immutable fields (id, createdBy, createdAt)', async () => {
    const task = await createTask({ title: 'Test', createdBy: 'user-1' });
    const originalId = task.id;
    const originalCreatedBy = task.createdBy;
    const originalCreatedAt = task.createdAt;

    // Attempt to overwrite immutable fields
    const updated = await updateTask(task.id, {
      title: 'Updated',
      id: 'hacked-id',
      createdBy: 'hacked-user',
      createdAt: '1999-01-01T00:00:00.000Z',
    });

    expect(updated.id).toBe(originalId);
    expect(updated.createdBy).toBe(originalCreatedBy);
    expect(updated.createdAt).toBe(originalCreatedAt);
    expect(updated.title).toBe('Updated');
  });

  test('findAllByUser returns pagination metadata', async () => {
    await createTask({ title: 'A', createdBy: 'user-1' });
    await createTask({ title: 'B', createdBy: 'user-1' });
    await createTask({ title: 'C', createdBy: 'user-1' });

    const result = await findAllByUser('user-1', { page: 1, limit: 2 });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.total).toBe(3);
    expect(result.items).toHaveLength(2);
  });

  test('findAllByUser returns totalPages=1 when no tasks exist', async () => {
    const result = await findAllByUser('user-1', { page: 1, limit: 10 });
    expect(result.totalPages).toBe(1);
    expect(result.total).toBe(0);
    expect(result.items).toHaveLength(0);
  });
});
