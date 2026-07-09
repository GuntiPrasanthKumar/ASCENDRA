import { useEffect, useRef, useCallback, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useToastStore } from '../components/common/Toast';
import { useAuthStore } from './useAuthStore';

export const useProctor = (isActive, faceData, onStrike) => {
  const { addToast } = useToastStore();
  const { user } = useAuthStore();
  const [strikes, setStrikes] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const lastStrikeTime = useRef(0);
  const violationBuffer = useRef({ face: 0, gaze: 0, noise: 0, mismatch: 0 });
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const storedDescriptor = useRef(null);

  const COOLDOWN = 5000;
  const PERSISTENCE_THRESHOLD = 5;

  // Load user face profile once
  useEffect(() => {
    if (user?.email) {
      const stored = localStorage.getItem('faceDescriptor_' + user.email);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Convert object back to Float32Array if needed
          storedDescriptor.current = new Float32Array(Object.values(parsed));
        } catch (e) {
          console.warn("Face descriptor parse error", e);
        }
      }
    }
  }, [user]);

  const addStrike = useCallback((reason) => {
    const now = Date.now();
    if (now - lastStrikeTime.current < COOLDOWN) return;

    lastStrikeTime.current = now;
    setStrikes(prev => {
      const next = prev + 1;
      onStrike(next, reason);
      return next;
    });
    addToast(`Violation: ${reason}`, 'error');
  }, [onStrike, addToast]);

  // Audio Detection
  useEffect(() => {
    if (!isActive) return;

    const startAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        analyser.current = audioContext.current.createAnalyser();
        const source = audioContext.current.createMediaStreamSource(stream);
        source.connect(analyser.current);
        analyser.current.fftSize = 256;
        
        const dataArray = new Uint8Array(analyser.current.frequencyBinCount);

        const checkAudio = () => {
          if (!isActive) return;
          analyser.current.getByteFrequencyData(dataArray);
          let average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);

          if (average > 45) { 
            violationBuffer.current.noise++;
            if (violationBuffer.current.noise > 15) {
              addStrike('Talking or loud noise detected');
              violationBuffer.current.noise = 0;
            }
          } else {
            violationBuffer.current.noise = Math.max(0, violationBuffer.current.noise - 1);
          }
          requestAnimationFrame(checkAudio);
        };
        checkAudio();
      } catch (err) { console.warn("Audio failed", err); }
    };
    startAudio();
    return () => audioContext.current?.close();
  }, [isActive, addStrike]);

  // Vision Proctoring & Identity Match
  useEffect(() => {
    if (!isActive || !faceData) return;

    // 1. Check Identity Match (Is this the same person who logged in?)
    if (faceData.detected && faceData.descriptor && storedDescriptor.current) {
      const distance = faceapi.euclideanDistance(storedDescriptor.current, faceData.descriptor);
      if (distance > 0.6) { // Threshold for mismatch
        violationBuffer.current.mismatch++;
        if (violationBuffer.current.mismatch > 5) {
          addStrike('Identity Mismatch: Different person detected');
          violationBuffer.current.mismatch = 0;
        }
      } else {
        violationBuffer.current.mismatch = 0;
      }
    }

    // 2. Check Multiple Faces
    if (faceData.multiple) addStrike('Multiple persons detected');

    // 3. Face Absent
    if (!faceData.detected) {
      violationBuffer.current.face++;
      if (violationBuffer.current.face > 10) {
        addStrike('Face not detected or person left');
        violationBuffer.current.face = 0;
      }
    } else {
      violationBuffer.current.face = 0;
    }

    // 4. Gaze Tracking
    if (faceData.gaze && faceData.gaze.direction !== 'Center') {
      violationBuffer.current.gaze++;
      if (violationBuffer.current.gaze > 8) {
        addStrike(`Looking away: ${faceData.gaze.direction}`);
        violationBuffer.current.gaze = 0;
      }
    } else {
      violationBuffer.current.gaze = 0;
    }

  }, [faceData, isActive, addStrike]);

  // Browser Events
  useEffect(() => {
    if (!isActive) return;
    const handleVisibilityChange = () => document.visibilityState === 'hidden' && addStrike('Tab switched');
    const handleBlur = () => addStrike('Window lost focus');
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isActive, addStrike]);

  return { strikes, audioLevel };
};
