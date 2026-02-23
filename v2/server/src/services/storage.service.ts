import { supabase, STORAGE_BUCKET } from '@/configs/supabase.config';
import { AppError } from '@/utils/errors.util';
import { ErrorMessages } from '@/constants/errorMessages.constant';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  async uploadProfileImage(file: Buffer, originalFilename: string): Promise<string> {
    if (!supabase) {
      throw new AppError(500, 'Storage service not configured');
    }

    const extension = originalFilename.split('.').pop() || 'png';
    const filename = `${uuidv4()}.${extension}`;
    const path = `profiles/${filename}`;

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
      contentType: `image/${extension}`,
      upsert: false,
    });

    if (error) {
      console.error('Upload error:', error);
      throw new AppError(500, ErrorMessages.STORAGE.UPLOAD_FAILED);
    }

    return filename;
  }

  async getProfileImageUrl(filename: string): Promise<string> {
    if (!supabase) {
      return '';
    }

    const path = `profiles/${filename}`;
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async deleteProfile(filename: string): Promise<void> {
    await this.deleteFile(`profiles/${filename}`);
  }

  async uploadResume(buffer: Buffer, controlNumber: string): Promise<string> {
    if (!supabase) {
      throw new AppError(500, 'Storage service not configured');
    }

    const filename = `${controlNumber}.png`;
    const path = `resume/${filename}`;

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, buffer, {
      contentType: 'image/png',
      upsert: true,
    });

    if (error) {
      console.error('Upload error:', error);
      throw new AppError(500, ErrorMessages.STORAGE.UPLOAD_FAILED);
    }

    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return urlData.publicUrl;
  }

  async getResume(controlNumber: string): Promise<string> {
    if (!supabase) {
      return '';
    }

    const path = `resume/${controlNumber}.png`;
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async downloadResume(controlNumber: string): Promise<Buffer> {
    if (!supabase) {
      throw new AppError(500, 'Storage service not configured');
    }

    const path = `resume/${controlNumber}.png`;
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).download(path);

    if (error) {
      console.error('Download error:', error);
      throw new AppError(500, ErrorMessages.STORAGE.DOWNLOAD_FAILED);
    }

    return Buffer.from(await data.arrayBuffer());
  }

  async deleteResume(controlNumber: string): Promise<void> {
    await this.deleteFile(`resume/${controlNumber}.png`);
  }

  async deleteFile(path: string): Promise<void> {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);

    if (error) {
      console.error('Delete error:', error);
    }
  }
}

export const storageService = new StorageService();
export default storageService;
