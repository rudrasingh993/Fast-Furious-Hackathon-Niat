-- Supabase RLS and Storage Policies for Mosaic AI
-- Migration: 20261001000002_rls_and_storage.sql

-- Enable RLS on all 10 user-owned tables
alter table public.users enable row level security;
alter table public.user_preferences enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.attachments enable row level security;
alter table public.web_searches enable row level security;
alter table public.research_sessions enable row level security;
alter table public.knowledge_items enable row level security;
alter table public.citations enable row level security;
alter table public.saved_responses enable row level security;

-- 1. Users policies
create policy "Users can view their own profile"
on public.users for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.users for update
using (auth.uid() = id);

-- 2. User Preferences
create policy "Users can view their own preferences"
on public.user_preferences for select
using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
on public.user_preferences for insert
with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
on public.user_preferences for update
using (auth.uid() = user_id);

create policy "Users can delete their own preferences"
on public.user_preferences for delete
using (auth.uid() = user_id);

-- 3. Conversations
create policy "Users can view their own conversations"
on public.conversations for select
using (auth.uid() = user_id);

create policy "Users can insert their own conversations"
on public.conversations for insert
with check (auth.uid() = user_id);

create policy "Users can update their own conversations"
on public.conversations for update
using (auth.uid() = user_id);

create policy "Users can delete their own conversations"
on public.conversations for delete
using (auth.uid() = user_id);

-- 4. Messages
create policy "Users can view their own messages"
on public.messages for select
using (auth.uid() = user_id);

create policy "Users can insert their own messages"
on public.messages for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own messages"
on public.messages for delete
using (auth.uid() = user_id);

-- 5. Attachments
create policy "Users can view their own attachments"
on public.attachments for select
using (auth.uid() = user_id);

create policy "Users can insert their own attachments"
on public.attachments for insert
with check (auth.uid() = user_id);

create policy "Users can update their own attachments"
on public.attachments for update
using (auth.uid() = user_id);

create policy "Users can delete their own attachments"
on public.attachments for delete
using (auth.uid() = user_id);

-- 6. Web Searches
create policy "Users can view their own web searches"
on public.web_searches for select
using (auth.uid() = user_id);

create policy "Users can insert their own web searches"
on public.web_searches for insert
with check (auth.uid() = user_id);

-- 7. Research Sessions
create policy "Users can view their own research sessions"
on public.research_sessions for select
using (auth.uid() = user_id);

create policy "Users can insert their own research sessions"
on public.research_sessions for insert
with check (auth.uid() = user_id);

create policy "Users can update their own research sessions"
on public.research_sessions for update
using (auth.uid() = user_id);

create policy "Users can delete their own research sessions"
on public.research_sessions for delete
using (auth.uid() = user_id);

-- 8. Knowledge Items
create policy "Users can view their own knowledge items"
on public.knowledge_items for select
using (auth.uid() = user_id);

create policy "Users can insert their own knowledge items"
on public.knowledge_items for insert
with check (auth.uid() = user_id);

create policy "Users can update their own knowledge items"
on public.knowledge_items for update
using (auth.uid() = user_id);

create policy "Users can delete their own knowledge items"
on public.knowledge_items for delete
using (auth.uid() = user_id);

-- 9. Citations
create policy "Users can view their own citations"
on public.citations for select
using (auth.uid() = user_id);

create policy "Users can insert their own citations"
on public.citations for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own citations"
on public.citations for delete
using (auth.uid() = user_id);

-- 10. Saved Responses
create policy "Users can view their own saved responses"
on public.saved_responses for select
using (auth.uid() = user_id);

create policy "Users can insert their own saved responses"
on public.saved_responses for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own saved responses"
on public.saved_responses for delete
using (auth.uid() = user_id);

-- Storage bucket setup for user-files
insert into storage.buckets (id, name, public)
values ('user-files', 'user-files', false)
on conflict (id) do nothing;

create policy "Users can view their own files in storage"
on storage.objects for select
using (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can upload their own files to storage"
on storage.objects for insert
with check (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own files from storage"
on storage.objects for delete
using (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = auth.uid()::text
);
