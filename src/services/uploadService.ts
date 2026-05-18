import api from './api';

interface UploadResult {
  id: string;
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  createdAt: string;
}

interface UploadResponse {
  message: string;
  upload: UploadResult;
}

export const uploadService = {
  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('[Upload] Uploading file:', { name: file.name, type: file.type, size: file.size });

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('[Upload] Progress:', progress + '%');
          onProgress(progress);
        }
      },
    });

    console.log('[Upload] Response status:', response.status);
    console.log('[Upload] Response data:', JSON.stringify(response.data, null, 2));
    console.log('[Upload] Upload result:', { id: response.data.upload?.id, url: response.data.upload?.url, format: response.data.upload?.format, bytes: response.data.upload?.bytes });

    return response.data.upload;
  },
};
