import { env } from 'cloudflare:workers';
import { AppError } from '@/utils/errors.util';
import { ErrorMessages } from '@/constants/errorMessages.constant';
import logger from '@/configs/logger.config';
import defaultProfilePicture from '../assets/default-profile-picture.jpg';

// One R2 bucket; the old Supabase buckets become key prefixes.
const PROFILE_PICTURE_PREFIX = 'profile-picture/';
const RESUME_PREFIX = 'resume/';
const COMPANY_LOGO_PREFIX = 'company-logo/';
const DELETE_BATCH_LIMIT = 1000; // R2 delete() accepts at most 1000 keys

function imageContentType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  return 'image/jpeg';
}

function extensionOf(originalFilename: string): string {
  return originalFilename.split('.').pop()?.toLowerCase() || 'jpg';
}

async function put(key: string, body: ArrayBuffer | Uint8Array, contentType: string): Promise<void> {
  try {
    await env.FILES.put(key, body, { httpMetadata: { contentType } });
  } catch (error) {
    logger.error('Storage upload error', { key, error });
    throw new AppError(500, ErrorMessages.STORAGE.UPLOAD_FAILED);
  }
}

async function get(key: string): Promise<Buffer> {
  const object = await env.FILES.get(key);
  if (!object) {
    logger.error('Storage object not found', { key });
    throw new AppError(404, ErrorMessages.STORAGE.FILE_NOT_FOUND);
  }
  return Buffer.from(await object.arrayBuffer());
}

async function remove(key: string): Promise<void> {
  try {
    await env.FILES.delete(key);
  } catch (error) {
    // A leftover file is harmless and the nightly reset clears the bucket anyway.
    logger.error('Storage delete error', { key, error });
  }
}

export class StorageService {
  // ─── Profile Picture ────────────────────────────────────────────────────────

  async uploadDefaultProfilePicture(userId: string): Promise<string> {
    const filename = `profile_${userId}.jpg`;
    await put(PROFILE_PICTURE_PREFIX + filename, defaultProfilePicture, 'image/jpeg');
    return filename;
  }

  async uploadProfilePicture(buffer: Buffer, userId: string, originalFilename: string): Promise<string> {
    const extension = extensionOf(originalFilename);
    const filename = `profile_${userId}.${extension}`;
    await put(PROFILE_PICTURE_PREFIX + filename, buffer, `image/${extension}`);
    return filename;
  }

  async downloadProfilePicture(filename: string): Promise<{ buffer: Buffer; contentType: string }> {
    return { buffer: await get(PROFILE_PICTURE_PREFIX + filename), contentType: imageContentType(filename) };
  }

  async deleteProfilePicture(filename: string): Promise<void> {
    await remove(PROFILE_PICTURE_PREFIX + filename);
  }

  async uploadAdminProfilePicture(buffer: Buffer, userId: string, originalFilename: string): Promise<string> {
    const extension = extensionOf(originalFilename);
    const filename = `company_admin_${userId}.${extension}`;
    await put(PROFILE_PICTURE_PREFIX + filename, buffer, `image/${extension}`);
    return filename;
  }

  // ─── Resume ─────────────────────────────────────────────────────────────────

  async uploadResume(buffer: Buffer, userId: string): Promise<string> {
    const filename = `resume_${userId}.pdf`;
    await put(RESUME_PREFIX + filename, buffer, 'application/pdf');
    return filename;
  }

  async downloadResume(filename: string): Promise<Buffer> {
    return get(RESUME_PREFIX + filename);
  }

  async deleteResumeFile(filename: string): Promise<void> {
    await remove(RESUME_PREFIX + filename);
  }

  // ─── Company Logo ────────────────────────────────────────────────────────────

  async uploadCompanyLogo(buffer: Buffer, userId: string, originalFilename: string): Promise<string> {
    const extension = extensionOf(originalFilename);
    const filename = `logo_${userId}.${extension}`;
    await put(COMPANY_LOGO_PREFIX + filename, buffer, `image/${extension}`);
    return filename;
  }

  async downloadCompanyLogo(filename: string): Promise<{ buffer: Buffer; contentType: string }> {
    return { buffer: await get(COMPANY_LOGO_PREFIX + filename), contentType: imageContentType(filename) };
  }

  // ─── Demo reset ──────────────────────────────────────────────────────────────

  /** Deletes every object in the bucket. Returns how many were removed. */
  async deleteAll(): Promise<number> {
    let removed = 0;
    let cursor: string | undefined;
    do {
      const page = await env.FILES.list({ limit: DELETE_BATCH_LIMIT, ...(cursor && { cursor }) });
      const keys = page.objects.map((o) => o.key);
      if (keys.length > 0) await env.FILES.delete(keys);
      removed += keys.length;
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
    return removed;
  }
}

export const storageService = new StorageService();
export default storageService;
