import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockInterviews } from '../features/interview/mock/interviews';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useToastStore } from '../components/common/Toast';

// Reusable Components
import InterviewHeader from '../components/interview/InterviewHeader';
import InterviewSetupCard from '../components/interview/InterviewSetupCard';
import CameraPreview from '../components/interview/CameraPreview';

// Icons
import { ShieldAlert, Video } from 'lucide-react';

export default function InterviewSetup() {
  const { interviewId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verification status details
  const [micStatus, setMicStatus] = useState('Checking...');
  const [faceStatus, setFaceStatus] = useState('Scanning...');

  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const { loadModels, startCamera, startDetection, stopCamera, faceData, error, isModelLoaded } = useFaceDetection();

  // Load Interview Info
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeInterview = mockInterviews.find(i => i.id === interviewId);
      if (activeInterview) {
        setData({ activeInterview });
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [interviewId]);

  // Load face-api AI models and start camera stream
  useEffect(() => {
    if (isLoading || !data) return;

    const setupDiagnostic = async () => {
      // 1. Mic check simulation
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (stream) setMicStatus('Active');
      } catch (e) {
        setMicStatus('Permission Denied');
      }

      // 2. Load face detector
      await loadModels();
    };

    setupDiagnostic();
  }, [isLoading, data, loadModels]);

  // Handle start camera when elements render
  useEffect(() => {
    if (isModelLoaded && videoRef.current) {
      startCamera(videoRef.current).then(success => {
        if (success) {
          startDetection();
        }
      });
    }
    return () => {
      if (typeof stopCamera === 'function') {
        stopCamera();
      }
    };
  }, [isModelLoaded, startCamera, startDetection, stopCamera]);

  // Monitor face recognition match verification
  useEffect(() => {
    if (faceData.detected) {
      setFaceStatus('Match Verified ✓');
    } else {
      setFaceStatus('Scanning...');
    }
  }, [faceData]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <PageSkeleton />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!data) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="glass max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/50 text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-error mb-4" />
            <h2 className="text-xl font-bold text-primary mb-2">Rehearsal Setup Not Found</h2>
            <p className="text-xs text-textMuted mb-6 leading-relaxed">
              We could not find details for the requested interview setup.
            </p>
            <button onClick={() => navigate('/interview')} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all">
              Return to Hub
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { activeInterview } = data;

  const handleStartInterview = () => {
    if (faceStatus !== 'Match Verified ✓') {
      addToast('Face match recognition verify checkpoint is pending.', 'warning');
      return;
    }
    addToast('Camera diagnostic complete. Initializing interview session!', 'success');
    navigate(`/interview/${activeInterview.id}/session`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <InterviewHeader
            title={activeInterview.title}
            category={activeInterview.category}
            onBack={() => navigate('/interview')}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Proctoring Camera View */}
            <div className="flex flex-col gap-6">
              <CameraPreview
                videoRef={videoRef}
                canvasRef={null}
                isFaceDetected={faceData.detected}
                error={error}
              />

              <button
                onClick={handleStartInterview}
                className="w-full py-4 rounded-2xl bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10"
              >
                <Video className="w-4.5 h-4.5" /> Start Placement Interview Rehearsal
              </button>
            </div>

            {/* Right Column: Setup verification checklists */}
            <div className="flex flex-col gap-6">
              <InterviewSetupCard
                camStatus={isModelLoaded ? 'Active' : 'Initializing...'}
                micStatus={micStatus}
                faceStatus={faceStatus}
              />

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-205 text-[10px] text-textMuted leading-relaxed">
                <span className="font-extrabold block text-slate-700 uppercase tracking-widest text-[8px] mb-1">PROCTORING GUIDELINES:</span>
                Gaze stability tracker checks, noise monitors, and multi-face recognition are active throughout the interview. Strikes are automatically logged upon violations.
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
