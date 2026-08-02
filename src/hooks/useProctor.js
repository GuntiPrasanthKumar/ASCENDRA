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
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioStreamRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastAudioUpdateRef = useRef(0);
  const storedDescriptor = useRef(null);

  const COOLDOWN = 5000;

  // Load user face profile once
  useEffect(() => {
    if (user?.email) {
      const stored = localStorage.getItem('faceDescriptor_' + user.email);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
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
      if (typeof onStrike === 'function') {
        onStrike(next, reason);
      }
      return next;
    });
    addToast(`Violation: ${reason}`, 'error');
  }, [onStrike, addToast]);

  // Audio Detection & Throttled Processing
  useEffect(() => {
    if (!isActive) return;

    let isSubscribed = true;

    const startAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isSubscribed) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        audioStreamRef.current = stream;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioCtx();
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const checkAudio = () => {
          if (!isSubscribed || !analyserRef.current) return;

          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;

          // Throttle state updates to ~10fps (every 100ms) to prevent 60fps React re-renders
          const now = Date.now();
          if (now - lastAudioUpdateRef.current > 100) {
            lastAudioUpdateRef.current = now;
            setAudioLevel(Math.round(average));
          }

          if (average > 45) { 
            violationBuffer.current.noise++;
            if (violationBuffer.current.noise > 15) {
              addStrike('Talking or loud noise detected');
              violationBuffer.current.noise = 0;
            }
          } else {
            violationBuffer.current.noise = Math.max(0, violationBuffer.current.noise - 1);
          }

          animFrameRef.current = requestAnimationFrame(checkAudio);
        };

        checkAudio();
      } catch (err) {
        console.warn("Audio monitoring initialization failed", err);
      }
    };

    startAudio();

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [isActive, addStrike]);

  // Vision Proctoring & Identity Match
  useEffect(() => {
    if (!isActive || !faceData) return;

    // 1. Check Identity Match
    if (faceData.detected && faceData.descriptor && storedDescriptor.current) {
      const distance = faceapi.euclideanDistance(storedDescriptor.current, faceData.descriptor);
      if (distance > 0.6) {
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

  // Browser Visibility & Focus Events
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
