import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import { app } from '../src/server/app.js';
import http from 'http';

let server;
let baseUrl;
let token;
let userId;

before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}/api`;
      resolve();
    });
  });

  // Create test user and get token
  const signupRes = await fetch(`${baseUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'API Tester',
      email: `api-tester-${Date.now()}@example.com`,
      password: 'StrongPassword123!',
    }),
  });
  const data = await signupRes.json();
  token = data.data.tokens.accessToken;
  userId = data.data.user.id;
});

test.after(() => {
  server?.close();
});

describe('Multi Mind AI Core API Integration Tests', () => {
  let testConvId = '';

  test('GET /api/health - should return ok and service identifier', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.ok, true);
    assert.ok(body.service === 'multimind-ai-api' || body.service === 'mosaic-ai-api');
    assert.ok(body.timestamp);
  });

  test('POST /api/conversations - should create a new conversation', async () => {
    const res = await fetch(`${baseUrl}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Quantum Computing Research',
        category: 'RESEARCH',
      }),
    });

    const body = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.title, 'Quantum Computing Research');
    testConvId = body.data.id;
  });

  test('GET /api/conversations - should list user conversations', async () => {
    const res = await fetch(`${baseUrl}/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.some((c) => c.id === testConvId));
  });

  test('POST /api/conversations/:id/messages - should process prompt and generate assistant answer with reasoning summary', async () => {
    const res = await fetch(`${baseUrl}/conversations/${testConvId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: 'Explain the principles of quantum superposition and entanglement concisely.',
        enable_web_search: false,
      }),
    });

    const body = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    assert.ok(body.data.userMessage);
    assert.ok(body.data.assistantMessage);
    assert.ok(body.data.assistantMessage.content.length > 0);
    assert.ok(body.data.assistantMessage.reasoning_summary);
    assert.ok(body.data.assistantMessage.reasoning_summary.intent);
  });

  test('POST /api/search/web - should return web grounded search results and queries', async () => {
    const res = await fetch(`${baseUrl}/search/web`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: 'Latest advancements in multimodal AI 2026',
        conversation_id: testConvId,
      }),
    });

    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.ok(body.data.answer);
    assert.ok(Array.isArray(body.data.sources));
    assert.ok(body.data.sources.length > 0);
    assert.ok(body.data.sources[0].url.startsWith('http'));
  });

  test('POST /api/research - should initiate deep research workflow', async () => {
    const res = await fetch(`${baseUrl}/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        objective: 'Evaluate architectural differences between Gemini multimodal models and legacy text models',
        conversation_id: testConvId,
      }),
    });

    const body = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    assert.ok(body.data.id);
    assert.strictEqual(body.data.objective.includes('architectural differences'), true);
  });

  test('POST /api/knowledge/extract - should extract structured entities and facts from text', async () => {
    const sampleText = `Dr. Elena Vance founded Black Mesa AI in Geneva on March 14, 2025. The organization develops quantum sensors and multimodal perception software. Key milestone: launch test in November 2026.`;

    const res = await fetch(`${baseUrl}/knowledge/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        source_type: 'text',
        text_content: sampleText,
        conversation_id: testConvId,
      }),
    });

    const body = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length > 0);
  });

  test('GET /api/knowledge - should retrieve stored knowledge items', async () => {
    const res = await fetch(`${baseUrl}/knowledge`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  test('GET /api/user/preferences & PATCH /api/user/preferences - should store user personalization', async () => {
    const patchRes = await fetch(`${baseUrl}/user/preferences`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        preference_key: 'preferred_style',
        preference_value: { style: 'concise', highlight_code: true },
      }),
    });
    const patchBody = await patchRes.json();
    assert.strictEqual(patchRes.status, 200);
    assert.strictEqual(patchBody.success, true);

    const getRes = await fetch(`${baseUrl}/user/preferences`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getBody = await getRes.json();
    assert.strictEqual(getRes.status, 200);
    const styleVal = getBody.data.preferred_style?.style || getBody.data.preferences?.preferred_style?.style;
    assert.strictEqual(styleVal, 'concise');
  });
});
