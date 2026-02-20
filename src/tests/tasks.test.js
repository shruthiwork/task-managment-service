const request = require('supertest');
const app = require('../app');
const store = require('../store/inMemoryStore');

async function registerAndLogin(email = 'u@example.com') {
  await request(app).post('/api/v1/auth/register').send({ name: 'U', email, password: 'Password1' });
  const res = await request(app).post('/api/v1/auth/login').send({ email, password: 'Password1' });
  return res.body.data.token;
}

describe('Task routes (protected)', () => {
  beforeEach(() => {
    store.users.length = 0;
    store.tasks.length = 0;
  });

  test('Protected route without token returns 401', async () => {
    const res = await request(app).get('/api/v1/tasks');
    expect(res.status).toBe(401);
  });

  test('Create, get, update, patch status, delete task', async () => {
    const token = await registerAndLogin('owner@example.com');

    // create
    const createRes = await request(app).post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'T1' });
    expect(createRes.status).toBe(201);
    const task = createRes.body.data;

    // get
    const getRes = await request(app).get(`/api/v1/tasks/${task.id}`).set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);

    // update
    const updateRes = await request(app).put(`/api/v1/tasks/${task.id}`).set('Authorization', `Bearer ${token}`).send({ title: 'T1 Updated', priority: 'high' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.title).toBe('T1 Updated');

    // patch status
    const patchRes = await request(app).patch(`/api/v1/tasks/${task.id}/status`).set('Authorization', `Bearer ${token}`).send({ status: 'in-progress' });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.status).toBe('in-progress');

    // delete
    const delRes = await request(app).delete(`/api/v1/tasks/${task.id}`).set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(200);
  });

  test('Users cannot access others tasks', async () => {
    const t1 = await registerAndLogin('alice@example.com');
    const t2 = await registerAndLogin('bob@example.com');

    // Alice creates task
    const r = await request(app).post('/api/v1/tasks').set('Authorization', `Bearer ${t1}`).send({ title: 'Alice Task' });
    const task = r.body.data;

    // Bob tries to access
    const res = await request(app).get(`/api/v1/tasks/${task.id}`).set('Authorization', `Bearer ${t2}`);
    expect(res.status).toBe(403);
  });

  test('Validation failure returns 400', async () => {
    const token = await registerAndLogin('val@example.com');
    const res = await request(app).post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send({});
    expect(res.status).toBe(400);
  });

  test('Listing supports pagination, filtering and sorting', async () => {
    const token = await registerAndLogin('list@example.com');
    // create multiple tasks
    await request(app).post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'A', dueDate: '2026-01-01' });
    await request(app).post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'B', priority: 'high', dueDate: '2026-01-02' });
    await request(app).post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'C', status: 'completed', dueDate: '2026-01-03' });

    const res = await request(app).get('/api/v1/tasks?limit=2&page=1&priority=high&sortBy=dueDate&order=asc').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('items');
  });
});
