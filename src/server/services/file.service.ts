import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import type { MediaType } from '../../shared/types.js';

export class FileService {
  determineMediaType(mimeType: string, filename: string): MediaType {
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    if (
      mimeType.startsWith('image/') ||
      ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)
    ) {
      return 'image';
    }
    if (
      mimeType.startsWith('audio/') ||
      ['mp3', 'wav', 'ogg', 'm4a', 'webm', 'aac'].includes(ext)
    ) {
      return 'audio';
    }
    if (
      mimeType.startsWith('video/') ||
      ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)
    ) {
      return 'video';
    }
    if (
      mimeType === 'application/pdf' ||
      mimeType.includes('document') ||
      mimeType.includes('word') ||
      ['pdf', 'doc', 'docx', 'txt', 'csv', 'json', 'md', 'ppt', 'pptx'].includes(ext)
    ) {
      return 'document';
    }
    return 'other';
  }

  async extractContent(
    buffer: Buffer,
    mimeType: string,
    filename: string
  ): Promise<{ text: string | null; metadata: Record<string, any> }> {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const metadata: Record<string, any> = {
      filename,
      extension: ext,
      mimeType,
      byteLength: buffer.length,
    };

    try {
      if (ext === 'pdf' || mimeType === 'application/pdf') {
        const data = await pdfParse(buffer);
        metadata.numPages = data.numpages;
        metadata.info = data.info;
        return {
          text: data.text?.slice(0, 100000) || null, // Up to 100k characters
          metadata,
        };
      }

      if (ext === 'docx' || mimeType.includes('wordprocessingml')) {
        const result = await mammoth.extractRawText({ buffer });
        return {
          text: result.value?.slice(0, 100000) || null,
          metadata,
        };
      }

      if (['txt', 'md', 'json', 'csv'].includes(ext) || mimeType.startsWith('text/')) {
        const text = buffer.toString('utf8');
        return {
          text: text.slice(0, 100000),
          metadata,
        };
      }

      if (['image', 'audio', 'video'].includes(this.determineMediaType(mimeType, filename))) {
        return {
          text: null,
          metadata: {
            ...metadata,
            format: ext,
          },
        };
      }

      return { text: null, metadata };
    } catch (err: any) {
      console.warn('Error during content extraction for file:', filename, err.message);
      return {
        text: null,
        metadata: { ...metadata, extractionError: err.message },
      };
    }
  }
}

export const fileService = new FileService();
