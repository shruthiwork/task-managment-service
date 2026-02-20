const request = require('supertest');
const app = require('../app');
const store = require('../store/inMemoryStore');

describe('Auth routes', () => {
  beforeEach(() => {
    store.users.length = 0;
    store.tasks.length = 0;
  });

  test('Register a user successfully', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test',
      email: 'test@example.com',
      password: 'Password1',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('email', 'test@example.com');
  });

  test('Prevent duplicate registration', async () => {
    await request(app).post('/api/v1/auth/register').send({ name: 'A', email: 'a@example.com', password: 'pass123' });
    const res = await request(app).post('/api/v1/auth/register').send({ name: 'B', email: 'a@example.com', password: 'pass456' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
  });

  test('Login returns token', async () => {
    await request(app).post('/api/v1/auth/register').send({ name: 'L', email: 'l@example.com', password: 'pass123' });
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'l@example.com', password: 'pass123' });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });

  test('Invalid credentials return 401', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'nope@example.com', password: 'x' });
    expect(res.status).toBe(400);
  });
});
