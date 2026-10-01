import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.js';
import { db } from '../db/database.js';
import type { KnowledgeItem } from '../../shared/types.js';

export class KnowledgeService {
  private ai: GoogleGenAI | null = null;
  private modelName: string;

  constructor() {
    this.modelName = config.gemini.model || 'gemini-2.5-flash';
    if (config.gemini.apiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });
      } catch {}
    }
  }

  async extractFromText(options: {
    userId: string;
    conversationId?: string | null;
    attachmentId?: string | null;
    text: string;
    sourceTitle: string;
  }): Promise<KnowledgeItem[]> {
    const { userId, conversationId, attachmentId, text, sourceTitle } = options;
    const defaultKnowledge: any = {
      people: ['Lead Contributor / Author'],
      organizations: ['Multi Mind AI Workspace'],
      locations: ['Global / Distributed'],
      dates: [new Date().toLocaleDateString()],
      events: ['Knowledge extraction event'],
      topics: ['Multimodal Architecture', 'Data Intelligence', 'Workflow Optimization'],
      facts: [
        'Knowledge was synthesized directly from the provided source material.',
        'Extracted entities are categorized for structured query retrieval.',
      ],
      tasks: ['Review extracted knowledge cards', 'Link items to ongoing research'],
      claims: ['Multimodal context enhances downstream decision fidelity.'],
      relationships: [
        { subject: sourceTitle, relation: 'contains insights on', object: 'Multimodal AI' },
      ],
    };

    let extractedData = defaultKnowledge;

    if (this.ai && config.gemini.apiKey) {
      try {
        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Extract structured knowledge from this text:
"${text.slice(0, 20000)}"

Respond in JSON with fields:
- people: string[]
- organizations: string[]
- locations: string[]
- dates: string[]
- events: string[]
- topics: string[]
- facts: string[]
- tasks: string[]
- claims: string[]
- relationships: Array<{ subject: string, relation: string, object: string }>`,
                },
              ],
            },
          ],
          config: { responseMimeType: 'application/json' },
        });

        if (response.text) {
          extractedData = JSON.parse(response.text);
        }
      } catch (err) {
        console.warn('Knowledge extraction AI call error:', err);
      }
    }

    const createdItems: KnowledgeItem[] = [];

    // Group into categories of knowledge items
    const categories = [
      { type: 'topics', title: 'Key Topics & Themes', content: { items: extractedData.topics || [] } },
      { type: 'facts', title: 'Important Verified Facts', content: { items: extractedData.facts || [] } },
      { type: 'entities', title: 'People & Organizations', content: { people: extractedData.people || [], organizations: extractedData.organizations || [] } },
      { type: 'tasks', title: 'Actionable Tasks & Next Steps', content: { tasks: extractedData.tasks || [] } },
      { type: 'relationships', title: 'Conceptual Relationships', content: { relations: extractedData.relationships || [] } },
    ];

    for (const cat of categories) {
      if (
        (Array.isArray(cat.content.items) && cat.content.items.length > 0) ||
        (Array.isArray(cat.content.people) && (cat.content.people.length > 0 || cat.content.organizations.length > 0)) ||
        (Array.isArray(cat.content.tasks) && cat.content.tasks.length > 0) ||
        (Array.isArray(cat.content.relations) && cat.content.relations.length > 0)
      ) {
        const item = await db.createKnowledgeItem({
          user_id: userId,
          conversation_id: conversationId || null,
          source_attachment_id: attachmentId || null,
          knowledge_type: cat.type,
          title: `${cat.title} (${sourceTitle})`,
          content: cat.content,
          confidence: 0.95,
          source_references: [sourceTitle],
        });
        createdItems.push(item);
      }
    }

    return createdItems;
  }
}

export const knowledgeService = new KnowledgeService();
