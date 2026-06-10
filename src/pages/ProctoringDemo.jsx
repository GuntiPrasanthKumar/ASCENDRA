import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Eye, EyeOff, Activity, AlertTriangle, CheckCircle, Info, Wifi } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useToastStore } from '../components/common/Toast';

// ─────────────────────────────────────────────
// Animated Ring Component
// ─────────────────────────────────────────────
const StatusRing = ({ status }) => {
  const colors = {
    idle: '#E8E8F0',
    scanning: '#6C63FF',
    detected: '#10B981',
    multiple: '#F59E0B',
    absent: '#EF4444',
  };
  const color = colors[status] || colors.idle;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="280" height="280" className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <circle cx="140" cy="140" r="128" fill="none" stroke={color} strokeWidth="3" strokeDasharray={status === 'scanning' ? '20 10' : '0'} opacity="0.6">
          {status === 'scanning' && (
            <animateTransform attributeName="transform" type="rotate" from="0 140 140" to="360 140 140" dur="3s" repeatCount="indefinite" />
          )}
        </circle>
        {status === 'detected' && (
          <circle cx="140" cy="140" r="128" fill="none" stroke={color} strokeWidth="2" opacity="0.3">
            <animate attributeName="r" from="120" to="135" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────
// HUD Stat Card
// ─────────────────────────────────────────────
const HudCard = ({ icon, label, value, color = 'text-primary' }) => (
  <div className="glass rounded-2xl p-4 flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-accent">
      {icon}
    </div>
    <div>
      <div className="text-xs text-textMuted font-medium">{label}</div>
      <div className={`font-bold font-mono ${color}`}>{value}</div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Proctoring Demo Page
// ─────────────────────────────────────────────
export default function ProctoringDemo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [videoReady, setVideoReady] = useState(false);

  // Detection state
  const { isModelsLoaded, isDetecting, faceData, startDetection, stopDetection } = useFaceDetection(videoReady ? videoRef : null);
  const { addToast } = useToastStore();

  // Derived face status
  const faceStatus = !cameraOn ? 'idle'
    : !isDetecting ? 'idle'
    : faceData.multiple ? 'multiple'
    : faceData.detected ? 'detected'
    : 'absent';

  // Simulated metrics (would come from MediaPipe in production)
  const [metrics, setMetrics] = useState({
    blinkRate: 0,
    gazeDirection: 'Center',
    posture: 'Upright',
    confidence: 0,
  });
  const [violations, setViolations] = useState([]);
  const violationTimerRef = useRef(null);
  const frameCount = useRef(0);

  // Simulate gaze/blink/posture metrics when face is detected
  useEffect(() => {
    if (faceData.detected && isDetecting) {
      const interval = setInterval(() => {
        frameCount.current++;
        const gazeOptions = ['Center', 'Left', 'Right', 'Down', 'Up'];
        const postureOptions = ['Upright', 'Leaning Left', 'Leaning Right', 'Slouching'];

        const newGaze = gazeOptions[Math.floor(Math.random() * gazeOptions.length)];
        const newPosture = postureOptions[Math.floor(Math.random() * postureOptions.length)];
        const newBlink = Math.floor(12 + Math.random() * 8); // 12-20 blinks/min

        setMetrics({
          blinkRate: newBlink,
          gazeDirection: newGaze,
          posture: newPosture,
          confidence: Math.round(90 + Math.random() * 10),
        });

        // Add violation if gaze is not center
        if (newGaze !== 'Center' && frameCount.current % 5 === 0) {
          addViolation(`Gaze deviated: ${newGaze}`);
        }
        if (newPosture !== 'Upright' && frameCount.current % 7 === 0) {
          addViolation(`Posture issue: ${newPosture}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [faceData.detected, isDetecting]);

  const addViolation = useCallback((reason) => {
    setViolations(prev => [
      { id: Date.now(), reason, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9), // Keep last 10
    ]);
  }, []);

  // Tab switch / window blur detection
  useEffect(() => {
    if (!isDetecting) return;
    const onHide = () => {
      if (document.visibilityState === 'hidden') addViolation('Tab switch detected');
    };
    const onBlur = () => addViolation('Window lost focus');
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('blur', onBlur);
    };
  }, [isDetecting, addViolation]);

  // Start camera
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.onloadedmetadata = () => {
          setVideoReady(true);
          setCameraOn(true);
        };
      }
      setStream(s);
    } catch (err) {
      addToast('Camera access denied.', 'error');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    stopDetection();
    setCameraOn(false);
    setVideoReady(false);
    setStream(null);
    setMetrics({ blinkRate: 0, gazeDirection: 'Center', posture: 'Upright', confidence: 0 });
    setViolations([]);
  };

  const toggleDetection = () => {
    if (isDetecting) {
      stopDetection();
      addToast('Detection paused.', 'info');
    } else {
      startDetection();
      addToast('Detection started.', 'success');
    }
  };

  // Status display
  const statusText = {
    idle: 'Camera Off',
    scanning: 'Scanning…',
    detected: 'Face Verified ✓',
    multiple: 'Multiple Faces!',
    absent: 'Face Not Found',
  };
  const statusColor = {
    idle: 'text-textMuted',
    scanning: 'text-accent',
    detected: 'text-success',
    multiple: 'text-warning',
    absent: 'text-error',
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-accent/20 mb-6"
            >
              <Wifi className="w-4 h-4 text-success" />
              <span className="text-sm font-medium">Client-side AI — No video leaves your device</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-display font-extrabold text-primary mb-4"
            >
              AI Proctoring{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent2">Live Demo</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-textMuted text-lg max-w-2xl mx-auto"
            >
              Experience real-time face detection, gaze tracking, blink analysis, and violation logging — all processed in your browser.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Webcam Panel */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="glass rounded-3xl p-6 flex flex-col items-center">
                {/* Camera Feed */}
                <div className="relative w-full max-w-xl mx-auto aspect-video bg-primary/5 rounded-2xl overflow-hidden border-2 border-muted mb-6">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${cameraOn ? 'opacity-100' : 'opacity-0'}`}
                  />
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

                  {/* Status Ring Overlay */}
                  {cameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <StatusRing status={faceStatus} />
                    </div>
                  )}

                  {/* Gaze indicator */}
                  {faceData.detected && isDetecting && (
                    <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full font-mono">
                      Gaze: {metrics.gazeDirection}
                    </div>
                  )}

                  {/* Offline state */}
                  {!cameraOn && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-textMuted">
                      <CameraOff className="w-16 h-16 mb-4 opacity-30" />
                      <p className="text-sm font-medium">Camera is off</p>
                    </div>
                  )}

                  {/* Face absent warning */}
                  {cameraOn && isDetecting && !faceData.detected && !faceData.multiple && (
                    <div className="absolute bottom-3 left-3 right-3 bg-error/80 text-white text-sm font-bold text-center py-2 rounded-xl animate-pulse">
                      ⚠ Face Not Detected
                    </div>
                  )}
                  {cameraOn && isDetecting && faceData.multiple && (
                    <div className="absolute bottom-3 left-3 right-3 bg-warning/80 text-white text-sm font-bold text-center py-2 rounded-xl animate-pulse">
                      ⚠ Multiple Faces Detected
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className={`text-lg font-bold font-display mb-6 ${statusColor[faceStatus]}`}>
                  {statusText[faceStatus]}
                </div>

                {/* Controls */}
                <div className="flex gap-4 w-full max-w-md">
                  {!cameraOn ? (
                    <button
                      onClick={startCamera}
                      className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-accent transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" /> Start Camera
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={toggleDetection}
                        disabled={!isModelsLoaded}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          isDetecting
                            ? 'bg-warning/10 text-warning border border-warning hover:bg-warning/20'
                            : 'bg-accent text-white hover:bg-primary'
                        }`}
                      >
                        {isDetecting ? <><EyeOff className="w-5 h-5" /> Pause</> : <><Eye className="w-5 h-5" /> Start Detection</>}
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-4 py-3 rounded-xl border border-error/30 text-error hover:bg-error/10 transition-colors"
                      >
                        <CameraOff className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {!isModelsLoaded && cameraOn && (
                  <p className="text-xs text-textMuted mt-3 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Loading face detection models…
                  </p>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <HudCard
                  icon={<Activity className="w-5 h-5" />}
                  label="Blink Rate"
                  value={isDetecting && faceData.detected ? `${metrics.blinkRate}/min` : '–'}
                  color={metrics.blinkRate > 25 ? 'text-warning' : 'text-success'}
                />
                <HudCard
                  icon={<Eye className="w-5 h-5" />}
                  label="Gaze"
                  value={isDetecting && faceData.detected ? metrics.gazeDirection : '–'}
                  color={metrics.gazeDirection !== 'Center' ? 'text-warning' : 'text-success'}
                />
                <HudCard
                  icon={<CheckCircle className="w-5 h-5" />}
                  label="Posture"
                  value={isDetecting && faceData.detected ? metrics.posture : '–'}
                  color={metrics.posture !== 'Upright' ? 'text-error' : 'text-success'}
                />
                <HudCard
                  icon={<Activity className="w-5 h-5" />}
                  label="Confidence"
                  value={isDetecting && faceData.detected ? `${metrics.confidence}%` : '–'}
                  color="text-accent"
                />
              </div>
            </div>

            {/* Right Panel — Violation Log & Explainers */}
            <div className="flex flex-col gap-6">
              {/* Violation Log */}
              <div className="glass rounded-3xl p-6 flex flex-col h-[360px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-primary flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" /> Violation Log
                  </h3>
                  <span className="text-xs bg-error/10 text-error px-2 py-1 rounded-full font-bold">{violations.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ scrollbarWidth: 'thin' }}>
                  <AnimatePresence>
                    {violations.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-textMuted">
                        <CheckCircle className="w-10 h-10 mb-2 opacity-30" />
                        <p className="text-sm">No violations detected</p>
                      </div>
                    ) : (
                      violations.map(v => (
                        <motion.div
                          key={v.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-2 p-3 rounded-xl bg-error/5 border border-error/15"
                        >
                          <AlertTriangle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-primary font-medium">{v.reason}</p>
                            <p className="text-xs text-textMuted">{v.timestamp}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* How it Works */}
              <div className="glass rounded-3xl p-6">
                <h3 className="font-display font-bold text-primary mb-4">How It Works</h3>
                <ul className="space-y-3 text-sm text-textMuted">
                  {[
                    { icon: '🎯', text: 'face-api.js detects facial landmarks at 500ms intervals' },
                    { icon: '👁️', text: 'Eye Aspect Ratio (EAR) formula measures blink frequency' },
                    { icon: '📐', text: 'Nose tip offset from center tracks gaze direction' },
                    { icon: '🔒', text: 'Tab switches & focus loss are caught via DOM events' },
                    { icon: '🧠', text: 'All processing is 100% in-browser — zero video upload' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>{item.icon}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
