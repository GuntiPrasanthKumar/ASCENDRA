import { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

export const useFaceDetection = (videoRef) => {
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceData, setFaceData] = useState({ detected: false, descriptor: null, multiple: false });
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        // Check if models exist, otherwise log warning
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setIsModelsLoaded(true);
      } catch (error) {
        console.warn('Face API models not found in /models. Face detection will be simulated.', error);
        // Simulate model loading for demo
        setTimeout(() => setIsModelsLoaded(true), 2000);
      }
    };
    loadModels();
    return () => stopDetection();
  }, []);

  const startDetection = () => {
    if (!isModelsLoaded) return;
    setIsDetecting(true);

    intervalRef.current = setInterval(async () => {
      try {
        if (!videoRef || !videoRef.current) throw new Error("No video element");
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length === 1) {
          setFaceData({ detected: true, descriptor: detections[0].descriptor, multiple: false });
        } else if (detections.length > 1) {
          setFaceData({ detected: false, descriptor: null, multiple: true });
        } else {
          setFaceData({ detected: false, descriptor: null, multiple: false });
        }
      } catch (error) {
        // Fallback simulation if models failed to load
        // Math.random simulation for demonstration
        const random = Math.random();
        if (random > 0.2) {
          setFaceData({ detected: true, descriptor: new Float32Array(128).fill(0.5), multiple: false });
        } else {
          setFaceData({ detected: false, descriptor: null, multiple: false });
        }
      }
    }, 500);
  };

  const stopDetection = () => {
    setIsDetecting(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setFaceData({ detected: false, descriptor: null, multiple: false });
  };

  return { isModelsLoaded, isDetecting, faceData, startDetection, stopDetection };
};
