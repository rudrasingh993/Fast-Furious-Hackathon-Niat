// Shared domain types for Multi Mind AI

export type Role = 'user' | 'assistant' | 'system';

export type MediaType = 'image' | 'audio' | 'video' | 'document' | 'other';

export type ProcessingStatus = 'uploaded' | 'processing' | 'processed' | 'failed';

export type ResearchStatus =
  | 'created'
  | 'planning'
  | 'searching'
  | 'analyzing'
  | 'synthesizing'
  | 'completed'
  | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  preferred_language: string;
  response_style: 'concise' | 'balanced' | 'detailed';
  response_length: 'short' | 'medium' | 'long';
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preference_key: string;
  preference_value: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  category: string;
  summary: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export interface ReasoningSummary {
  intent: string;
  inputs: string[];
  method: string[];
  key_observations: string[];
  limitations: string[];
  search_performed?: boolean;
  confidence?: number;
}

export interface TokenUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  role: Role;
  content: string | null;
  reasoning_summary: ReasoningSummary | null;
  metadata: Record<string, any>;
  token_usage: TokenUsage | null;
  created_at: string;
  attachments?: Attachment[];
  citations?: Citation[];
}

export interface Attachment {
  id: string;
  user_id: string;
  conversation_id: string | null;
  message_id: string | null;
  original_filename: string;
  storage_path: string;
  mime_type: string;
  media_type: MediaType;
  file_size: number;
  checksum?: string | null;
  processing_status: ProcessingStatus;
  extracted_text?: string | null;
  extracted_metadata: Record<string, any>;
  created_at: string;
  url?: string;
}

export interface SearchSource {
  title: string;
  url: string;
  domain?: string;
  snippet?: string;
  citationText?: string;
  publishedAt?: string;
  relevance?: number;
}

export interface WebSearch {
  id: string;
  user_id: string;
  conversation_id: string | null;
  message_id: string | null;
  query: string;
  search_queries: string[];
  sources: SearchSource[];
  created_at: string;
}

export interface ResearchPlan {
  objective: string;
  sub_questions: string[];
  search_queries: string[];
  source_types: string[];
  evaluation_criteria: string[];
  expected_output_sections: string[];
}

export interface ResearchFinding {
  claim: string;
  evidence: string;
  source_urls: string[];
  confidence: number;
}

export interface Contradiction {
  topic: string;
  position_a: string;
  position_b: string;
  source_a: string[];
  source_b: string[];
}

export interface ResearchSession {
  id: string;
  user_id: string;
  conversation_id: string | null;
  title: string;
  objective: string;
  research_plan: ResearchPlan | null;
  queries: string[];
  sources: SearchSource[];
  findings: ResearchFinding[];
  contradictions: Contradiction[];
  synthesis: string | null;
  citations: Citation[];
  status: ResearchStatus;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeItem {
  id: string;
  user_id: string;
  conversation_id: string | null;
  source_attachment_id: string | null;
  knowledge_type: string;
  title: string;
  content: Record<string, any>;
  confidence: number | null;
  source_references: string[];
  created_at: string;
  updated_at: string;
}

export interface Citation {
  id: string;
  user_id: string;
  message_id: string | null;
  title: string | null;
  url: string;
  domain: string | null;
  source_type: string | null;
  citation_text: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface SavedResponse {
  id: string;
  user_id: string;
  message_id: string;
  created_at: string;
  message?: Message;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
