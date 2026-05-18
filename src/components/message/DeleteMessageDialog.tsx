import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { AnimatedDialog } from '@/components/common/AnimatedDialog';

interface DeleteMessageDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteMessageDialog({ open, onClose, onDelete }: DeleteMessageDialogProps) {
  return (
    <AnimatedDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Message</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this message? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDelete} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </AnimatedDialog>
  );
}
