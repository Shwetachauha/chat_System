import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './constants';

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported. Allowed: images, PDFs, documents, videos, audio.',
    };
  }

  // Check for potentially dangerous file extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.js'];
  const fileName = file.name.toLowerCase();
  if (dangerousExtensions.some((ext) => fileName.endsWith(ext))) {
    return {
      valid: false,
      error: 'This file type is not allowed for security reasons.',
    };
  }

  return { valid: true };
}

export function getFileType(mimeType: string): 'image' | 'video' | 'audio' | 'file' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'file';
}
