import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockInterviews } from '../features/interview/mock/interviews';
import { mockInterviewQuestions } from '../features/interview/mock/questions';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useProctor } from '../hooks/useProctor';
import { useToastStore } from '../components/common/Toast';

// Reusable Components
import InterviewHeader from '../components/interview/InterviewHeader';
import QuestionCard from '../components/interview/QuestionCard';
import CameraPreview from '../components/interview/CameraPreview';
import TranscriptPanel from '../components/interview/TranscriptPanel';
import Timer from '../components/interview/Timer';
import ProgressIndicator from '../components/interview/ProgressIndicator';
import MicrophoneIndicator from '../components/interview/MicrophoneIndicator';

// Icons
import { ShieldAlert, Video } from 'lucide-react';

export default function InterviewSession() {
  const { interviewId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehearsal Session States
  const [currentIdx, setCurrentIdx] = useState(0);
  const [transcripts, setTranscripts] = useState({});

  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const { loadModels, startCamera, startDetection, stopCamera, faceData, error, isModelLoaded } = useFaceDetection();

  // Load Interview details
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeInterview = mockInterviews.find(i => i.id === interviewId);
      const interviewQuestions = mockInterviewQuestions[interviewId] || [];

      if (activeInterview && interviewQuestions.length > 0) {
        setData({ activeInterview, interviewQuestions });
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [interviewId]);

  // Load faceAPI and start webcam stream
  useEffect(() => {
    if (isLoading || !data) return;

    const startSession = async () => {
      await loadModels();
    };
    startSession();
  }, [isLoading, data, loadModels]);

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

  // Hook up Proctor verification strikes proctor check
  const handleStrike = (strikeCount, reason) => {
    addToast(`Strike ${strikeCount}/3: ${reason}`, 'warning');
    if (strikeCount >= 3) {
      addToast('Session terminated due to multiple proctoring strikes.', 'error');
      navigate('/interview');
    }
  };

  const proctor = useProctor(!!data, faceData, handleStrike);

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
            <h2 className="text-xl font-bold text-primary mb-2">Rehearsal Session Not Found</h2>
            <p className="text-xs text-textMuted mb-6 leading-relaxed">
              We could not find active questions for the requested interview.
            </p>
            <button onClick={() => navigate('/interview')} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all">
              Return to Hub
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { activeInterview, interviewQuestions } = data;
  const question = interviewQuestions[currentIdx];

  const handleTranscriptChange = (text) => {
    setTranscripts(prev => ({ ...prev, [currentIdx]: text }));
  };

  const handleNextOrFinish = () => {
    if (!transcripts[currentIdx]) {
      addToast('Please provide an answer before navigating.', 'warning');
      return;
    }

    if (currentIdx < interviewQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      addToast('Session completed successfully!', 'success');
      navigate(`/interview/${activeInterview.id}/results`);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-8 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <InterviewHeader
            title={activeInterview.title}
            category={activeInterview.category}
            onBack={() => {
              if (window.confirm('Abandon active interview session? Your progress will be lost.')) {
                navigate('/interview');
              }
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Questions and Transcript Panel (span 2) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <QuestionCard
                question={question}
                index={currentIdx + 1}
                total={interviewQuestions.length}
              />

              <TranscriptPanel
                value={transcripts[currentIdx] || ''}
                onChange={handleTranscriptChange}
              />

              <div className="flex justify-between items-center w-full pt-4 border-t border-slate-100">
                <MicrophoneIndicator
                  isActive={true}
                  volumeLevel={proctor ? proctor.audioLevel : 10}
                />

                <button
                  onClick={handleNextOrFinish}
                  className="px-6 py-3.5 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-accent transition-all shadow-lg shadow-primary/15"
                >
                  {currentIdx < interviewQuestions.length - 1 ? 'Next Question' : 'Finish Interview'}
                </button>
              </div>
            </div>

            {/* Right Column: Camera proctoring and diagnostics (span 1) */}
            <div className="flex flex-col gap-6">
              <CameraPreview
                videoRef={videoRef}
                canvasRef={null}
                isFaceDetected={faceData.detected}
                error={error}
              />

              <div className="glass p-5 rounded-3xl border border-slate-200/50 flex justify-between items-center select-none">
                <ProgressIndicator
                  current={Object.keys(transcripts).length}
                  total={interviewQuestions.length}
                />
                <Timer durationMinutes={15} onTimeUp={handleNextOrFinish} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
