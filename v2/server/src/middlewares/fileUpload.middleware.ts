import { Request, Response, NextFunction } from 'express';
import { BadRequestError, ValidationError } from '@/utils/errors.util';
import { Config } from '@/constants/config.constant';

// Image magic bytes signatures for content validation
const IMAGE_SIGNATURES = {
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  // JPEG: FF D8 FF
  jpeg: [0xff, 0xd8, 0xff],
  // JPEG can also start with FF D8 FF E0 (JFIF) or FF D8 FF E1 (EXIF)
} as const;

/**
 * Validates image content by checking magic bytes
 * This prevents malicious files from being uploaded with fake extensions
 */
export function validateImageContent(buffer: Buffer): {
  isValid: boolean;
  detectedType: string | null;
} {
  if (!buffer || buffer.length < 8) {
    return { isValid: false, detectedType: null };
  }

  // Check PNG signature
  const isPng = IMAGE_SIGNATURES.png.every((byte, index) => buffer[index] === byte);
  if (isPng) {
    return { isValid: true, detectedType: 'image/png' };
  }

  // Check JPEG signature
  const isJpeg = IMAGE_SIGNATURES.jpeg.every((byte, index) => buffer[index] === byte);
  if (isJpeg) {
    return { isValid: true, detectedType: 'image/jpeg' };
  }

  return { isValid: false, detectedType: null };
}

/**
 * Validates file extension against allowed extensions
 */
export function validateFileExtension(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return (Config.UPLOAD.ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
}

/**
 * Validates file MIME type against allowed types
 */
export function validateMimeType(mimetype: string): boolean {
  return (Config.UPLOAD.ALLOWED_IMAGE_TYPES as readonly string[]).includes(mimetype);
}

/**
 * Validates file size against maximum allowed size
 */
export function validateFileSize(size: number): boolean {
  return size > 0 && size <= Config.UPLOAD.MAX_FILE_SIZE;
}

/**
 * Middleware to validate uploaded image files
 * - Checks file exists
 * - Validates MIME type
 * - Validates file extension
 * - Validates file size
 * - Validates actual image content (magic bytes)
 */
export function validateImageUpload(_fieldName: string = 'image', required: boolean = true) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const file = req.file;

    // Check if file is required
    if (!file) {
      if (required) {
        return next(new BadRequestError('Image file is required'));
      }
      return next();
    }

    const errors: Record<string, string[]> = {};

    // Validate file size
    if (!validateFileSize(file.size)) {
      const maxSizeMB = Config.UPLOAD.MAX_FILE_SIZE / (1024 * 1024);
      errors.size = [`File size must be less than ${maxSizeMB}MB`];
    }

    // Validate MIME type
    if (!validateMimeType(file.mimetype)) {
      errors.mimetype = [
        `Invalid file type: ${file.mimetype}. Allowed types: ${Config.UPLOAD.ALLOWED_IMAGE_TYPES.join(', ')}`,
      ];
    }

    // Validate file extension
    if (!validateFileExtension(file.originalname)) {
      errors.extension = [
        `Invalid file extension. Allowed extensions: ${Config.UPLOAD.ALLOWED_EXTENSIONS.join(', ')}`,
      ];
    }

    // Validate actual image content (magic bytes)
    const contentValidation = validateImageContent(file.buffer);
    if (!contentValidation.isValid) {
      errors.content = ['File content does not match a valid image format'];
    } else if (contentValidation.detectedType !== file.mimetype) {
      // Check if declared MIME type matches actual content
      // Allow jpeg/jpg mismatch since they're the same
      const declaredIsJpeg = file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg';
      const detectedIsJpeg = contentValidation.detectedType === 'image/jpeg';

      if (!(declaredIsJpeg && detectedIsJpeg)) {
        errors.mismatch = [
          `File content (${contentValidation.detectedType}) does not match declared type (${file.mimetype})`,
        ];
      }
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return next(new ValidationError(errors));
    }

    next();
  };
}

/**
 * Middleware for optional image uploads (e.g., updates)
 */
export const validateOptionalImageUpload = validateImageUpload('image', false);

/**
 * Middleware for required image uploads (e.g., creation)
 */
export const validateRequiredImageUpload = validateImageUpload('image', true);

export default {
  validateImageUpload,
  validateOptionalImageUpload,
  validateRequiredImageUpload,
  validateImageContent,
  validateFileExtension,
  validateMimeType,
  validateFileSize,
};
