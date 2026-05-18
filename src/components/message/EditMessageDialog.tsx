import { useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { AnimatedDialog } from '@/components/common/AnimatedDialog';

interface EditMessageDialogProps {
  open: boolean;
  currentContent: string;
  onClose: () => void;
  onSave: (newContent: string) => void;
}

export function EditMessageDialog({ open, currentContent, onClose, onSave }: EditMessageDialogProps) {
  const [content, setContent] = useState(currentContent);

  const handleSave = () => {
    const trimmed = content.trim();
    if (trimmed && trimmed !== currentContent) {
      onSave(trimmed);
    }
    onClose();
  };

  return (
    <AnimatedDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Message</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          multiline
          maxRows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!content.trim() || content.trim() === currentContent}
        >
          Save
        </Button>
      </DialogActions>
    </AnimatedDialog>
  );
}
