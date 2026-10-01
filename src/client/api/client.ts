import type {
  User,
  Conversation,
  Message,
  Attachment,
  WebSearch,
  ResearchSession,
  KnowledgeItem,
  SavedResponse,
  ApiResponse,
} from '../../shared/types.js';

const API_BASE = '/api';

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('mosaic_access_token');
    this.refreshToken = localStorage.getItem('mosaic_refresh_token');
  }

  setTokens(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    localStorage.setItem('mosaic_access_token', accessToken);
    if (refreshToken) {
      this.refreshToken = refreshToken;
      localStorage.setItem('mosaic_refresh_token', refreshToken);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('mosaic_access_token');
    localStorage.removeItem('mosaic_refresh_token');
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    let response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle token refresh on 401
    if (response.status === 401 && this.refreshToken && !endpoint.includes('/auth/refresh')) {
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.success && refreshData.data?.accessToken) {
            this.setTokens(refreshData.data.accessToken);
            headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
            response = await fetch(`${API_BASE}${endpoint}`, {
              ...options,
              headers,
            });
          }
        } else {
          this.clearTokens();
        }
      } catch {
        this.clearTokens();
      }
    }

    const data = await response.json();
    return data;
  }

  // Auth endpoints
  async signup(data: { name: string; email: string; password: string }) {
    const res = await this.request<{ user: User; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/signup',
      { method: 'POST', body: JSON.stringify(data) }
    );
    if (res.success && res.data?.tokens) {
      this.setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
    }
    return res;
  }

  async login(data: { email: string; password: string }) {
    const res = await this.request<{ user: User; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(data) }
    );
    if (res.success && res.data?.tokens) {
      this.setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
    }
    return res;
  }

  async sendOtp(type: 'email' | 'phone', target: string) {
    return this.request<{ message: string; devCode?: string }>('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ type, target }),
    });
  }

  async verifyOtp(type: 'email' | 'phone', target: string, code: string, name?: string) {
    const res = await this.request<{ user: User; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/otp/verify',
      { method: 'POST', body: JSON.stringify({ type, target, code, name }) }
    );
    if (res.success && res.data?.tokens) {
      this.setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
    }
    return res;
  }

  async googleAuth(profile: { email: string; name?: string; avatarUrl?: string }) {
    const res = await this.request<{ user: User; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/google',
      { method: 'POST', body: JSON.stringify(profile) }
    );
    if (res.success && res.data?.tokens) {
      this.setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
    }
    return res;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearTokens();
    }
  }

  async getMe() {
    return this.request<User>('/auth/me');
  }

  // User endpoints
  async getProfile() {
    return this.request<User>('/user/profile');
  }

  async updateProfile(updates: Partial<User>) {
    return this.request<User>('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async getPreferences() {
    return this.request<Record<string, any>>('/user/preferences');
  }

  async updatePreferences(key: string, value: any) {
    return this.request<Record<string, any>>('/user/preferences', {
      method: 'PATCH',
      body: JSON.stringify({ preference_key: key, preference_value: value }),
    });
  }

  // Conversations
  async getConversations() {
    return this.request<Conversation[]>('/conversations');
  }

  async getConversation(id: string) {
    return this.request<Conversation>(`/conversations/${id}`);
  }

  async createConversation(data: { title?: string; category?: string }) {
    return this.request<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateConversation(id: string, updates: Partial<Conversation>) {
    return this.request<Conversation>(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteConversation(id: string) {
    return this.request<{ message: string }>(`/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  // Messages
  async getMessages(conversationId: string) {
    return this.request<Message[]>(`/conversations/${conversationId}/messages`);
  }

  async sendMessage(
    conversationId: string,
    payload: {
      content?: string;
      attachment_ids?: string[];
      enable_web_search?: boolean;
      enable_deep_research?: boolean;
    }
  ) {
    return this.request<{ userMessage: Message; assistantMessage: Message }>(
      `/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  // Stream Message via SSE
  streamMessage(
    conversationId: string,
    payload: {
      content?: string;
      attachment_ids?: string[];
      enable_web_search?: boolean;
      enable_deep_research?: boolean;
    },
    callbacks: {
      onUserMessage?: (msg: Message) => void;
      onChunk?: (text: string) => void;
      onComplete?: (msg: Message) => void;
      onConversationUpdated?: (data: { title: string }) => void;
      onError?: (err: any) => void;
    }
  ) {
    const controller = new AbortController();

    fetch(`${API_BASE}/conversations/${conversationId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || 'Streaming failed');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No readable stream available');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const block of lines) {
            if (!block.trim()) continue;
            const eventMatch = block.match(/event:\s*(\w+)/);
            const dataMatch = block.match(/data:\s*(.+)/s);

            const event = eventMatch ? eventMatch[1] : 'message';
            const dataStr = dataMatch ? dataMatch[1] : '';

            try {
              const data = JSON.parse(dataStr);
              if (event === 'user_message') callbacks.onUserMessage?.(data);
              else if (event === 'chunk') callbacks.onChunk?.(data.text);
              else if (event === 'complete') callbacks.onComplete?.(data);
              else if (event === 'conversation_updated') callbacks.onConversationUpdated?.(data);
              else if (event === 'error') callbacks.onError?.(new Error(data.message));
            } catch (err) {
              console.warn('Error parsing SSE event data:', err);
            }
          }
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          callbacks.onError?.(err);
        }
      });

    return () => controller.abort();
  }

  async regenerateMessage(messageId: string, options: { enable_web_search?: boolean }) {
    return this.request<Message>(`/messages/${messageId}/regenerate`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  async deleteMessage(messageId: string) {
    return this.request<{ message: string }>(`/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  // Uploads
  async uploadFile(file: File, conversationId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (conversationId) formData.append('conversation_id', conversationId);

    return this.request<Attachment>('/uploads', {
      method: 'POST',
      body: formData,
    });
  }

  async listUploads() {
    return this.request<Attachment[]>('/uploads');
  }

  async getUpload(id: string) {
    return this.request<Attachment>(`/uploads/${id}`);
  }

  async deleteUpload(id: string) {
    return this.request<{ message: string }>(`/uploads/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Multimodal analysis
  async analyzeAttachment(attachmentId: string, prompt?: string) {
    return this.request('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ attachment_id: attachmentId, prompt }),
    });
  }

  // Web Search
  async searchWeb(query: string, conversationId?: string) {
    return this.request<{ answer: string; queriesUsed: string[]; sources: any[]; searchId: string }>(
      '/search/web',
      {
        method: 'POST',
        body: JSON.stringify({ query, conversation_id: conversationId }),
      }
    );
  }

  async unifiedSearch(query: string) {
    return this.request<{ query: string; web: any; conversations: Conversation[]; knowledge: KnowledgeItem[] }>(
      `/search/unified?q=${encodeURIComponent(query)}`
    );
  }

  // Deep Research
  async createResearch(objective: string, conversationId?: string, title?: string) {
    return this.request<ResearchSession>('/research', {
      method: 'POST',
      body: JSON.stringify({ objective, conversation_id: conversationId, title }),
    });
  }

  async listResearch() {
    return this.request<ResearchSession[]>('/research');
  }

  async getResearch(id: string) {
    return this.request<ResearchSession>(`/research/${id}`);
  }

  async runResearch(id: string) {
    return this.request<ResearchSession>(`/research/${id}/run`, {
      method: 'POST',
    });
  }

  async deleteResearch(id: string) {
    return this.request<{ message: string }>(`/research/${id}`, {
      method: 'DELETE',
    });
  }

  // Knowledge Items
  async extractKnowledge(payload: {
    source_type: 'conversation' | 'attachment' | 'text';
    source_id?: string;
    text_content?: string;
    conversation_id?: string;
  }) {
    return this.request<KnowledgeItem[]>('/knowledge/extract', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async listKnowledge() {
    return this.request<KnowledgeItem[]>('/knowledge');
  }

  async getKnowledge(id: string) {
    return this.request<KnowledgeItem>(`/knowledge/${id}`);
  }

  async updateKnowledge(id: string, updates: Partial<KnowledgeItem>) {
    return this.request<KnowledgeItem>(`/knowledge/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteKnowledge(id: string) {
    return this.request<{ message: string }>(`/knowledge/${id}`, {
      method: 'DELETE',
    });
  }

  // Saved Responses
  async saveResponse(messageId: string) {
    return this.request<{ message: string }>(`/messages/${messageId}/save`, {
      method: 'POST',
    });
  }

  async unsaveResponse(messageId: string) {
    return this.request<{ message: string }>(`/messages/${messageId}/save`, {
      method: 'DELETE',
    });
  }

  async listSaved() {
    return this.request<SavedResponse[]>('/saved');
  }

  // Health
  async getHealth() {
    return this.request<{ ok: boolean; service: string; timestamp: string }>('/health');
  }
}

export const api = new ApiClient();
