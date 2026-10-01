import { app } from './app.js';
import { config } from './config/env.js';

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Multi Mind AI Express Server running at http://localhost:${PORT}`);
  console.log(`⚡ Environment: ${config.nodeEnv}`);
  console.log(`🤖 Gemini Model: ${config.gemini.model} (${config.gemini.apiKey ? 'API Key Active' : 'Fallback Mode'})`);
  console.log(`🗄️ Database: ${config.supabase.url ? 'Supabase Connected' : 'Schema-Compliant Local Persistent Engine'}`);
});
