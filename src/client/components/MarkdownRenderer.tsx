import React from 'react';
import { CodeBlock } from './CodeBlock.js';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split into code blocks and normal markdown segments
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose-mosaic text-sm md:text-base leading-relaxed text-slate-200">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
          const lang = match ? match[1] || '' : '';
          const code = match ? match[2] : part.slice(3, -3);
          return <CodeBlock key={index} language={lang} code={code} />;
        }

        // Render standard text with paragraphs, headers, and bullet points
        const lines = part.split('\n');
        const elements: React.ReactNode[] = [];
        let inList = false;
        let listItems: React.ReactNode[] = [];

        const flushList = () => {
          if (inList && listItems.length > 0) {
            elements.push(
              <ul key={`list-${elements.length}`} className="my-2 space-y-1 list-disc pl-5 text-slate-300">
                {listItems}
              </ul>
            );
            inList = false;
            listItems = [];
          }
        };

        lines.forEach((line, lIdx) => {
          const trimmed = line.trim();

          // Header 1
          if (trimmed.startsWith('# ')) {
            flushList();
            elements.push(
              <h1 key={lIdx} className="text-xl md:text-2xl font-bold text-white mt-4 mb-2 tracking-tight">
                {renderInline(trimmed.slice(2))}
              </h1>
            );
            return;
          }

          // Header 2
          if (trimmed.startsWith('## ')) {
            flushList();
            elements.push(
              <h2 key={lIdx} className="text-lg md:text-xl font-semibold text-white mt-4 mb-2 border-b border-white/10 pb-1">
                {renderInline(trimmed.slice(3))}
              </h2>
            );
            return;
          }

          // Header 3
          if (trimmed.startsWith('### ')) {
            flushList();
            elements.push(
              <h3 key={lIdx} className="text-base md:text-lg font-semibold text-brand-300 mt-3 mb-1">
                {renderInline(trimmed.slice(4))}
              </h3>
            );
            return;
          }

          // Header 4
          if (trimmed.startsWith('#### ')) {
            flushList();
            elements.push(
              <h4 key={lIdx} className="text-sm md:text-base font-medium text-slate-200 mt-2 mb-1">
                {renderInline(trimmed.slice(5))}
              </h4>
            );
            return;
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            flushList();
            elements.push(
              <blockquote key={lIdx} className="border-l-4 border-brand-500 bg-brand-500/10 px-4 py-2 my-2 rounded-r-lg text-slate-300 italic">
                {renderInline(trimmed.slice(2))}
              </blockquote>
            );
            return;
          }

          // Bullet list items
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            inList = true;
            listItems.push(
              <li key={lIdx} className="text-slate-300">
                {renderInline(trimmed.slice(2))}
              </li>
            );
            return;
          }

          // Numbered lists
          const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
          if (numMatch) {
            inList = true;
            listItems.push(
              <li key={lIdx} className="text-slate-300">
                {renderInline(numMatch[2])}
              </li>
            );
            return;
          }

          // Blank line
          if (!trimmed) {
            flushList();
            return;
          }

          // Regular paragraph
          flushList();
          elements.push(
            <p key={lIdx} className="my-2 text-slate-300 leading-relaxed">
              {renderInline(line)}
            </p>
          );
        });

        flushList();
        return <div key={index}>{elements}</div>;
      })}
    </div>
  );
};

// Inline parser for bold, italic, inline code, and links
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index} className="font-semibold text-white">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={match.index} className="italic text-slate-300">{token.slice(1, -1)}</em>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-white/10 text-brand-300 text-xs font-mono">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
