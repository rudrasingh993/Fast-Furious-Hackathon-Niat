import fs from 'fs';
import path from 'path';
import os from 'os';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env.js';
import type {
  User,
  Conversation,
  Message,
  Attachment,
  WebSearch,
  ResearchSession,
  KnowledgeItem,
  Citation,
  SavedResponse,
} from '../../shared/types.js';

interface DatabaseSchema {
  users: User[];
  user_preferences: Array<{
    id: string;
    user_id: string;
    preference_key: string;
    preference_value: any;
    created_at: string;
    updated_at: string;
  }>;
  conversations: Conversation[];
  messages: Message[];
  attachments: Attachment[];
  web_searches: WebSearch[];
  research_sessions: ResearchSession[];
  knowledge_items: KnowledgeItem[];
  citations: Citation[];
  saved_responses: Array<{
    id: string;
    user_id: string;
    message_id: string;
    created_at: string;
  }>;
}

const initialDb: DatabaseSchema = {
  users: [],
  user_preferences: [],
  conversations: [],
  messages: [],
  attachments: [],
  web_searches: [],
  research_sessions: [],
  knowledge_items: [],
  citations: [],
  saved_responses: [],
};

class LocalDatabase {
  private dbPath: string;
  private data: DatabaseSchema;

  constructor() {
    this.data = { ...initialDb };

    // Select suitable directory: try cwd, fallback to tmpdir (for Vercel serverless / AWS Lambda)
    let dataDir = path.resolve(process.cwd(), '.data');
    let canWrite = false;
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      canWrite = true;
    } catch {
      dataDir = path.join(os.tmpdir(), 'multi_mind_data');
      try {
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        canWrite = true;
      } catch (err) {
        console.warn('⚠️ Read-only filesystem detected, running in-memory storage fallback:', err);
      }
    }

    this.dbPath = path.join(dataDir, 'db.json');

    if (canWrite && fs.existsSync(this.dbPath)) {
      try {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        this.data = { ...initialDb, ...JSON.parse(raw) };
      } catch {
        this.save();
      }
    } else if (canWrite) {
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch {
      try {
        const tmpPath = path.join(os.tmpdir(), 'multi_mind_db.json');
        this.dbPath = tmpPath;
        fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf8');
      } catch {
        // Safe in-memory fallback
      }
    }
  }

