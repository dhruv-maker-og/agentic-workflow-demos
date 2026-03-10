const app = require('./app');

const request = require('supertest');

describe('Health Check', () => {
  test('GET /health returns 200 with status healthy', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.timestamp).toBeDefined();
  });
});

describe('Users API', () => {
  test('GET /api/users returns array of users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/users/:id returns user when found', async () => {
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBeDefined();
  });

  test('GET /api/users/:id returns 404 for non-existent user', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  test('GET /api/users/:id returns 400 for invalid ID', async () => {
    const response = await request(app).get('/api/users/abc');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid user ID');
  });
});
