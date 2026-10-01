import fs from 'fs';
import path from 'path';
import { db } from '../db/database.js';
import { config } from '../config/env.js';

export class StorageService {
  private localUploadsDir: string;

  constructor() {
    this.localUploadsDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(this.localUploadsDir)) {
      fs.mkdirSync(this.localUploadsDir, { recursive: true });
    }
  }

  async saveFile(options: {
    userId: string;
    conversationId?: string | null;
    attachmentId: string;
    filename: string;
    buffer: Buffer;
    mimeType: string;
  }): Promise<{ storagePath: string; url: string }> {
    const { userId, conversationId, attachmentId, filename, buffer, mimeType } = options;
    const convId = conversationId || 'unassigned';
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${userId}/${convId}/${attachmentId}/${sanitizedFilename}`;

    const supabase = db.getSupabase();
    if (supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from(config.supabase.storageBucket)
          .upload(storagePath, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadError) {
          const { data: signedData } = await supabase.storage
            .from(config.supabase.storageBucket)
            .createSignedUrl(storagePath, 3600); // 1 hour signed url
          if (signedData?.signedUrl) {
            return { storagePath, url: signedData.signedUrl };
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, using local storage fallback:', err);
      }
    }

    // Local storage fallback
    const targetDir = path.join(this.localUploadsDir, userId, convId, attachmentId);
    fs.mkdirSync(targetDir, { recursive: true });
    const localFilePath = path.join(targetDir, sanitizedFilename);
    fs.writeFileSync(localFilePath, buffer);

    const relativeUrl = `/api/uploads/${attachmentId}/download?file=${encodeURIComponent(sanitizedFilename)}`;
    return { storagePath, url: relativeUrl };
  }

  async getSignedUrl(storagePath: string): Promise<string> {
    const supabase = db.getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(config.supabase.storageBucket)
          .createSignedUrl(storagePath, 3600);
        if (!error && data?.signedUrl) {
          return data.signedUrl;
        }
      } catch {}
    }

    // Local file fallback
    const parts = storagePath.split('/');
    const attachmentId = parts[2] || 'unknown';
    const filename = parts[3] || 'file';
    return `/api/uploads/${attachmentId}/download?file=${encodeURIComponent(filename)}`;
  }

  async deleteFile(storagePath: string): Promise<boolean> {
    const supabase = db.getSupabase();
    if (supabase) {
      try {
        await supabase.storage.from(config.supabase.storageBucket).remove([storagePath]);
      } catch {}
    }

    const localFilePath = path.join(this.localUploadsDir, storagePath);
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch {}
    }
    return true;
  }

  getLocalFilePath(storagePath: string): string | null {
    const localFilePath = path.join(this.localUploadsDir, storagePath);
    if (fs.existsSync(localFilePath)) {
      return localFilePath;
    }
    return null;
  }
}

export const storageService = new StorageService();
