import type { Response } from 'express';
import fs from 'fs';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { db } from '../db/database.js';
import { geminiService } from '../services/gemini.service.js';
import { storageService } from '../services/storage.service.js';
import { createMessageSchema, regenerateMessageSchema } from '../validators/message.schemas.js';
import type { Attachment } from '../../shared/types.js';

export async function getMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
  const conversationId = req.params.id;
  const messages = await db.getMessages(conversationId, req.user!.id);
  res.status(200).json({ success: true, data: messages });
}

export async function createMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const conversationId = req.params.id;
  const userId = req.user!.id;
  const { content, attachment_ids, enable_web_search, enable_deep_research } =
    createMessageSchema.parse(req.body);

  const conv = await db.getConversationById(conversationId, userId);
  if (!conv) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
    return;
  }

  // 1. Create user message
  const userMsg = await db.createMessage({
    conversation_id: conversationId,
    user_id: userId,
    role: 'user',
    content: content || '',
    metadata: { enable_web_search, enable_deep_research },
  });

  // 2. Link attachments and load buffers
  const attachments: Attachment[] = [];
  const attachmentBuffers = new Map<string, Buffer>();

  if (attachment_ids && attachment_ids.length > 0) {
    for (const attId of attachment_ids) {
      const att = await db.getAttachmentById(attId, userId);
      if (att) {
        await db.updateAttachment(attId, userId, {
          conversation_id: conversationId,
          message_id: userMsg.id,
        });
        attachments.push(att);

        // Load buffer from local file if available
        const localPath = storageService.getLocalFilePath(att.storage_path);
        if (localPath && fs.existsSync(localPath)) {
          attachmentBuffers.set(att.id, fs.readFileSync(localPath));
        }
      }
    }
  }

  // Update conversation title if default
  const existingMsgs = await db.getMessages(conversationId, userId);
  if (existingMsgs.length <= 1 && content) {
    geminiService.generateConversationTitle(content).then((title) => {
      db.updateConversation(conversationId, userId, { title });
    });
  }

  // 3. User preferences
  const user = await db.getUserById(userId);

  // 4. Generate AI response
  const history = existingMsgs
    .filter((m) => m.id !== userMsg.id && m.content)
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content! }));

  let fullResponseText = '';
  const result = await geminiService.streamResponse({
    history,
    currentPrompt: content || '',
    attachments,
    attachmentBuffers,
    enableWebSearch: !!enable_web_search,
    userPreferences: {
      response_style: user?.response_style,
      preferred_language: user?.preferred_language,
    },
    onChunk: (chunk) => {
      fullResponseText += chunk;
    },
  });

  // 5. Store assistant message
  const assistantMsg = await db.createMessage({
    conversation_id: conversationId,
    user_id: userId,
    role: 'assistant',
    content: result.fullText || fullResponseText,
    reasoning_summary: result.reasoningSummary,
    metadata: { sources: result.sources },
  });

  // 6. Save citations
  for (const s of result.sources) {
    await db.createCitation({
      user_id: userId,
      message_id: assistantMsg.id,
      title: s.title,
      url: s.url,
      domain: s.domain || null,
      source_type: 'web',
      citation_text: s.snippet || null,
      metadata: { relevance: s.relevance || 1 },
    });
  }

  const finalMsg = await db.getMessageById(assistantMsg.id, userId);

  res.status(201).json({
    success: true,
    data: {
      userMessage: userMsg,
      assistantMessage: finalMsg,
    },
  });
}

