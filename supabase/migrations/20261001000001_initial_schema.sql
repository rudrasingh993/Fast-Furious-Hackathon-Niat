-- Supabase PostgreSQL Initial Schema for Mosaic AI
-- Migration: 20261001000001_initial_schema.sql

create extension if not exists pgcrypto;

-- 1. Users table
create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null unique,
    password_hash text not null,
    preferred_language text not null default 'en',
    response_style text not null default 'balanced',
    response_length text not null default 'medium',
    onboarding_completed boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. User Preferences
create table if not exists public.user_preferences (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    preference_key text not null,
    preference_value jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(user_id, preference_key)
);

-- 3. Conversations
create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    title text not null default 'New Conversation',
    category text not null default 'GENERAL',
    summary text,
    is_archived boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 4. Messages
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    user_id uuid not null references public.users(id) on delete cascade,
    role text not null check (role in ('user','assistant','system')),
    content text,
    reasoning_summary jsonb,
    metadata jsonb not null default '{}'::jsonb,
    token_usage jsonb,
    created_at timestamptz not null default now()
);

-- 5. Attachments
create table if not exists public.attachments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    conversation_id uuid references public.conversations(id) on delete cascade,
    message_id uuid references public.messages(id) on delete cascade,
    original_filename text not null,
    storage_path text not null,
    mime_type text not null,
    media_type text not null check (
        media_type in ('image','audio','video','document','other')
    ),
    file_size bigint not null,
    checksum text,
    processing_status text not null default 'uploaded'
        check (
            processing_status in (
                'uploaded',
                'processing',
                'processed',
                'failed'
            )
        ),
    extracted_text text,
    extracted_metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

-- 6. Web Searches
create table if not exists public.web_searches (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    conversation_id uuid references public.conversations(id) on delete cascade,
    message_id uuid references public.messages(id) on delete set null,
    query text not null,
    search_queries jsonb not null default '[]'::jsonb,
    sources jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now()
);

-- 7. Research Sessions
create table if not exists public.research_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    conversation_id uuid references public.conversations(id) on delete cascade,
    title text not null,
    objective text not null,
    research_plan jsonb not null default '[]'::jsonb,
    queries jsonb not null default '[]'::jsonb,
    sources jsonb not null default '[]'::jsonb,
    findings jsonb not null default '[]'::jsonb,
    contradictions jsonb not null default '[]'::jsonb,
    synthesis text,
    citations jsonb not null default '[]'::jsonb,
    status text not null default 'created'
        check (
            status in (
                'created',
                'planning',
                'searching',
                'analyzing',
                'synthesizing',
                'completed',
                'failed'
            )
        ),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 8. Knowledge Items
create table if not exists public.knowledge_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    conversation_id uuid references public.conversations(id) on delete cascade,
    source_attachment_id uuid references public.attachments(id) on delete set null,
    knowledge_type text not null,
    title text not null,
    content jsonb not null,
    confidence numeric(5,4),
    source_references jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 9. Citations
create table if not exists public.citations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    message_id uuid references public.messages(id) on delete cascade,
    title text,
    url text not null,
    domain text,
    source_type text,
    citation_text text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

-- 10. Saved Responses
create table if not exists public.saved_responses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    message_id uuid not null references public.messages(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique(user_id, message_id)
);

-- Indexes
create index if not exists idx_conversations_user_id
on public.conversations(user_id);

create index if not exists idx_conversations_updated_at
on public.conversations(updated_at desc);

create index if not exists idx_messages_conversation_id
on public.messages(conversation_id);

create index if not exists idx_messages_user_id
on public.messages(user_id);

create index if not exists idx_attachments_user_id
on public.attachments(user_id);

create index if not exists idx_research_user_id
on public.research_sessions(user_id);

create index if not exists idx_knowledge_user_id
on public.knowledge_items(user_id);

create index if not exists idx_citations_message_id
on public.citations(message_id);
