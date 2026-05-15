import { useState, useCallback } from 'react';
import { uploadService } from '@/services/uploadService';
import { validateFile } from '@/utils/fileValidation';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useFileUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const uploadFile = useCallback(async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadState({ isUploading: false, progress: 0, error: validation.error! });
      return null;
    }

    setUploadState({ isUploading: true, progress: 0, error: null });

    try {
      const response = await uploadService.uploadFile(file, (progress: number) => {
        setUploadState((prev) => ({ ...prev, progress }));
      });

      setUploadState({ isUploading: false, progress: 100, error: null });
      return response;
    } catch {
      setUploadState({ isUploading: false, progress: 0, error: 'Upload failed. Please try again.' });
      return null;
    }
  }, []);

  const resetUpload = useCallback(() => {
    setUploadState({ isUploading: false, progress: 0, error: null });
  }, []);

  return {
    ...uploadState,
    uploadFile,
    resetUpload,
  };
}
