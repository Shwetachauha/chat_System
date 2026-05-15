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

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data.upload;
  },
};
