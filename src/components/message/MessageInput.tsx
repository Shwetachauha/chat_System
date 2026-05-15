import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Paper,
  Popover,
} from '@mui/material';
import {
  Send,
  AttachFile,
  Image as ImageIcon,
  Close,
  EmojiEmotions,
  CameraAlt,
  Reply,
} from '@mui/icons-material';
import { useTyping } from '@/hooks/useTyping';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useMessages } from '@/hooks/useMessages';
import { getFileType } from '@/utils/fileValidation';
import { sanitizeInput } from '@/utils/sanitize';
import { CameraCaptureDialog } from './CameraCaptureDialog';
import { Message } from '@/types';

interface MessageInputProps {
  chatId: string;
  replyToMessage?: Message | null;
  onCancelReply?: () => void;
}

export function MessageInput({ chatId, replyToMessage, onCancelReply }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLButtonElement | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { startTyping, stopTyping } = useTyping(chatId);
  const { isUploading, progress, error: uploadError, uploadFile, resetUpload } = useFileUpload();
  const { sendMessage } = useMessages(chatId);

  const EMOJI_LIST = [
    '😀', '😂', '😍', '🥰', '😎', '🤔', '😮', '😢',
    '😡', '👍', '👎', '❤️', '🔥', '🎉', '✅', '⭐',
    '👋', '🙏', '💪', '🤝', '👏', '🫡', '💯', '🚀',
    '😊', '🥺', '😏', '🤣', '😴', '🤯', '🥳', '😇',
    '🤗', '🫶', '💔', '✨', '🌟', '💀', '👀', '🙌',
  ];

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji);
    setEmojiAnchor(null);
  };

  const handleSend = useCallback(async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent && !selectedFile) return;

    stopTyping();
    const replyId = replyToMessage?.id;

    if (selectedFile) {
      const result = await uploadFile(selectedFile);
      if (result) {
        const type = getFileType(selectedFile.type);
        sendMessage(trimmedContent || selectedFile.name, type, result.url, result.fileName, replyId);
      }
      clearFile();
    } else {
      sendMessage(sanitizeInput(trimmedContent), 'text', undefined, undefined, replyId);
    }

    setContent('');
    onCancelReply?.();
  }, [content, selectedFile, stopTyping, uploadFile, sendMessage, replyToMessage, onCancelReply]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    startTyping();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    resetUpload();

    if (type === 'image' && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    // Reset the input
    e.target.value = '';
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    resetUpload();
  };

  return (
    <Box borderTop={1} borderColor="divider" bgcolor="background.paper">
      {/* Reply preview */}
      {replyToMessage && (
        <Box px={2} pt={1}>
          <Paper
            variant="outlined"
            sx={{
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderLeft: 3,
              borderColor: 'primary.main',
            }}
          >
            <Reply sx={{ fontSize: 18, color: 'primary.main' }} />
            <Box flex={1} overflow="hidden">
              <Typography variant="caption" fontWeight={600} color="primary.main" display="block">
                {replyToMessage.senderName}
              </Typography>
              <Typography variant="body2" noWrap color="text.secondary">
                {replyToMessage.content}
              </Typography>
            </Box>
            <IconButton size="small" onClick={onCancelReply}>
              <Close fontSize="small" />
            </IconButton>
          </Paper>
        </Box>
      )}

      {/* File preview */}
      {selectedFile && (
        <Box px={2} pt={1}>
          <Paper variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }}
              />
            )}
            <Box flex={1} overflow="hidden">
              <Typography variant="body2" noWrap>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
            {isUploading && <CircularProgress size={20} variant="determinate" value={progress} />}
            <IconButton size="small" onClick={clearFile}>
              <Close fontSize="small" />
            </IconButton>
          </Paper>
        </Box>
      )}

      {uploadError && (
        <Typography variant="caption" color="error" px={2}>
          {uploadError}
        </Typography>
      )}

      {/* Input area */}
      <Box display="flex" alignItems="flex-end" gap={0.5} p={1.5} px={2}>
        <Box display="flex" gap={0.3}>
          <IconButton
            size="small"
            onClick={(e) => setEmojiAnchor(e.currentTarget)}
            disabled={isUploading}
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            <EmojiEmotions fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            <AttachFile fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => imageInputRef.current?.click()}
            disabled={isUploading}
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            <ImageIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => setCameraOpen(true)}
            disabled={isUploading}
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            <CameraAlt fontSize="small" />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder="Type a message..."
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isUploading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#f1f5f9',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: '#e2e8f0' },
              '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: 1.5 },
              '&.Mui-focused': { backgroundColor: '#ffffff' },
            },
          }}
        />

        <IconButton
          onClick={handleSend}
          disabled={(!content.trim() && !selectedFile) || isUploading}
          sx={{
            width: 38,
            height: 38,
            background: (!content.trim() && !selectedFile) || isUploading
              ? 'transparent'
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: (!content.trim() && !selectedFile) || isUploading ? 'text.disabled' : 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Send fontSize="small" />
        </IconButton>
      </Box>

      {/* Emoji Picker Popover */}
      <Popover
        open={Boolean(emojiAnchor)}
        anchorEl={emojiAnchor}
        onClose={() => setEmojiAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: 0.5,
            p: 1.5,
            maxWidth: 320,
          }}
        >
          {EMOJI_LIST.map((emoji) => (
            <Box
              key={emoji}
              onClick={() => handleEmojiSelect(emoji)}
              sx={{
                fontSize: 24,
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: 1,
                p: 0.5,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              {emoji}
            </Box>
          ))}
        </Box>
      </Popover>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(e) => handleFileSelect(e, 'file')}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.mp4,.webm,.mp3,.wav"
      />
      <input
        ref={imageInputRef}
        type="file"
        hidden
        onChange={(e) => handleFileSelect(e, 'image')}
        accept="image/*"
      />

      {/* Camera Capture Dialog */}
      <CameraCaptureDialog
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(file) => {
          setSelectedFile(file);
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
          resetUpload();
        }}
      />
    </Box>
  );
}
