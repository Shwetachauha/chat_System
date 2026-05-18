import { DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { AnimatedDialog } from '@/components/common/AnimatedDialog';

interface DeleteChatDialogProps {
  open: boolean;
  chatName: string;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteChatDialog({ open, chatName, onClose, onDelete }: DeleteChatDialogProps) {
  return (
    <AnimatedDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Chat</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the chat with <strong>{chatName}</strong>? This will remove it from your sidebar. Messages will not be deleted from the server.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </AnimatedDialog>
  );
}
