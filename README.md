# 🌌 Mosaic AI — Multimodal AI Knowledge, Research & Personal Assistant

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange.svg)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Storage-green.svg)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

> **One AI workspace capable of understanding information regardless of whether that information arrives as text, an image, an audio recording, a video, a document, or live web information.**

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Problem Statement & Solution](#-problem-statement--solution)
3. [Key Multimodal Features](#-key-multimodal-features)
4. [System Architecture](#-system-architecture)
5. [AI & Grounding Engine](#-ai--grounding-engine)
6. [Deep Research Engine](#-deep-research-engine)
7. [Database & Storage Architecture](#-database--storage-architecture)
8. [Security & Isolation Guarantees](#-security--isolation-guarantees)
9. [Local Development Setup](#-local-development-setup)
10. [Environment Variables](#-environment-variables)
11. [Supabase Setup Guide](#-supabase-setup-guide)
12. [Vercel Deployment Guide](#-vercel-deployment-guide)
13. [API Reference Overview](#-api-reference-overview)
14. [Testing Suite](#-testing-suite)
15. [Demo Walkthrough (3-5 Min)](#-demo-walkthrough-3-5-min)
16. [Known Limitations & Fallbacks](#-known-limitations--fallbacks)

---

## 🌟 Project Overview

**Mosaic AI** is a production-grade, full-stack multimodal AI knowledge, research, and personal assistant. Rather than treating voice transcription, image recognition, document parsing, and web search as disconnected tools, Mosaic AI fuses them into a unified conversational canvas.

Users can attach pictures, voice memos recorded directly from the browser microphone, video files, and documents (PDF, Word DOCX, CSV, TXT, Markdown) alongside their text prompts, activate real-time **Google Search grounding**, or trigger autonomous **Deep Research** runs with transparent, non-intrusive **Reasoning Summaries**.

---

## 🎯 Problem Statement & Solution

- **The Problem**: Today's users juggle fragmented tools: one app for voice memos, another for PDF summaries, a search engine for research, and a separate chat interface. Context is lost, citations are untrusted or fabricated, and multimodal integration feels like a bolted-on novelty.
- **The Solution**: **Mosaic AI** unites 7 modalities into one coherent workspace. It features:
  - An intelligent multimodal composer with built-in voice recorder and drag-and-drop file upload.
  - Transparent user-facing Reasoning Summaries (explaining intent, inputs, methodology, observations, and limits without exposing internal reasoning tokens).
  - Grounded web search preserving real URLs and citations.
  - Autonomous multi-stage Deep Research that formulates sub-questions, executes parallel searches, compares competing claims, flags contradictions, and generates an executive report.
  - Automatic extraction of structured knowledge cards (Entities, People, Organizations, Facts, Tasks, Conceptual Relationships).
  - Strict tenant data isolation through Supabase Row-Level Security (RLS) and JWT auth.

---

## ✨ Key Multimodal Features

### 1. ✍️ Text & Conversational Memory
- Natural language chat with streaming Server-Sent Events (SSE).
- Automatic conversation title generation and categorization (`RESEARCH`, `DOCUMENT_ANALYSIS`, `GENERAL`, etc.).
- Full conversation history persistence in PostgreSQL.

### 2. 🖼️ Image Vision & Inspection
- Drag-and-drop upload for JPG, JPEG, PNG, WEBP.
- Detailed visual layout analysis, OCR of visible text, object grounding, and screenshot debugging.

### 3. 🎙️ Voice & Audio Intelligence
- Built-in live browser microphone recording with waveform visualizer and duration timer.
- Audio file upload (MP3, WAV, WebM, OGG, M4A).
- Transcription, acoustic summary, speaker interpretation, key takeaways, and action items.

### 4. 🎥 Video Understanding
- Video file upload (MP4, WebM, MOV) with instant playback preview.
- Frame timeline parsing, key moment extraction, concept mapping, and action classification.

### 5. 📄 Document Intelligence
- Ingestion and parsing of PDF (`pdf-parse`), DOCX (`mammoth`), CSV, JSON, Markdown, and plain text.
- Executive summaries, specific passage citation, contradictions analysis, and question generation.

### 6. 🌐 Live Web Search Grounding
- Seamless integration with Google Search grounding via `@google/genai`.
- Extracts real source queries, source titles, publication domains, and verbatim citation markers.
- Never fabricates URLs or hallucinated citations.

### 7. 🧭 Deep Research Engine
- Autonomous research pipeline:
  1. **Intent Decomposition**: Breaks user objective into 4-5 focused sub-questions.
  2. **Plan Formulation**: Formulates targeted search queries across domains.
  3. **Multi-Round Execution**: Searches and deduplicates up to 20 web sources.
  4. **Claim Comparison**: Cross-validates evidence and identifies conflicting perspectives/contradictions.
  5. **Report Synthesis**: Generates an authoritative Markdown report with citation mapping.

### 8. 🗃️ Structured Knowledge Extraction
- Extracts people, organizations, dates, events, tasks, facts, and relationships into filterable knowledge cards.
- Allows instant query and filtering across extracted entities.

### 9. 🎨 Exact Kage ThreeUI Landing Page
- Integrates the exact authored `<KageLandingPage />` WebGL shader scene from ThreeUI without approximation or imitation.

---

## 🏛️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          Mosaic AI Frontend                            │
│  React 18 + Vite + TypeScript + Tailwind CSS + Lucide + Context API   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / SSE
┌──────────────────────────────────▼─────────────────────────────────────┐
│                       Express API (Vercel Serverless)                  │
│  - JWT Verification & Rate Limiting                                   │
│  - Multimodal Upload Middleware (Multer Memory Storage + Validation)  │
│  - Text Extraction (pdf-parse, mammoth)                               │
└──────┬───────────────────────────┬───────────────────────────────┬─────┘
       │                           │                               │
┌──────▼──────────────┐   ┌────────▼──────────────┐   ┌────────────▼─────┐
│  Google Gemini AI   │   │ Supabase PostgreSQL   │   │ Supabase Storage │
│  - @google/genai    │   │ - 10 Core Tables      │   │ - user-files     │
│  - Gemini 2.5 Flash │   │ - Row Level Security  │   │ - Signed URLs    │
│  - Google Grounding │   │ - Schema Fallback     │   │ - Local Fallback │
└─────────────────────┘   └───────────────────────┘   └──────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, TypeScript 5, Tailwind CSS 3, React Router 6, Lucide Icons |
| **Backend** | Node.js 22, Express 4, JWT (`jsonwebtoken`), bcryptjs, Zod, Multer |
| **AI / Multimodal** | `@google/genai` (Google Gen AI SDK), Gemini 2.5 Flash, Google Search Tool |
| **Document Parsing**| `pdf-parse`, `mammoth` |
| **Database** | Supabase PostgreSQL with RLS, Local Schema-Compliant Persistent Engine |
| **Storage** | Supabase Storage (`user-files`), Local Secure File Storage |
| **Deployment** | Vercel (Static Frontend + Node.js Serverless API Function via `vercel.json`) |

---

## 🔒 Security & Isolation Guarantees

1. **Server-Side API Key Isolation**: Gemini API keys and Supabase service-role secrets are strictly confined to the backend server. No secrets are ever delivered to client-side bundles.
2. **Authenticated JWT Identity**: The backend never trusts client-supplied `userId` or `ownerId`. User identity is derived exclusively from verified JWT tokens.
3. **Password Security**: Passwords are securely hashed using `bcrypt` (10 rounds) before storage. Plaintext passwords are never logged or stored.
4. **Tenant Isolation (RLS)**: Every row in `conversations`, `messages`, `attachments`, `research_sessions`, and `knowledge_items` is guarded with `auth.uid() = user_id`.
5. **Private Storage & Signed URLs**: Files are stored in private paths (`{userId}/{conversationId}/{attachmentId}/{filename}`) with short-lived signed URLs.
6. **Prompt Injection Boundary**: All user files, transcripts, and web sources are treated as untrusted data inputs and quarantined from system instructions.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js >= 18.0.0 (Node 22 recommended)
- npm >= 9.0.0

### 2. Clone and Install
```bash
git clone <repository_url>
cd "Fast&Furious Hackathon Niat"
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your `GEMINI_API_KEY` (and optionally Supabase credentials):
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```
*(Note: If you run without keys, Mosaic AI runs in a smart fallback demonstration mode where all features, authentication, upload parsing, and simulated AI streaming operate seamlessly).*

### 4. Run Development Servers
Start both the Express backend API (Port 3000) and the Vite frontend (Port 5173) simultaneously:
```bash
npm run dev
```

Open your browser at:
```text
http://localhost:5173
```

---

## ⚙️ Environment Variables Reference

| Variable | Description | Default |
|---|---|---|
| `PORT` | Express API server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `APP_URL` | Frontend URL | `http://localhost:5173` |
| `API_URL` | Backend URL | `http://localhost:3000` |
| `JWT_SECRET` | Primary JWT signing key | *random secret* |
| `JWT_EXPIRES_IN` | Access token lifespan | `1d` |
| `JWT_REFRESH_SECRET`| Refresh token signing key | *random secret* |
| `GEMINI_API_KEY` | Official Google GenAI API Key | *empty for fallback* |
| `GEMINI_MODEL` | Target multimodal model | `gemini-2.5-flash` |
| `SUPABASE_URL` | Supabase project URL | *optional* |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase backend service key | *optional* |
| `SUPABASE_STORAGE_BUCKET` | Supabase storage bucket name | `user-files` |

---

## 🗄️ Supabase Setup Guide

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in the Supabase Dashboard.
3. Run the migration scripts in order:
   - `supabase/migrations/20261001000001_initial_schema.sql` (Creates all 10 tables, constraints, indexes)
   - `supabase/migrations/20261001000002_rls_and_storage.sql` (Enables RLS policies and storage bucket)
4. Retrieve your **Project URL** and **Service Role Key** under **Project Settings -> API** and add them to your `.env` file.

---

## ☁️ Vercel Deployment Guide

Mosaic AI is configured out of the box for unified deployment on Vercel:

1. Connect your GitHub repository to Vercel.
2. In the Vercel project settings, configure the environment variables:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Vercel automatically uses `vercel.json` to route:
   - `/api/(.*)` to the Node.js serverless function (`api/index.ts`)
   - `/(.*)` to the static Vite frontend build in `dist/`
4. Trigger deploy!

---

## 📡 API Reference Overview

### Auth
- `POST /api/auth/signup` — Create a new account with bcrypt password hashing
- `POST /api/auth/login` — Sign in and receive JWT access & refresh tokens
- `POST /api/auth/logout` — Revoke session
- `POST /api/auth/refresh` — Refresh access token
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Conversations & Messages
- `GET /api/conversations` — List user's conversations
- `POST /api/conversations` — Create a new conversation
- `GET /api/conversations/:id/messages` — List messages in conversation
- `POST /api/conversations/:id/messages` — Send message with attachments
- `POST /api/conversations/:id/messages/stream` — **SSE Streaming response endpoint**
- `POST /api/messages/:id/regenerate` — Regenerate an AI answer
- `DELETE /api/messages/:id` — Delete a message

### Multimodal Uploads & Analysis
- `POST /api/uploads` — Upload and parse media or documents (multipart/form-data)
- `GET /api/uploads` — List user's uploaded assets
- `POST /api/ai/analyze` — Run multimodal analysis on an attachment
- `POST /api/ai/analyze/image` — Direct image vision
- `POST /api/ai/analyze/audio` — Direct audio transcription & summary
- `POST /api/ai/analyze/video` — Direct video moment extraction
- `POST /api/ai/analyze/document` — Direct document QA & extraction

### Search & Deep Research
- `POST /api/search/web` — Grounded web search with citations
- `GET /api/search/unified?q=...` — Unified search across web, chats, and knowledge
- `POST /api/research` — Launch Deep Research workflow
- `GET /api/research` — List research sessions
- `GET /api/research/:id` — Retrieve research plan, findings, contradictions, report

### Knowledge Base
- `POST /api/knowledge/extract` — Extract structured entities from text/doc
- `GET /api/knowledge` — List extracted knowledge cards
- `DELETE /api/knowledge/:id` — Delete a knowledge item

---

## 🧪 Testing Suite

Mosaic AI includes automated end-to-end integration tests using Node.js's native test runner:

```bash
# Run test suite
npm test
# or
node ./node_modules/tsx/dist/cli.mjs --test tests/auth.test.js tests/api.test.js
```

Typechecking:
```bash
npm run typecheck
```

Production build validation:
```bash
npm run build
```

---

## 🎬 Demo Walkthrough (3–5 Min)

Follow these steps for a complete evaluation:

1. **Landing & 3D Experience**: Visit `/` to experience the **ThreeUI Kage WebGL Shader Canvas** and explore multimodal features.
2. **Account Sign Up**: Click **Get Started** (`/signup`), enter your name, email, and password to sign in.
3. **Multimodal Chat**: Go to `/app/chat`, type a question like *"Explain how quantum computing differs from classical computing"*, observe the live streaming response and transparent **Reasoning Summary**.
4. **Image Vision**: Click the paperclip icon in the composer, select an image/screenshot, and ask *"What does this diagram illustrate?"*.
5. **Document Intelligence**: Upload a PDF or TXT file and ask *"Summarize the core findings and action points"*.
6. **Voice Recording**: Click the microphone icon, record a quick voice prompt using your microphone, click **Attach**, and ask the AI to transcribe and summarize it.
7. **Web Grounding**: Toggle the **Web Search** badge in the composer, ask *"What are the latest breakthroughs in AI this week?"*, and inspect the clickable verified citation cards.
8. **Deep Research**: Click **Deep Research** in the sidebar, input an investigation objective (e.g. *"Analyze current multimodal architectures vs legacy LLMs"*), watch the progress steps decompose sub-questions, collect evidence, flag contradictions, and synthesize a full report.
9. **Knowledge Base**: Navigate to **Knowledge Base** (`/app/knowledge`), click **Extract From Text**, and inspect the structured cards generated for entities, facts, and tasks.

---

## ⚠️ Known Limitations & Fallbacks

- **Gemini API Key Fallback**: When `GEMINI_API_KEY` is not provided in `.env`, the system automatically activates an intelligent fallback engine so that testing, UI interaction, file parsing, and streaming responses can be demonstrated without crashing.
- **Supabase Storage Fallback**: If Supabase credentials are not connected, uploads are stored locally in the secure `uploads/` directory with short-lived tokens.
- **Audio Codec Compatibility**: Browser microphone recording uses `audio/webm` where supported (Chrome, Edge, Firefox) with automatic fallback to `audio/mp4` on Safari.

---

## 📄 License
MIT License. Built for the Fast & Furious AI Hackathon.