// SSE Streaming message endpoint
export async function streamMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const conversationId = req.params.id;
  const userId = req.user!.id;

  let parsed;
  try {
    parsed = createMessageSchema.parse(req.body);
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: err.errors?.[0]?.message || err.message },
    });
    return;
  }

  const { content, attachment_ids, enable_web_search, enable_deep_research } = parsed;

  const conv = await db.getConversationById(conversationId, userId);
  if (!conv) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } });
    return;
  }

  // Setup SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // 1. Create user message
    const userMsg = await db.createMessage({
      conversation_id: conversationId,
      user_id: userId,
      role: 'user',
      content: content || '',
      metadata: { enable_web_search, enable_deep_research },
    });

    sendEvent('user_message', userMsg);

    // 2. Link attachments
    const attachments: Attachment[] = [];
    const attachmentBuffers = new Map<string, Buffer>();

    if (attachment_ids && attachment_ids.length > 0) {
      for (const attId of attachment_ids) {
        const att = await db.getAttachmentById(attId, userId);
        if (att) {
          await db.updateAttachment(attId, userId, {
            conversation_id: conversationId,
            message_id: userMsg.id,
          });
          attachments.push(att);

          const localPath = storageService.getLocalFilePath(att.storage_path);
          if (localPath && fs.existsSync(localPath)) {
            attachmentBuffers.set(att.id, fs.readFileSync(localPath));
          }
        }
      }
    }

    // Update conversation title if first message
    const existingMsgs = await db.getMessages(conversationId, userId);
    if (existingMsgs.length <= 1 && content) {
      geminiService.generateConversationTitle(content).then(async (title) => {
        await db.updateConversation(conversationId, userId, { title });
        sendEvent('conversation_updated', { title });
      });
    }

    const user = await db.getUserById(userId);
    const history = existingMsgs
      .filter((m) => m.id !== userMsg.id && m.content)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content! }));

    // Stream generation
    let fullContent = '';
    const result = await geminiService.streamResponse({
      history,
      currentPrompt: content || '',
      attachments,
      attachmentBuffers,
      enableWebSearch: !!enable_web_search,
      userPreferences: {
        response_style: user?.response_style,
        preferred_language: user?.preferred_language,
      },
      onChunk: (chunk) => {
        fullContent += chunk;
        sendEvent('chunk', { text: chunk });
      },
    });

    // 3. Store assistant message
    const assistantMsg = await db.createMessage({
      conversation_id: conversationId,
      user_id: userId,
      role: 'assistant',
      content: result.fullText || fullContent,
      reasoning_summary: result.reasoningSummary,
      metadata: { sources: result.sources },
    });

    // 4. Save citations
    for (const s of result.sources) {
      await db.createCitation({
        user_id: userId,
        message_id: assistantMsg.id,
        title: s.title,
        url: s.url,
        domain: s.domain || null,
        source_type: 'web',
        citation_text: s.snippet || null,
        metadata: { relevance: s.relevance || 1 },
      });
    }

    const finalMsg = await db.getMessageById(assistantMsg.id, userId);
    sendEvent('complete', finalMsg);
    res.end();
  } catch (err: any) {
    sendEvent('error', { message: err.message || 'Stream processing failed' });
    res.end();
  }
}

export async function regenerateMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const messageId = req.params.id;
  const userId = req.user!.id;
  const { enable_web_search } = regenerateMessageSchema.parse(req.body);

  const existing = await db.getMessageById(messageId, userId);
  if (!existing) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Message not found' } });
    return;
  }

  const allMsgs = await db.getMessages(existing.conversation_id, userId);
  const msgIdx = allMsgs.findIndex((m) => m.id === messageId);
  const previousUserMsg = allMsgs.slice(0, msgIdx).reverse().find((m) => m.role === 'user');

  if (!previousUserMsg) {
    res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'No preceding prompt to regenerate from' } });
    return;
  }

  const user = await db.getUserById(userId);
  const history = allMsgs
    .slice(0, msgIdx)
    .filter((m) => m.id !== previousUserMsg.id && m.content)
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content! }));

  const result = await geminiService.streamResponse({
    history,
    currentPrompt: previousUserMsg.content || '',
    attachments: previousUserMsg.attachments || [],
    attachmentBuffers: new Map(),
    enableWebSearch: !!enable_web_search,
    userPreferences: {
      response_style: user?.response_style,
      preferred_language: user?.preferred_language,
    },
    onChunk: () => {},
  });

  const updatedMsg = await db.createMessage({
    conversation_id: existing.conversation_id,
    user_id: userId,
    role: 'assistant',
    content: result.fullText,
    reasoning_summary: result.reasoningSummary,
    metadata: { sources: result.sources, regenerated_from: messageId },
  });

  res.status(201).json({ success: true, data: updatedMsg });
}

export async function deleteMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const messageId = req.params.id;
  const success = await db.deleteMessage(messageId, req.user!.id);
  if (!success) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Message not found' } });
    return;
  }
  res.status(200).json({ success: true, data: { message: 'Message deleted' } });
}
