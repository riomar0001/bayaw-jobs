import { supabase, PROFILE_PICTURE_BUCKET, RESUME_BUCKET } from '@/configs/supabase.config';
import { AppError } from '@/utils/errors.util';
import { ErrorMessages } from '@/constants/errorMessages.constant';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class StorageService {
  // ─── Profile Picture ────────────────────────────────────────────────────────

  async uploadDefaultProfilePicture(userId: string): Promise<string> {
    if (!supabase) {
      throw new AppError(500, 'Storage service not configured');
    }

    const assetPath = join(__dirname, '../assets/default-profile-picture.jpg');
    const buffer = readFileSync(assetPath);
    const filename = `profile_${userId}.jpg`;

    const { error } = await supabase.storage.from(PROFILE_PICTURE_BUCKET).upload(filename, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

    if (error) {
      console.error('Upload error:', error);
      throw new AppError(500, ErrorMessages.STORAGE.UPLOAD_FAILED);
    }

    return filename;
  }

  async uploadProfilePicture(
    buffer: Buffer,
    userId: string,
    originalFilename: string
  ): Promise<string> {
    if (!supabase) {
      throw new AppError(500, 'Storage service not configured');
    }

    const extension = originalFilename.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `profile_${userId}.${extension}`;

    const { error } = await supabase.storage.from(PROFILE_PICTURE_BUCKET).upload(filename, buffer, {
      contentType: `image/${extension}`,
      upsert: true,
    });

    if (error) {
      console.error('Upload error:', error);
      throw new AppError(500, ErrorMessages.STORAGE.UPLOAD_FAILED);
    }

    return filename;
  }

  async getProfilePictureUrl(filename: string): Promise<string> {
    if (!supabase) {
      return '';
    }

    const { data } = supabase.storage.from(PROFILE_PICTURE_BUCKET).getPublicUrl(filename);
    return data.publicUrl;
  }

  async downloadProfilePicture(filename: string): Promise<{ buffer: Buffer; contentType: string }> {
    if (!supabase) {
      throw new AppError(500, 'Storage service not configured');
    }

    const { data, error } = await supabase.storage.from(PROFILE_PICTURE_BUCKET).download(filename);

    if (error || !data) {
      console.error('Download error:', error);
      throw new AppError(500, ErrorMessages.STORAGE.UPLOAD_FAILED);
    }

    const extension = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const contentType =
      extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';

    return { buffer: Buffer.from(await data.arrayBuffer()), contentType };
  }

  async deleteProfilePicture(filename: string): Promise<void> {
    await this.deleteFile(PROFILE_PICTURE_BUCKET, filename);
  }

  // ─── Resume ─────────────────────────────────────────────────────────────────

  async uploadResume(buffer: Buffer, userId: string): Promise<string> {
    if (!supabase) {
      throw new AppError(500, 'Storage service not configured');
    }

    const filename = `resume_${userId}.pdf`;

    const { error } = await supabase.storage.from(RESUME_BUCKET).upload(filename, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

    if (error) {
      console.error('Upload error:', error);
      throw new AppError(500, ErrorMessages.STORAGE.UPLOAD_FAILED);
    }

    return filename;
  }

  async getResumeUrl(filename: string): Promise<string> {
    if (!supabase) {
      return '';
    }

    const { data } = supabase.storage.from(RESUME_BUCKET).getPublicUrl(filename);
    return data.publicUrl;
  }

  async downloadResume(filename: string): Promise<Buffer> {
    if (!supabase) {
      throw new AppError(500, 'Storage service not configured');
    }

    const { data, error } = await supabase.storage.from(RESUME_BUCKET).download(filename);

    if (error || !data) {
      console.error('Download error:', error);
      throw new AppError(500, ErrorMessages.STORAGE.UPLOAD_FAILED);
    }

    return Buffer.from(await data.arrayBuffer());
  }

  async deleteResumeFile(filename: string): Promise<void> {
    await this.deleteFile(RESUME_BUCKET, filename);
  }

  // ─── Shared ──────────────────────────────────────────────────────────────────

  private async deleteFile(bucket: string, path: string): Promise<void> {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Delete error:', error);
    }
  }
}

export const storageService = new StorageService();
export default storageService;
