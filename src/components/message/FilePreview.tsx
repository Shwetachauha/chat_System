import { memo } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { InsertDriveFile, Download } from '@mui/icons-material';
import { formatFileSize } from '@/utils/helpers';

interface FilePreviewProps {
  type: string;
  url: string;
  fileName?: string;
  fileSize?: number;
  thumbnailUrl?: string;
}

export const FilePreview = memo(function FilePreview({
  type,
  url,
  fileName,
  fileSize,
  thumbnailUrl,
}: FilePreviewProps) {
  const normalizedType = type.toLowerCase();
  const isImage = normalizedType === 'image' || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(url || '') || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(fileName || '');

  if (isImage) {
    return (
      <Box mb={0.5} sx={{ maxWidth: 280, borderRadius: 2, overflow: 'hidden' }}>
        <img
          src={thumbnailUrl || url}
          alt={fileName || 'Image'}
          style={{
            width: '100%',
            maxHeight: 300,
            borderRadius: 8,
            objectFit: 'cover',
            cursor: 'pointer',
            display: 'block',
          }}
          onClick={() => window.open(url, '_blank')}
          loading="lazy"
        />
      </Box>
    );
  }

  if (normalizedType === 'video') {
    return (
      <Box mb={0.5}>
        <video
          src={url}
          controls
          style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
          preload="metadata"
        />
      </Box>
    );
  }

  if (normalizedType === 'audio') {
    return (
      <Box mb={0.5}>
        <audio src={url} controls style={{ width: '100%' }} preload="metadata" />
      </Box>
    );
  }

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      color="inherit"
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        p={1}
        borderRadius={1}
        bgcolor="action.hover"
        mb={0.5}
      >
        <InsertDriveFile sx={{ fontSize: 32 }} />
        <Box flex={1} overflow="hidden">
          <Typography variant="body2" noWrap fontWeight={500}>
            {fileName || 'File'}
          </Typography>
          {fileSize && (
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(fileSize)}
            </Typography>
          )}
        </Box>
        <Download sx={{ fontSize: 20 }} />
      </Box>
    </Link>
  );
});