  // Users
  async getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
    const user = this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return (user as any) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;
    const { password_hash, ...rest } = user as any;
    return rest as User;
  }

  async createUser(userData: {
    name: string;
    email: string;
    password_hash: string;
  }): Promise<User> {
    const now = new Date().toISOString();
    const newUser: any = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password_hash: userData.password_hash,
      preferred_language: 'en',
      response_style: 'balanced',
      response_length: 'medium',
      onboarding_completed: false,
      created_at: now,
      updated_at: now,
    };
    this.data.users.push(newUser);
    this.save();
    const { password_hash, ...rest } = newUser;
    return rest;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updated_at: now,
    };
    this.save();
    const { password_hash, ...rest } = this.data.users[idx] as any;
    return rest;
  }

  // User Preferences
  async getPreferences(userId: string): Promise<Record<string, any>> {
    const prefs = this.data.user_preferences.filter((p) => p.user_id === userId);
    const result: Record<string, any> = {};
    for (const p of prefs) {
      result[p.preference_key] = p.preference_value;
    }
    return result;
  }

  async setPreference(userId: string, key: string, value: any): Promise<void> {
    const now = new Date().toISOString();
    const idx = this.data.user_preferences.findIndex(
      (p) => p.user_id === userId && p.preference_key === key
    );
    if (idx !== -1) {
      this.data.user_preferences[idx].preference_value = value;
      this.data.user_preferences[idx].updated_at = now;
    } else {
      this.data.user_preferences.push({
        id: uuidv4(),
        user_id: userId,
        preference_key: key,
        preference_value: value,
        created_at: now,
        updated_at: now,
      });
    }
    this.save();
  }

  // Conversations
  async getConversations(userId: string): Promise<Conversation[]> {
    return this.data.conversations
      .filter((c) => c.user_id === userId && !c.is_archived)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .map((c) => ({
        ...c,
        message_count: this.data.messages.filter((m) => m.conversation_id === c.id).length,
      }));
  }

  async getConversationById(id: string, userId: string): Promise<Conversation | null> {
    const c = this.data.conversations.find((conv) => conv.id === id && conv.user_id === userId);
    if (!c) return null;
    return {
      ...c,
      message_count: this.data.messages.filter((m) => m.conversation_id === c.id).length,
    };
  }

  async createConversation(data: {
    user_id: string;
    title?: string;
    category?: string;
  }): Promise<Conversation> {
    const now = new Date().toISOString();
    const conv: Conversation = {
      id: uuidv4(),
      user_id: data.user_id,
      title: data.title || 'New Conversation',
      category: data.category || 'GENERAL',
      summary: null,
      is_archived: false,
      created_at: now,
      updated_at: now,
    };
    this.data.conversations.push(conv);
    this.save();
    return conv;
  }

  async updateConversation(
    id: string,
    userId: string,
    updates: Partial<Conversation>
  ): Promise<Conversation | null> {
    const idx = this.data.conversations.findIndex((c) => c.id === id && c.user_id === userId);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    this.data.conversations[idx] = {
      ...this.data.conversations[idx],
      ...updates,
      updated_at: now,
    };
    this.save();
    return this.data.conversations[idx];
  }

  async deleteConversation(id: string, userId: string): Promise<boolean> {
    const idx = this.data.conversations.findIndex((c) => c.id === id && c.user_id === userId);
    if (idx === -1) return false;
    this.data.conversations.splice(idx, 1);
    // Cascade delete messages, attachments, research
    this.data.messages = this.data.messages.filter((m) => m.conversation_id !== id);
    this.data.attachments = this.data.attachments.filter((a) => a.conversation_id !== id);
    this.data.research_sessions = this.data.research_sessions.filter((r) => r.conversation_id !== id);
    this.data.knowledge_items = this.data.knowledge_items.filter((k) => k.conversation_id !== id);
    this.save();
    return true;
  }

  // Messages
  async getMessages(conversationId: string, userId: string): Promise<Message[]> {
    // verify conversation ownership
    const conv = await this.getConversationById(conversationId, userId);
    if (!conv) return [];

    const msgs = this.data.messages
      .filter((m) => m.conversation_id === conversationId && m.user_id === userId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return msgs.map((m) => ({
      ...m,
      attachments: this.data.attachments.filter((a) => a.message_id === m.id),
      citations: this.data.citations.filter((c) => c.message_id === m.id),
    }));
  }

  async createMessage(data: {
    conversation_id: string;
    user_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string | null;
    reasoning_summary?: any;
    metadata?: any;
    token_usage?: any;
  }): Promise<Message> {
    const now = new Date().toISOString();
    const msg: Message = {
      id: uuidv4(),
      conversation_id: data.conversation_id,
      user_id: data.user_id,
      role: data.role,
      content: data.content,
      reasoning_summary: data.reasoning_summary || null,
      metadata: data.metadata || {},
      token_usage: data.token_usage || null,
      created_at: now,
    };
    this.data.messages.push(msg);

    // Update conversation timestamp
    const cIdx = this.data.conversations.findIndex((c) => c.id === data.conversation_id);
    if (cIdx !== -1) {
      this.data.conversations[cIdx].updated_at = now;
    }

    this.save();
    return msg;
  }

  async getMessageById(id: string, userId: string): Promise<Message | null> {
    const msg = this.data.messages.find((m) => m.id === id && m.user_id === userId);
    if (!msg) return null;
    return {
      ...msg,
      attachments: this.data.attachments.filter((a) => a.message_id === msg.id),
      citations: this.data.citations.filter((c) => c.message_id === msg.id),
    };
  }

  async deleteMessage(id: string, userId: string): Promise<boolean> {
    const idx = this.data.messages.findIndex((m) => m.id === id && m.user_id === userId);
    if (idx === -1) return false;
    this.data.messages.splice(idx, 1);
    this.data.citations = this.data.citations.filter((c) => c.message_id !== id);
    this.save();
    return true;
  }

  // Attachments
  async createAttachment(data: Omit<Attachment, 'id' | 'created_at'>): Promise<Attachment> {
    const now = new Date().toISOString();
    const attachment: Attachment = {
      id: uuidv4(),
      ...data,
      created_at: now,
    };
    this.data.attachments.push(attachment);
    this.save();
    return attachment;
  }

  async getAttachmentById(id: string, userId: string): Promise<Attachment | null> {
    return this.data.attachments.find((a) => a.id === id && a.user_id === userId) || null;
  }

  async getAttachmentsByUser(userId: string): Promise<Attachment[]> {
    return this.data.attachments
      .filter((a) => a.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async updateAttachment(
    id: string,
    userId: string,
    updates: Partial<Attachment>
  ): Promise<Attachment | null> {
    const idx = this.data.attachments.findIndex((a) => a.id === id && a.user_id === userId);
    if (idx === -1) return null;
    this.data.attachments[idx] = {
      ...this.data.attachments[idx],
      ...updates,
    };
    this.save();
    return this.data.attachments[idx];
  }

  async deleteAttachment(id: string, userId: string): Promise<boolean> {
    const idx = this.data.attachments.findIndex((a) => a.id === id && a.user_id === userId);
    if (idx === -1) return false;
    this.data.attachments.splice(idx, 1);
    this.save();
    return true;
  }

  // Web Searches
  async createWebSearch(data: Omit<WebSearch, 'id' | 'created_at'>): Promise<WebSearch> {
    const now = new Date().toISOString();
    const search: WebSearch = {
      id: uuidv4(),
      ...data,
      created_at: now,
    };
    this.data.web_searches.push(search);
    this.save();
    return search;
  }

  async getWebSearchById(id: string, userId: string): Promise<WebSearch | null> {
    return this.data.web_searches.find((s) => s.id === id && s.user_id === userId) || null;
  }

  // Research Sessions
  async createResearchSession(
    data: Omit<ResearchSession, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ResearchSession> {
    const now = new Date().toISOString();
    const session: ResearchSession = {
      id: uuidv4(),
      ...data,
      created_at: now,
      updated_at: now,
    };
    this.data.research_sessions.push(session);
    this.save();
    return session;
  }

  async getResearchSessions(userId: string): Promise<ResearchSession[]> {
    return this.data.research_sessions
      .filter((r) => r.user_id === userId)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  async getResearchSessionById(id: string, userId: string): Promise<ResearchSession | null> {
    return this.data.research_sessions.find((r) => r.id === id && r.user_id === userId) || null;
  }

  async updateResearchSession(
    id: string,
    userId: string,
    updates: Partial<ResearchSession>
  ): Promise<ResearchSession | null> {
    const idx = this.data.research_sessions.findIndex((r) => r.id === id && r.user_id === userId);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    this.data.research_sessions[idx] = {
      ...this.data.research_sessions[idx],
      ...updates,
      updated_at: now,
    };
    this.save();
    return this.data.research_sessions[idx];
  }

  async deleteResearchSession(id: string, userId: string): Promise<boolean> {
    const idx = this.data.research_sessions.findIndex((r) => r.id === id && r.user_id === userId);
    if (idx === -1) return false;
    this.data.research_sessions.splice(idx, 1);
    this.save();
    return true;
  }

  // Knowledge Items
  async createKnowledgeItem(
    data: Omit<KnowledgeItem, 'id' | 'created_at' | 'updated_at'>
  ): Promise<KnowledgeItem> {
    const now = new Date().toISOString();
    const item: KnowledgeItem = {
      id: uuidv4(),
      ...data,
      created_at: now,
      updated_at: now,
    };
    this.data.knowledge_items.push(item);
    this.save();
    return item;
  }

  async getKnowledgeItems(userId: string): Promise<KnowledgeItem[]> {
    return this.data.knowledge_items
      .filter((k) => k.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getKnowledgeItemById(id: string, userId: string): Promise<KnowledgeItem | null> {
    return this.data.knowledge_items.find((k) => k.id === id && k.user_id === userId) || null;
  }

  async updateKnowledgeItem(
    id: string,
    userId: string,
    updates: Partial<KnowledgeItem>
  ): Promise<KnowledgeItem | null> {
    const idx = this.data.knowledge_items.findIndex((k) => k.id === id && k.user_id === userId);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    this.data.knowledge_items[idx] = {
      ...this.data.knowledge_items[idx],
      ...updates,
      updated_at: now,
    };
    this.save();
    return this.data.knowledge_items[idx];
  }

  async deleteKnowledgeItem(id: string, userId: string): Promise<boolean> {
    const idx = this.data.knowledge_items.findIndex((k) => k.id === id && k.user_id === userId);
    if (idx === -1) return false;
    this.data.knowledge_items.splice(idx, 1);
    this.save();
    return true;
  }

  // Citations
  async createCitation(data: Omit<Citation, 'id' | 'created_at'>): Promise<Citation> {
    const now = new Date().toISOString();
    const citation: Citation = {
      id: uuidv4(),
      ...data,
      created_at: now,
    };
    this.data.citations.push(citation);
    this.save();
    return citation;
  }

  async getCitationsByMessage(messageId: string, userId: string): Promise<Citation[]> {
    return this.data.citations.filter((c) => c.message_id === messageId && c.user_id === userId);
  }

  // Saved Responses
  async saveResponse(userId: string, messageId: string): Promise<boolean> {
    const exists = this.data.saved_responses.some(
      (s) => s.user_id === userId && s.message_id === messageId
    );
    if (!exists) {
      this.data.saved_responses.push({
        id: uuidv4(),
        user_id: userId,
        message_id: messageId,
        created_at: new Date().toISOString(),
      });
      this.save();
    }
    return true;
  }

  async removeSavedResponse(userId: string, messageId: string): Promise<boolean> {
    const idx = this.data.saved_responses.findIndex(
      (s) => s.user_id === userId && s.message_id === messageId
    );
    if (idx === -1) return false;
    this.data.saved_responses.splice(idx, 1);
    this.save();
    return true;
  }

  async getSavedResponses(userId: string): Promise<SavedResponse[]> {
    const saved = this.data.saved_responses.filter((s) => s.user_id === userId);
    return saved.map((s) => {
      const message = this.data.messages.find((m) => m.id === s.message_id);
      return {
        id: s.id,
        user_id: s.user_id,
        message_id: s.message_id,
        created_at: s.created_at,
        message,
      };
    });
  }
}

// Database factory: instantiate Supabase if configured or LocalDatabase fallback
class DatabaseService {
  private localDb: LocalDatabase;
  private supabase: SupabaseClient | null = null;

  constructor() {
    this.localDb = new LocalDatabase();
    if (config.supabase.url && (config.supabase.serviceRoleKey || config.supabase.anonKey)) {
      try {
        const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
        this.supabase = createClient(config.supabase.url, key, {
          auth: { persistSession: false },
        });
        console.log('✅ Connected to Supabase PostgreSQL Database at', config.supabase.url);
      } catch (err) {
        console.warn('⚠️ Could not connect to Supabase, falling back to local schema engine:', err);
      }
    } else {
      console.log('ℹ️ Running on local PostgreSQL-schema compliant persistent database');
    }
  }

  getSupabase(): SupabaseClient | null {
    return this.supabase;
  }

  // ─── Users ─────────────────────────────────────────────────
  async getUserByEmail(email: string) {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('users')
          .select('*')
          .eq('email', email.toLowerCase().trim())
          .single();
        if (!error && data) return data;
      } catch {}
    }
    return this.localDb.getUserByEmail(email);
  }

  async getUserById(id: string) {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('users')
          .select('id, name, email, preferred_language, response_style, response_length, onboarding_completed, created_at, updated_at')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch {}
    }
    return this.localDb.getUserById(id);
  }

  async createUser(userData: { name: string; email: string; password_hash: string }) {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('users')
          .insert({
            name: userData.name,
            email: userData.email.toLowerCase().trim(),
            password_hash: userData.password_hash,
          })
          .select()
          .single();
        if (!error && data) {
          const { password_hash, ...rest } = data;
          return rest;
        }
      } catch {}
    }
    return this.localDb.createUser(userData);
  }

  async updateUser(id: string, updates: Partial<User>) {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('users')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch {}
    }
    return this.localDb.updateUser(id, updates);
  }

  async getPreferences(userId: string) {
    return this.localDb.getPreferences(userId);
  }

  async setPreference(userId: string, key: string, value: any) {
    return this.localDb.setPreference(userId, key, value);
  }

  // ─── Conversations (Supabase-first for serverless persistence) ─────
  async getConversations(userId: string) {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('conversations')
          .select('*')
          .eq('user_id', userId)
          .eq('is_archived', false)
          .order('updated_at', { ascending: false });
        if (!error && data) return data;
      } catch {}
    }
    return this.localDb.getConversations(userId);
  }

  async getConversationById(id: string, userId: string) {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('conversations')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single();
        if (!error && data) return data;
      } catch {}
    }
    return this.localDb.getConversationById(id, userId);
  }

  async createConversation(data: { user_id: string; title?: string; category?: string }) {
    if (this.supabase) {
      try {
        const { data: conv, error } = await this.supabase
          .from('conversations')
          .insert({
            user_id: data.user_id,
            title: data.title || 'New Conversation',
            category: data.category || 'GENERAL',
            is_archived: false,
          })
          .select()
          .single();
        if (!error && conv) return conv;
      } catch {}
    }
    return this.localDb.createConversation(data);
  }

  async updateConversation(id: string, userId: string, updates: Partial<Conversation>) {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('conversations')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('user_id', userId)
          .select()
          .single();
        if (!error && data) return data;
      } catch {}
    }
    return this.localDb.updateConversation(id, userId, updates);
  }

  async deleteConversation(id: string, userId: string) {
    if (this.supabase) {
      try {
        // Cascade: delete messages, attachments, research related to this conversation
        await this.supabase.from('messages').delete().eq('conversation_id', id).eq('user_id', userId);
        await this.supabase.from('attachments').delete().eq('conversation_id', id).eq('user_id', userId);
        const { error } = await this.supabase
          .from('conversations')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
        if (!error) return true;
      } catch {}
    }
    return this.localDb.deleteConversation(id, userId);
  }

  // ─── Messages (Supabase-first for serverless persistence) ─────
  async getMessages(conversationId: string, userId: string) {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .eq('user_id', userId)
          .order('created_at', { ascending: true });
        if (!error && data) return data;
      } catch {}
    }
    return this.localDb.getMessages(conversationId, userId);
  }

  async createMessage(data: any) {
    if (this.supabase) {
      try {
        const now = new Date().toISOString();
        const insertData: any = {
          conversation_id: data.conversation_id,
          user_id: data.user_id,
          role: data.role,
          content: data.content,
          metadata: data.metadata || {},
          created_at: now,
        };
        if (data.reasoning_summary) {
          insertData.reasoning_summary = data.reasoning_summary;
        }
        if (data.token_usage) {
          insertData.token_usage = data.token_usage;
        }

        const { data: msg, error } = await this.supabase
          .from('messages')
          .insert(insertData)
          .select()
          .single();
        if (!error && msg) {
          // Also update conversation timestamp
          await this.supabase
            .from('conversations')
            .update({ updated_at: now })
            .eq('id', data.conversation_id);
          return msg;
        }
      } catch {}
    }
    return this.localDb.createMessage(data);
  }

  async getMessageById(id: string, userId: string) {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('messages')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single();
        if (!error && data) return data;
      } catch {}
    }
    return this.localDb.getMessageById(id, userId);
  }

  async deleteMessage(id: string, userId: string) {
    if (this.supabase) {
      try {
        const { error } = await this.supabase
          .from('messages')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
        if (!error) return true;
      } catch {}
    }
    return this.localDb.deleteMessage(id, userId);
  }

  // ─── Attachments ─────────────────────────────────────────
  async createAttachment(data: any) {
    return this.localDb.createAttachment(data);
  }

  async getAttachmentById(id: string, userId: string) {
    return this.localDb.getAttachmentById(id, userId);
  }

  async getAttachmentsByUser(userId: string) {
    return this.localDb.getAttachmentsByUser(userId);
  }

  async updateAttachment(id: string, userId: string, updates: any) {
    return this.localDb.updateAttachment(id, userId, updates);
  }

  async deleteAttachment(id: string, userId: string) {
    return this.localDb.deleteAttachment(id, userId);
  }

  async createWebSearch(data: any) {
    return this.localDb.createWebSearch(data);
  }

  async getWebSearchById(id: string, userId: string) {
    return this.localDb.getWebSearchById(id, userId);
  }

  async createResearchSession(data: any) {
    return this.localDb.createResearchSession(data);
  }

  async getResearchSessions(userId: string) {
    return this.localDb.getResearchSessions(userId);
  }

  async getResearchSessionById(id: string, userId: string) {
    return this.localDb.getResearchSessionById(id, userId);
  }

  async updateResearchSession(id: string, userId: string, updates: any) {
    return this.localDb.updateResearchSession(id, userId, updates);
  }

  async deleteResearchSession(id: string, userId: string) {
    return this.localDb.deleteResearchSession(id, userId);
  }

  async createKnowledgeItem(data: any) {
    return this.localDb.createKnowledgeItem(data);
  }

  async getKnowledgeItems(userId: string) {
    return this.localDb.getKnowledgeItems(userId);
  }

  async getKnowledgeItemById(id: string, userId: string) {
    return this.localDb.getKnowledgeItemById(id, userId);
  }

  async updateKnowledgeItem(id: string, userId: string, updates: any) {
    return this.localDb.updateKnowledgeItem(id, userId, updates);
  }

  async deleteKnowledgeItem(id: string, userId: string) {
    return this.localDb.deleteKnowledgeItem(id, userId);
  }

  async createCitation(data: any) {
    return this.localDb.createCitation(data);
  }

  async getCitationsByMessage(messageId: string, userId: string) {
    return this.localDb.getCitationsByMessage(messageId, userId);
  }

  async saveResponse(userId: string, messageId: string) {
    return this.localDb.saveResponse(userId, messageId);
  }

  async removeSavedResponse(userId: string, messageId: string) {
    return this.localDb.removeSavedResponse(userId, messageId);
  }

  async getSavedResponses(userId: string) {
    return this.localDb.getSavedResponses(userId);
  }
}

export const db = new DatabaseService();

