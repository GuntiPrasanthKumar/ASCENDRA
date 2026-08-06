import { useRef, useState, useCallback, useEffect } from 'react';
import { FilesetResolver, FaceLandmarker, ImageEmbedder } from '@mediapipe/tasks-vision';

// Singleton promises to cache model loading once across components
let mediapipeInitPromise = null;
let cachedLandmarker = null;
let cachedEmbedder = null;

export const useFaceDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  
  const [isModelLoaded, setIsModelLoaded] = useState(Boolean(cachedLandmarker && cachedEmbedder));
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceData, setFaceData] = useState({
    detected: false,
    multiple: false,
    descriptor: null, // 512-float Array embedding
    pose: { yaw: 0, pitch: 0, roll: 0 },
    gaze: { direction: 'Center' }
  });
  const [error, setError] = useState(null);

  const loadModels = useCallback(async () => {
    if (cachedLandmarker && cachedEmbedder) {
      setIsModelLoaded(true);
      return;
    }
    try {
      if (!mediapipeInitPromise) {
        mediapipeInitPromise = (async () => {
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
          );

          // Try GPU delegate first, fallback to CPU delegate on failure
          let landmarker = null;
          try {
            landmarker = await FaceLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                delegate: "GPU"
              },
              runningMode: "VIDEO",
              numFaces: 2
            });
          } catch (gpuErr) {
            console.warn("GPU delegate unavailable for FaceLandmarker, falling back to CPU:", gpuErr);
            landmarker = await FaceLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                delegate: "CPU"
              },
              runningMode: "VIDEO",
              numFaces: 2
            });
          }

          let embedder = null;
          try {
            embedder = await ImageEmbedder.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite",
                delegate: "GPU"
              },
              runningMode: "VIDEO",
              l2Normalize: true
            });
          } catch (gpuErr) {
            console.warn("GPU delegate unavailable for ImageEmbedder, falling back to CPU:", gpuErr);
            embedder = await ImageEmbedder.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite",
                delegate: "CPU"
              },
              runningMode: "VIDEO",
              l2Normalize: true
            });
          }

          cachedLandmarker = landmarker;
          cachedEmbedder = embedder;
        })();
      }
      await mediapipeInitPromise;
      setIsModelLoaded(true);
    } catch (err) {
      mediapipeInitPromise = null;
      console.error("MediaPipe Vision Initialization Error:", err);
      setError("AI Vision Models failed to load via MediaPipe.");
    }
  }, []);

  // Calculate Head Pose (Yaw & Pitch) using MediaPipe 478 Landmarks
  const calculatePose = (landmarks) => {
    if (!landmarks || landmarks.length < 200) return { yaw: 0, pitch: 0, roll: 0, direction: 'Center' };

    const nose = landmarks[1]; // Nose tip
    const leftEye = landmarks[33]; // Left eye outer corner
    const rightEye = landmarks[263]; // Right eye outer corner
    const chin = landmarks[152]; // Chin

    const eyeDistance = Math.abs(rightEye.x - leftEye.x) || 0.1;
    const faceCenter = (leftEye.x + rightEye.x) / 2;
    const yaw = ((nose.x - faceCenter) / eyeDistance) * 100;

    const eyeLevel = (leftEye.y + rightEye.y) / 2;
    const chinDistance = Math.abs(chin.y - eyeLevel) || 0.1;
    const pitch = ((nose.y - eyeLevel) / chinDistance) * 100 - 20;

    let direction = 'Center';
    if (yaw < -25) direction = 'Right';
    else if (yaw > 25) direction = 'Left';
    else if (pitch < -35) direction = 'Up';
    else if (pitch > 35) direction = 'Down';

    return { yaw, pitch, roll: 0, direction };
  };

  const startCamera = useCallback(async (vRef) => {
    try {
      if (vRef) videoRef.current = vRef;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }, 
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(e => console.warn("Video element play warning:", e));
      }
      return true;
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Camera permission denied or not available.");
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startDetection = useCallback(async () => {
    setIsDetecting(true);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!videoRef.current || videoRef.current.readyState < 2 || !cachedLandmarker || !cachedEmbedder) return;

      try {
        const now = performance.now();
        const landmarkResult = cachedLandmarker.detectForVideo(videoRef.current, now);
        const embedResult = cachedEmbedder.embedForVideo(videoRef.current, now);

        if (landmarkResult.faceLandmarks && landmarkResult.faceLandmarks.length > 0) {
          const mainLandmarks = landmarkResult.faceLandmarks[0];
          const pose = calculatePose(mainLandmarks);
          
          let embeddingArray = null;
          if (embedResult && embedResult.embeddings && embedResult.embeddings.length > 0) {
            embeddingArray = Array.from(embedResult.embeddings[0].floatEmbedding);
          }

          // Format or pad to 512 dimension array if model produces different size
          if (embeddingArray) {
            if (embeddingArray.length < 512) {
              const padded = new Array(512).fill(0);
              for (let i = 0; i < embeddingArray.length; i++) padded[i] = embeddingArray[i];
              embeddingArray = padded;
            } else if (embeddingArray.length > 512) {
              embeddingArray = embeddingArray.slice(0, 512);
            }
          }

          setFaceData({
            detected: true,
            multiple: landmarkResult.faceLandmarks.length > 1,
            descriptor: embeddingArray, // 512-length Float array
            pose: { yaw: pose.yaw, pitch: pose.pitch, roll: 0 },
            gaze: { direction: pose.direction }
          });

          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            const width = videoRef.current.videoWidth || 640;
            const height = videoRef.current.videoHeight || 480;
            canvasRef.current.width = width;
            canvasRef.current.height = height;

            ctx.clearRect(0, 0, width, height);

            // Draw Face Mesh Points
            ctx.fillStyle = pose.direction === 'Center' ? '#10B981' : '#F59E0B';
            mainLandmarks.forEach(pt => {
              ctx.beginPath();
              ctx.arc(pt.x * width, pt.y * height, 1.2, 0, 2 * Math.PI);
              ctx.fill();
            });
          }
        } else {
          setFaceData(prev => (prev.detected ? { ...prev, detected: false, multiple: false, descriptor: null } : prev));
        }
      } catch (err) {
        console.error("MediaPipe Detection error:", err);
      }
    }, 300);
  }, []);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopCamera();
    setIsDetecting(false);
    setFaceData({ detected: false, multiple: false, descriptor: null, pose: { yaw: 0, pitch: 0, roll: 0 }, gaze: { direction: 'Center' } });
  }, [stopCamera]);

  useEffect(() => {
    loadModels();
    return () => stopDetection();
  }, [loadModels, stopDetection]);

  return {
    videoRef,
    canvasRef,
    isModelLoaded,
    isDetecting,
    faceData,
    loadModels,
    startCamera,
    stopCamera,
    startDetection,
    stopDetection,
    error
  };
};
