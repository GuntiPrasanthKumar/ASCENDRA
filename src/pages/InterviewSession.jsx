import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { PageSkeleton } from '../components/common/FeedbackStates';
import { mockInterviews } from '../features/interview/mock/interviews';
import { mockInterviewQuestions } from '../features/interview/mock/questions';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useProctor } from '../hooks/useProctor';
import { useToastStore } from '../components/common/Toast';

import InterviewHeader from '../components/interview/InterviewHeader';
import QuestionCard from '../components/interview/QuestionCard';
import CameraPreview from '../components/interview/CameraPreview';
import TranscriptPanel from '../components/interview/TranscriptPanel';
import Timer from '../components/interview/Timer';
import MicrophoneIndicator from '../components/interview/MicrophoneIndicator';

import { ShieldAlert, Video } from 'lucide-react';

export default function InterviewSession() {
  const { interviewId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [transcripts, setTranscripts] = useState({});

  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const { loadModels, startCamera, startDetection, stopCamera, faceData, error, isModelLoaded } = useFaceDetection();

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeInterview = mockInterviews.find(i => i.id === interviewId);
      const interviewQuestions = mockInterviewQuestions[interviewId] || [];

      if (activeInterview && interviewQuestions.length > 0) {
        setData({ activeInterview, interviewQuestions });
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [interviewId]);

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
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#131314] pt-8 pb-20 px-4 md:px-6">
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
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#131314] pt-8 pb-20 px-4 md:px-6 flex items-center justify-center">
          <div className="google-card max-w-md w-full p-8 text-center flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-[#D93025] mb-4" />
            <h2 className="text-xl font-display font-bold text-[#1F1F1F] dark:text-[#E3E3E3] mb-2">
              Rehearsal Session Not Found
            </h2>
            <p className="text-xs text-[#5F6368] dark:text-[#8E918F] mb-6 leading-relaxed">
              We could not find active questions for the requested interview.
            </p>
            <button onClick={() => navigate('/interview')} className="w-full py-3.5 rounded-full bg-[#1A73E8] text-white font-bold text-xs hover:bg-[#1557B0] transition-all">
              Return to Studio Hub
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
      const completed = JSON.parse(localStorage.getItem('completed_interviews') || '[]');
      if (!completed.includes(activeInterview.id)) {
        completed.push(activeInterview.id);
        localStorage.setItem('completed_interviews', JSON.stringify(completed));
      }

      addToast('Interview session completed successfully!', 'success');
      navigate(`/interview/${activeInterview.id}/results`);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] pb-20 w-full transition-colors duration-300">
        <div className="w-full space-y-6">
          
          <InterviewHeader
            title={activeInterview.title}
            category={activeInterview.category}
            onBack={() => {
              if (window.confirm('Abandon active interview session? Your progress will be lost.')) {
                navigate('/interview');
              }
            }}
          />

          {/* Google Meet Inspired Distraction-Free Studio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Camera Video Stream & Proctoring Indicator (Span 4) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <CameraPreview
                videoRef={videoRef}
                canvasRef={null}
                isFaceDetected={faceData.detected}
                error={error}
              />
              
              <div className="p-4 rounded-2xl google-card flex items-center justify-between">
                <MicrophoneIndicator
                  isActive={true}
                  volumeLevel={proctor ? proctor.audioLevel : 10}
                />
                <Timer durationMinutes={15} onTimeUp={handleNextOrFinish} />
              </div>
            </div>

            {/* Question Display & Live Speech Transcript (Span 8) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <QuestionCard
                question={question}
                index={currentIdx + 1}
                total={interviewQuestions.length}
              />

              <TranscriptPanel
                value={transcripts[currentIdx] || ''}
                onChange={handleTranscriptChange}
              />

              <div className="flex justify-end pt-4 border-t border-[#E3E3E3] dark:border-[#2E2F31]">
                <button
                  onClick={handleNextOrFinish}
                  className="px-8 py-3.5 rounded-full bg-[#1A73E8] dark:bg-[#A8C7FA] text-white dark:text-[#041E49] font-bold text-xs hover:bg-[#1557B0] transition-all shadow-xs"
                >
                  {currentIdx < interviewQuestions.length - 1 ? 'Next Question →' : 'Complete Interview & Evaluate'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
