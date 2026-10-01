import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageList } from '../components/MessageList.js';
import { Composer } from '../components/Composer.js';
import { api } from '../api/client.js';
import type { Message, Conversation } from '../../shared/types.js';

export const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const stopStreamRef = useRef<(() => void) | null>(null);

  // Load conversation & messages
  useEffect(() => {
    async function loadData() {
      if (!conversationId) {
        // If route is /app/chat with no ID, auto-create a new conversation
        const res = await api.createConversation({ title: 'New Conversation' });
        if (res.success && res.data) {
          navigate(`/app/chat/${res.data.id}`, { replace: true });
        }
        return;
      }

      setLoading(true);
      try {
        const [convRes, msgRes] = await Promise.all([
          api.getConversation(conversationId),
          api.getMessages(conversationId),
        ]);

        if (convRes.success && convRes.data) {
          setConversation(convRes.data);
        }
        if (msgRes.success && msgRes.data) {
          setMessages(msgRes.data);
        }
      } catch (err) {
        console.error('Failed to load chat:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [conversationId, navigate]);

  const handleSend = async (payload: {
    content: string;
    attachmentIds: string[];
    enableWebSearch: boolean;
    enableDeepResearch: boolean;
  }) => {
    if (!conversationId) return;

    setIsStreaming(true);
    setStreamingContent('');

    const cancelStream = api.streamMessage(
      conversationId,
      {
        content: payload.content,
        attachment_ids: payload.attachmentIds,
        enable_web_search: payload.enableWebSearch,
        enable_deep_research: payload.enableDeepResearch,
      },
      {
        onUserMessage: (userMsg) => {
          setMessages((prev) => [...prev, userMsg]);
        },
        onChunk: (chunk) => {
          setStreamingContent((prev) => prev + chunk);
        },
        onComplete: (assistantMsg) => {
          setIsStreaming(false);
          setStreamingContent('');
          setMessages((prev) => [...prev, assistantMsg]);
        },
        onConversationUpdated: (data) => {
          setConversation((prev) => (prev ? { ...prev, title: data.title } : null));
        },
        onError: (err) => {
          console.error('Streaming error:', err);
          setIsStreaming(false);
          setStreamingContent('');
          alert('Message failed to complete: ' + err.message);
        },
      }
    );

    stopStreamRef.current = cancelStream;
  };

  const handleStopGeneration = () => {
    if (stopStreamRef.current) {
      stopStreamRef.current();
      stopStreamRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleRegenerate = async (messageId: string) => {
    setIsStreaming(true);
    try {
      const res = await api.regenerateMessage(messageId, {});
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data!]);
      }
    } catch (err: any) {
      alert('Failed to regenerate: ' + err.message);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err: any) {
      alert('Failed to delete message: ' + err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 relative">
      {/* Messages Scroll Area */}
      <MessageList
        messages={messages}
        isStreaming={isStreaming}
        streamingContent={streamingContent}
        onSuggestionClick={(prompt) => {
          handleSend({
            content: prompt,
            attachmentIds: [],
            enableWebSearch: false,
            enableDeepResearch: false,
          });
        }}
        onRegenerate={handleRegenerate}
        onDelete={handleDeleteMessage}
      />

      {/* Multimodal Composer Fixed at Bottom */}
      <div className="p-3 md:p-4 bg-gradient-to-t from-[#090d16] via-[#090d16]/90 to-transparent">
        <Composer
          conversationId={conversationId}
          onSend={handleSend}
          isLoading={isStreaming}
          onStopGeneration={handleStopGeneration}
        />
      </div>
    </div>
  );
};
