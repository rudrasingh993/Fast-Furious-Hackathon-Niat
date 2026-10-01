import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import { app } from '../src/server/app.js';
import http from 'http';

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}/api`;
      resolve();
    });
  });
});

test.after(() => {
  server?.close();
});

describe('Authentication Flow Tests', () => {
  const testUser = {
    name: 'Test Explorer',
    email: `test-${Date.now()}@example.com`,
    password: 'password123!',
  };

  let token = '';

  test('POST /api/auth/signup - should register new user', async () => {
    const res = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const body = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.user.email, testUser.email.toLowerCase());
    assert.ok(body.data.tokens.accessToken);
    token = body.data.tokens.accessToken;
  });

  test('POST /api/auth/signup - should reject duplicate email', async () => {
    const res = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const body = await res.json();
    assert.strictEqual(res.status, 409);
    assert.strictEqual(body.success, false);
    assert.ok(body.error.message.includes('already exists'));
  });

  test('POST /api/auth/login - should log in with correct credentials', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.ok(body.data.tokens.accessToken);
  });

  test('POST /api/auth/login - should reject invalid password', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: 'wrong-password-123',
      }),
    });

    const body = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(body.success, false);
  });

  test('GET /api/auth/me - should return authenticated user profile', async () => {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.email, testUser.email.toLowerCase());
  });

  test('GET /api/auth/me - should reject request without token', async () => {
    const res = await fetch(`${baseUrl}/auth/me`);
    const body = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(body.success, false);
  });
});
