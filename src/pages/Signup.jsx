import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Mail, User, ArrowRight, ShieldCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import WebcamView from '../components/auth/WebcamView';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useToastStore } from '../components/common/Toast';
import { useAuthStore } from '../hooks/useAuthStore';
import api from '../utils/api';

const BlobScene = React.lazy(() => import('../components/3d/HeroScene'));

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { signup } = useAuthStore();
  
  const { 
    canvasRef, 
    faceData, 
    isModelLoaded,
    startCamera,
    startDetection, 
    stopDetection, 
    error: faceError
  } = useFaceDetection();

  const videoRef = useRef(null);
  const isFaceDetected = faceData.detected;
  const isModelsLoading = !isModelLoaded;

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setStep(2);
    } else {
      addToast('Please fill all fields', 'warning');
    }
  };

  const handleCapture = async () => {
    const descriptor = faceData.descriptor;
    if (descriptor && Array.isArray(descriptor) && descriptor.length === 512) {
      setIsSubmitting(true);
      
      // Register user with backend
      const result = await signup({
        ...formData,
        faceDescriptor: descriptor
      });

      if (result.success) {
        // Enrol encrypted face profile in backend /api/proctor/enroll
        try {
          await api.post('/proctor/enroll', {
            embedding: descriptor,
            modelVersion: 'mediapipe-face-embedder-v1'
          });
          console.log('[BIOMETRIC LOG] Encrypted FaceProfile enrolled on server.');
        } catch (enrollErr) {
          console.warn('Server face enrollment warning:', enrollErr?.response?.data || enrollErr.message);
        }

        setEnrollmentSuccess(true);
        stopDetection();
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        addToast(`Welcome aboard, ${formData.name}! Encrypted biometric profile enrolled.`, 'success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        addToast(result.message, 'error');
      }
      setIsSubmitting(false);
    } else {
      addToast('Face not detected or embedding invalid. Please center your face.', 'error');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[90vh] flex flex-col lg:flex-row">
        {/* Left Side */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-primary rounded-r-[4rem]">
          <React.Suspense fallback={<div className="absolute inset-0 bg-primary" />}>
            <BlobScene />
          </React.Suspense>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-transparent pointer-events-none" />
          <div className="absolute bottom-12 left-12 text-white">
            <h2 className="text-4xl font-display font-bold mb-4">Join the Future of Learning</h2>
            <p className="text-white/80 max-w-md font-body">Secure your academic journey with advanced MediaPipe AI proctoring and continuous biometric identity verification.</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass p-8 rounded-3xl"
                >
                  <div className="text-center mb-6 flex flex-col items-center">
                    <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-20 md:h-28 w-auto object-contain mb-1" />
                    <p className="text-textMuted text-xs font-medium mt-1">Step 1 of 2: Account Registration</p>
                  </div>

                  <form onSubmit={handleNextStep} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-primary ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-5 h-5" />
                        <input 
                          type="text" 
                          required
                          className="w-full bg-white/50 border border-muted rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-accent transition-colors"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-primary ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-5 h-5" />
                        <input 
                          type="email" 
                          required
                          className="w-full bg-white/50 border border-muted rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-accent transition-colors"
                          placeholder="john@university.edu"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="text-sm font-medium text-primary ml-1">Role</label>
                      <select 
                        className="w-full bg-white/50 border border-muted rounded-xl py-3 px-4 focus:outline-none focus:border-accent transition-colors"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg mt-6"
                    >
                      Next: Biometric Enrollment <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>

                  <div className="mt-6 text-center text-sm text-textMuted">
                    Already have an account? <Link to="/login" className="text-accent font-bold">Log in</Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass p-8 rounded-3xl relative overflow-hidden"
                >
                  <AnimatePresence>
                    {enrollmentSuccess && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
                      >
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="w-20 h-20 bg-success rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-success/20"
                        >
                          <CheckCircle2 className="w-10 h-10" />
                        </motion.div>
                        <h2 className="text-2xl font-display font-black text-primary mb-1">Face Profile Enrolled</h2>
                        <p className="text-textMuted text-xs font-medium">AES-256 Encrypted Biometric Template Created.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-display font-bold text-primary">Biometric Face Enrollment</h2>
                    <p className="text-textMuted text-xs font-medium">Step 2 of 2: Capture baseline 512-D face embedding</p>
                  </div>

                  {faceError ? (
                    <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-center text-xs flex items-center gap-2 mb-6">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{faceError}</span>
                    </div>
                  ) : null}

                  <WebcamView 
                    videoRef={videoRef} 
                    canvasRef={canvasRef} 
                    isFaceDetected={isFaceDetected} 
                    onStart={async () => {
                      const ok = await startCamera(videoRef.current);
                      if (ok) startDetection();
                    }}
                    onStop={stopDetection}
                  />

                  <div className="mt-6 flex flex-col gap-3">
                    <button 
                      onClick={handleCapture}
                      disabled={!isFaceDetected || isModelsLoading || isSubmitting}
                      className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Enrolling Encrypted Profile...
                        </>
                      ) : isModelsLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Initializing MediaPipe AI...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5" /> Enroll & Finish Signup
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => {
                        stopDetection();
                        setStep(1);
                      }}
                      className="w-full py-3 text-xs text-textMuted font-bold hover:text-primary transition-colors text-center"
                    >
                      Back to Step 1
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
