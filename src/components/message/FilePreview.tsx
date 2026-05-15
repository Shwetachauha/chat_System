import { memo } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { InsertDriveFile, Download } from '@mui/icons-material';
import { formatFileSize } from '@/utils/helpers';

interface FilePreviewProps {
  type: 'image' | 'file' | 'video' | 'audio';
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
  if (type === 'image') {
    return (
      <Box mb={0.5}>
        <img
          src={thumbnailUrl || url}
          alt={fileName || 'Image'}
          style={{
            maxWidth: '100%',
            maxHeight: 300,
            borderRadius: 8,
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={() => window.open(url, '_blank')}
          loading="lazy"
        />
      </Box>
    );
  }

  if (type === 'video') {
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

  if (type === 'audio') {
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
