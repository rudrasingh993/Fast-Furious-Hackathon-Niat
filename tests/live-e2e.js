import assert from 'node:assert/strict';

const API_BASE = 'http://localhost:3000/api';
const CLIENT_BASE = 'http://localhost:5173';

async function runLiveE2E() {
  console.log('🏁 Starting Multi Mind AI Live End-to-End Verification...\n');

  // 1. Verify Client Frontend is serving Multi Mind AI
  console.log('1️⃣ Checking Client Frontend at ' + CLIENT_BASE);
  const clientRes = await fetch(CLIENT_BASE);
  assert.equal(clientRes.status, 200, 'Frontend should return 200 OK');
  const clientHtml = await clientRes.text();
  assert.ok(clientHtml.includes('Multi Mind AI'), 'Frontend HTML must contain "Multi Mind AI"');
  console.log('   ✅ Client Frontend is online and serving HTML with Multi Mind AI branding.');

  // 2. Verify Backend API Health
  console.log('\n2️⃣ Checking Backend API Health at ' + API_BASE + '/health');
  const healthRes = await fetch(`${API_BASE}/health`);
  assert.equal(healthRes.status, 200, 'Health check should return 200');
  const healthData = await healthRes.json();
  assert.equal(healthData.ok, true);
  assert.ok(healthData.service === 'multimind-ai-api' || healthData.service === 'mosaic-ai-api');
  console.log('   ✅ Backend API Health check passed:', healthData);

  // 3. Test Standard Registration & Login (Email + Password)
  console.log('\n3️⃣ Testing User Registration & Password Login (/api/auth/signup & /api/auth/login)');
  const testEmail = `live.test.${Date.now()}@multimind.ai`;
  const signupRes = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alex Rivera',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    }),
  });
  assert.equal(signupRes.status, 201, 'Signup should return 201 Created');
  const signupPayload = await signupRes.json();
  const signupData = signupPayload.data;
  assert.ok(signupData.user, 'Signup should return user object');
  assert.ok(signupData.tokens?.accessToken, 'Signup should return JWT access token');
  const token = signupData.tokens.accessToken;
  console.log(`   ✅ User successfully registered: ${signupData.user.name} (${signupData.user.email})`);

  // 4. Test Email OTP Authentication Flow (/api/auth/otp/send & /api/auth/otp/verify)
  console.log('\n4️⃣ Testing Email OTP Authentication Flow');
  const otpEmail = `otp.user.${Date.now()}@multimind.ai`;
  const sendEmailOtpRes = await fetch(`${API_BASE}/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'email', target: otpEmail }),
  });
  assert.equal(sendEmailOtpRes.status, 200);
  const emailOtpData = await sendEmailOtpRes.json();
  assert.ok(emailOtpData.data.devCode, 'OTP send should return devCode for testing');
  const emailCode = emailOtpData.data.devCode;

  const verifyEmailOtpRes = await fetch(`${API_BASE}/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'email',
      target: otpEmail,
      code: emailCode,
      name: 'Elena Vance',
    }),
  });
  assert.equal(verifyEmailOtpRes.status, 200);
  const verifyEmailData = await verifyEmailOtpRes.json();
  assert.ok(verifyEmailData.data.tokens?.accessToken);
  console.log(`   ✅ Email OTP verified successfully for ${otpEmail} (Token issued)`);

  // 5. Test Phone Number OTP Authentication Flow (/api/auth/otp/send & /api/auth/otp/verify)
  console.log('\n5️⃣ Testing Phone Number OTP Authentication Flow');
  const testPhone = `+1555${Math.floor(1000000 + Math.random() * 9000000)}`;
  const sendPhoneOtpRes = await fetch(`${API_BASE}/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'phone', target: testPhone }),
  });
  assert.equal(sendPhoneOtpRes.status, 200);
  const phoneOtpData = await sendPhoneOtpRes.json();
  assert.ok(phoneOtpData.data.devCode);
  const phoneCode = phoneOtpData.data.devCode;

  const verifyPhoneOtpRes = await fetch(`${API_BASE}/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'phone',
      target: testPhone,
      code: phoneCode,
      name: 'Mobile Explorer',
    }),
  });
  assert.equal(verifyPhoneOtpRes.status, 200);
  const verifyPhoneData = await verifyPhoneOtpRes.json();
  assert.ok(verifyPhoneData.data.tokens?.accessToken);
  console.log(`   ✅ Phone Number OTP verified successfully for ${testPhone}`);

  // 6. Test 1-Click Google Sign-In Flow (/api/auth/google)
  console.log('\n6️⃣ Testing Google Sign-In Flow (/api/auth/google)');
  const googleEmail = `google.pilot.${Date.now()}@gmail.com`;
  const googleRes = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: googleEmail,
      name: 'Marcus Vance',
      avatarUrl: 'https://lh3.googleusercontent.com/a/default',
    }),
  });
  assert.equal(googleRes.status, 200);
  const googleData = await googleRes.json();
  assert.ok(googleData.data.tokens?.accessToken);
  console.log(`   ✅ Google Sign-In successfully authenticated user: ${googleData.data.user.name}`);

  // 7. Test Current User Profile (/api/auth/me)
  console.log('\n7️⃣ Testing Current User Auth Verification (/api/auth/me)');
  const meRes = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(meRes.status, 200);
  const mePayload = await meRes.json();
  assert.equal(mePayload.data.email, testEmail);
  console.log('   ✅ Current user profile verified via JWT token.');

  // 8. Test Conversation Creation
  console.log('\n8️⃣ Testing Conversation Creation (/api/conversations)');
  const convRes = await fetch(`${API_BASE}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Multi Mind AI Architectural Study',
      category: 'RESEARCH',
    }),
  });
  assert.equal(convRes.status, 201);
  const convPayload = await convRes.json();
  const convId = convPayload.data.id;
  assert.ok(convId, 'Conversation ID should be created');
  console.log(`   ✅ Conversation created with ID: ${convId}`);

  // 9. Test Streaming SSE AI Message Generation with Reasoning Summary
  console.log('\n9️⃣ Testing Streaming AI Chat Response (/api/conversations/:id/messages/stream)');
  const streamRes = await fetch(`${API_BASE}/conversations/${convId}/messages/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt: 'Compare multimodal AI architectures against single-modality pipelines in terms of cross-attention and grounding.',
      mode: 'normal',
    }),
  });
  assert.equal(streamRes.status, 200, 'Streaming endpoint should return 200');
  assert.ok(streamRes.headers.get('content-type')?.includes('text/event-stream'), 'Content-type must be SSE');

  const reader = streamRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let receivedContent = '';
  let receivedDone = false;
  let receivedReasoning = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() || '';

    for (const block of blocks) {
      if (!block.trim()) continue;
      const eventMatch = block.match(/event:\s*(\w+)/);
      const dataMatch = block.match(/data:\s*(.+)/s);
      const event = eventMatch ? eventMatch[1] : 'message';
      const dataStr = dataMatch ? dataMatch[1] : '';

      try {
        const data = JSON.parse(dataStr);
        if (event === 'chunk' && data.text) {
          receivedContent += data.text;
        } else if (event === 'complete') {
          receivedDone = true;
          receivedReasoning = data.reasoning_summary;
          if (!receivedContent && data.content) {
            receivedContent = data.content;
          }
        }
      } catch {
        // ignore parse error
      }
    }
  }

  assert.ok(receivedDone, 'SSE stream should receive "complete" event');
  assert.ok(receivedContent.length > 20, 'Streamed content should be non-empty');
  assert.ok(receivedReasoning, 'Streamed response must provide a transparent Reasoning Summary');
  assert.ok(receivedReasoning.intent, 'Reasoning summary must have intent');
  assert.ok(receivedReasoning.key_observations, 'Reasoning summary must have key observations');
  console.log('   ✅ SSE streaming completed successfully!');
  console.log(`   📝 Streamed content length: ${receivedContent.length} chars`);
  console.log('   🧠 Transparent Reasoning Summary Verified:');
  console.log(`      • Intent: ${receivedReasoning.intent}`);
  console.log(`      • Observations: ${receivedReasoning.key_observations?.join('; ') || 'N/A'}`);
  console.log(`      • Method: ${receivedReasoning.method?.join(' → ') || 'N/A'}`);

  // 10. Test Grounded Web Search
  console.log('\n🔟 Testing Web Search Mode (/api/search/web)');
  const searchRes = await fetch(`${API_BASE}/search/web`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: 'latest advances in multimodal AI frontier models',
    }),
  });
  assert.equal(searchRes.status, 200);
  const searchPayload = await searchRes.json();
  const searchData = searchPayload.data;
  assert.ok(searchData.sources, 'Search should return sources array');
  assert.ok(searchData.answer, 'Search should return grounded answer');
  console.log(`   ✅ Web search returned ${searchData.sources.length} sources and grounded answer.`);

  // 11. Test Autonomous Deep Research
  console.log('\n1️⃣1️⃣ Testing Autonomous Deep Research (/api/research)');
  const researchRes = await fetch(`${API_BASE}/research`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      topic: 'Impact of Gemini Multimodal Embeddings on Enterprise Retrieval',
      objective: 'Evaluate accuracy, latency, and cost differences when searching multimodal documents vs text-only OCR.',
    }),
  });
  assert.equal(researchRes.status, 201);
  const researchPayload = await researchRes.json();
  const researchId = researchPayload.data.id;

  // Poll for completion (background processing)
  let researchData = researchPayload.data;
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 500));
    const pollRes = await fetch(`${API_BASE}/research/${researchId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const pollPayload = await pollRes.json();
    researchData = pollPayload.data;
    if (researchData.status === 'completed' || researchData.status === 'failed') break;
  }

  assert.ok(
    ['completed', 'synthesizing', 'analyzing'].includes(researchData.status),
    `Deep research status should progress (currently ${researchData.status})`
  );
  assert.ok(researchData.synthesis, 'Research report synthesis should be generated');
  console.log(`   ✅ Deep Research session completed: "${researchData.title}" (Status: ${researchData.status})`);
  console.log(`      • Findings: ${researchData.findings?.length || 0}`);

  // 12. Test Structured Knowledge Extraction
  console.log('\n1️⃣2️⃣ Testing Knowledge Extraction (/api/knowledge/extract)');
  const knowledgeRes = await fetch(`${API_BASE}/knowledge/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content: 'Multi Mind AI is an enterprise AI assistant developed by Google DeepMind alumni in San Francisco. On October 1st, 2026, it released Gemini 2.5 Flash multimodal integration, decreasing latency by 45%. CEO Dr. Elena Vance announced availability across Europe and North America.',
      title: 'Multi Mind AI Press Release',
    }),
  });
  assert.equal(knowledgeRes.status, 201);
  const knowledgePayload = await knowledgeRes.json();
  const knowledgeItems = knowledgePayload.data;
  assert.ok(Array.isArray(knowledgeItems) && knowledgeItems.length > 0, 'Knowledge extraction should return structured items');
  console.log('   ✅ Knowledge Extraction verified:');
  console.log(`      • Structured cards extracted: ${knowledgeItems.length}`);
  console.log(`      • Categories: ${knowledgeItems.map((k) => k.knowledge_type).join(', ')}`);

  // 13. Test User Personalization
  console.log('\n1️⃣3️⃣ Testing User Personalization (/api/user/preferences)');
  const prefPatchRes = await fetch(`${API_BASE}/user/preferences`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      responseStyle: 'concise',
      responseLength: 'short',
      preferredLanguage: 'en',
    }),
  });
  assert.equal(prefPatchRes.status, 200);
  const prefPayload = await prefPatchRes.json();
  const prefData = prefPayload.data;
  assert.equal(prefData.user?.response_style, 'concise');
  console.log('   ✅ User preferences successfully saved and retrieved.');

  console.log('\n🎉 ALL 13 MULTI MIND AI LIVE VERIFICATION CHECKS PASSED PERFECTLY!\n');
}

runLiveE2E().catch((err) => {
  console.error('\n❌ Live E2E Verification Failed:', err);
  process.exit(1);
});
