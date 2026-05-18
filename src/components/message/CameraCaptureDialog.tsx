import { useState, useRef, useCallback, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import { CameraAlt, FlipCameraAndroid, Close } from '@mui/icons-material';
import { AnimatedDialog } from '@/components/common/AnimatedDialog';

interface CameraCaptureDialogProps {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export function CameraCaptureDialog({ open, onClose, onCapture }: CameraCaptureDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permissions in your browser.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else {
          setError('Could not access camera. Please try again.');
        }
      } else {
        setError('Could not access camera. Please try again.');
      }
    }
  }, [facingMode]);

  useEffect(() => {
    if (open && !capturedImage) {
      startCamera();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [open, startCamera, capturedImage]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);

    // Stop the camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSend = () => {
    if (!capturedImage || !canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `camera-photo-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
          onCapture(file);
          handleClose();
        }
      },
      'image/jpeg',
      0.9
    );
  };

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCapturedImage(null);
    setError(null);
    onClose();
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <AnimatedDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Take Photo
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, position: 'relative', minHeight: 300 }}>
        {isLoading && !capturedImage && (
          <Box display="flex" alignItems="center" justifyContent="center" height={300}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box display="flex" alignItems="center" justifyContent="center" height={300} px={3}>
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          </Box>
        )}

        {/* Live camera feed */}
        <Box
          sx={{
            display: capturedImage || error ? 'none' : 'block',
            bgcolor: 'black',
            position: 'relative',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'cover',
              display: isLoading ? 'none' : 'block',
            }}
          />
          {!isLoading && !error && (
            <IconButton
              onClick={toggleCamera}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
              size="small"
            >
              <FlipCameraAndroid />
            </IconButton>
          )}
        </Box>

        {/* Captured image preview */}
        {capturedImage && (
          <Box sx={{ bgcolor: 'black' }}>
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
            />
          </Box>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', py: 2 }}>
        {!capturedImage && !error && (
          <IconButton
            onClick={handleCapture}
            disabled={isLoading}
            sx={{
              width: 64,
              height: 64,
              border: '3px solid',
              borderColor: 'primary.main',
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <CameraAlt fontSize="large" />
          </IconButton>
        )}

        {capturedImage && (
          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={handleRetake}>
              Retake
            </Button>
            <Button variant="contained" onClick={handleSend}>
              Send Photo
            </Button>
          </Box>
        )}

        {error && (
          <Button variant="contained" onClick={startCamera}>
            Retry
          </Button>
        )}
      </DialogActions>
    </AnimatedDialog>
  );
}
