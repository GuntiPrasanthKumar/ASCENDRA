import * as faceapi from 'face-api.js';
import { useRef, useState, useCallback, useEffect } from 'react';

export const useFaceDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceData, setFaceData] = useState({
    detected: false,
    multiple: false,
    descriptor: null,
    pose: { yaw: 0, pitch: 0, roll: 0 },
    gaze: { direction: 'Center' }
  });
  const [error, setError] = useState(null);

  const loadModels = useCallback(async () => {
    if (isModelLoaded) return;
    try {
      const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setIsModelLoaded(true);
      console.log("AI Models loaded successfully.");
    } catch (err) {
      setError("AI Models failed to load.");
    }
  }, [isModelLoaded]);

  // Calculate Head Pose (Yaw & Pitch)
  const calculatePose = (landmarks) => {
    const nose = landmarks.getNose()[3]; // Tip of the nose
    const leftEye = landmarks.getLeftEye()[0];
    const rightEye = landmarks.getRightEye()[3];
    const jaw = landmarks.getJawOutline();
    const chin = jaw[8];
    const leftJaw = jaw[0];
    const rightJaw = jaw[16];

    // Simple estimation based on relative positions
    const faceCenter = (leftEye.x + rightEye.x) / 2;
    const yaw = ((nose.x - faceCenter) / (rightEye.x - leftEye.x)) * 100;
    
    const eyeLevel = (leftEye.y + rightEye.y) / 2;
    const pitch = ((nose.y - eyeLevel) / (chin.y - eyeLevel)) * 100 - 20; // Offset for normal pose

    let direction = 'Center';
    if (yaw < -30) direction = 'Right';
    else if (yaw > 30) direction = 'Left';
    else if (pitch < -40) direction = 'Up';
    else if (pitch > 40) direction = 'Down';

    return { yaw, pitch, roll: 0, direction };
  };

  const startCamera = useCallback(async (vRef) => {
    try {
      videoRef.current = vRef;
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' }, 
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch (err) {
      setError("Camera permission denied or not available.");
      return false;
    }
  }, []);

  const startDetection = useCallback(async () => {
    setIsDetecting(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return;

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.2 }))
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length > 0) {
          // Sort by box size to always pick the closest/largest face
          const sorted = detections.sort((a, b) => b.detection.box.area - a.detection.box.area);
          const mainFace = sorted[0];
          const pose = calculatePose(mainFace.landmarks);
          
          setFaceData({
            detected: true,
            multiple: detections.length > 1,
            descriptor: Array.from(mainFace.descriptor),
            pose: { yaw: pose.yaw, pitch: pose.pitch, roll: 0 },
            gaze: { direction: pose.direction }
          });

          if (canvasRef.current) {
            const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
            faceapi.matchDimensions(canvasRef.current, displaySize);
            const resized = faceapi.resizeResults(detections, displaySize);
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            faceapi.draw.drawDetections(canvasRef.current, resized);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
          }
        } else {
          setFaceData(prev => ({ ...prev, detected: false, multiple: false, descriptor: null }));
        }
      } catch (err) {
        console.error("Detection error:", err);
      }
    }, 300); // Slightly faster interval for responsiveness
  }, []);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsDetecting(false);
    setFaceData({ detected: false, multiple: false, descriptor: null, pose: { yaw: 0, pitch: 0, roll: 0 }, gaze: { direction: 'Center' } });
  }, []);

  useEffect(() => {
    loadModels();
    return () => stopDetection();
  }, [loadModels, stopDetection]);

  return {
    canvasRef,
    isModelLoaded,
    isDetecting,
    faceData,
    startCamera,
    startDetection,
    stopDetection,
    error
  };
};
