import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Mail, User, Lock, ArrowRight, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import WebcamView from '../components/auth/WebcamView';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useToastStore } from '../components/common/Toast';
import { useAuthStore } from '../hooks/useAuthStore';
import api from '../utils/api';

const BlobScene = React.lazy(() => import('../components/3d/HeroScene'));

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Student' });
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

  // Direct Standard Registration without requiring Webcam
  const handleStandardSignup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      addToast('Please enter your Name, Email, and Password.', 'warning');
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    setIsSubmitting(false);

    if (result.success) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      addToast(`Welcome to ASCENDRA, ${formData.name}!`, 'success');
      navigate('/dashboard');
    } else {
      addToast(result.message, 'error');
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password) {
      setStep(2);
    } else {
      addToast('Please fill all fields including password', 'warning');
    }
  };

  const handleCaptureBiometric = async () => {
    const descriptor = faceData.descriptor;
    if (descriptor && Array.isArray(descriptor) && descriptor.length === 512) {
      setIsSubmitting(true);
      
      const result = await signup({
        ...formData,
        faceDescriptor: descriptor
      });

      if (result.success) {
        try {
          await api.post('/proctor/enroll', {
            embedding: descriptor,
            modelVersion: 'mediapipe-face-embedder-v1'
          });
        } catch (enrollErr) {
          console.warn('Server face enrollment warning:', enrollErr);
        }

        setEnrollmentSuccess(true);
        stopDetection();
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        addToast(`Welcome aboard, ${formData.name}! Biometric profile enrolled.`, 'success');
        setTimeout(() => navigate('/dashboard'), 1800);
      } else {
        addToast(result.message, 'error');
      }
      setIsSubmitting(false);
    } else {
      addToast('Face not detected or embedding invalid. Please center your face in camera.', 'error');
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
            <p className="text-white/80 max-w-md font-body">Secure your academic journey with advanced AI proctoring, CodeLab, and career intelligence.</p>
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
                    <p className="text-textMuted text-xs font-medium mt-1">Create your ASCENDRA Enterprise account</p>
                  </div>

                  <form onSubmit={handleStandardSignup} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary ml-1 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-5 h-5" />
                        <input 
                          type="text" 
                          required
                          className="w-full bg-white/50 border border-muted rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-accent text-xs font-semibold"
                          placeholder="Vijay Kiran"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary ml-1 uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-5 h-5" />
                        <input 
                          type="email" 
                          required
                          className="w-full bg-white/50 border border-muted rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-accent text-xs font-semibold"
                          placeholder="vijay@ascendra.io"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-primary ml-1 uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-5 h-5" />
                        <input 
                          type="password" 
                          required
                          className="w-full bg-white/50 border border-muted rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-accent text-xs font-semibold"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="text-xs font-bold text-primary ml-1 uppercase tracking-wider">Role</label>
                      <select 
                        className="w-full bg-white/50 border border-muted rounded-xl py-3 px-4 focus:outline-none focus:border-accent text-xs font-semibold"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                      >
                        <option value="Student">Student</option>
                        <option value="Faculty">Faculty</option>
                      </select>
                    </div>

                    <div className="pt-4 space-y-2">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg text-xs"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <button 
                        type="button"
                        onClick={handleNextStep}
                        className="w-full bg-indigo-50 text-indigo-700 border border-indigo-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors text-xs"
                      >
                        <Sparkles className="w-4 h-4" /> Enroll Face Biometrics (Optional)
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 text-center text-xs text-textMuted font-medium">
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
                    <p className="text-textMuted text-xs font-medium">Capture baseline face embedding for AI proctoring</p>
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
                      onClick={handleCaptureBiometric}
                      disabled={!isFaceDetected || isModelsLoading || isSubmitting}
                      className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-xs shadow-accent/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Enrolling Encrypted Profile...
                        </>
                      ) : isModelsLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Initializing MediaPipe AI...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" /> Enroll &amp; Finish Registration
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => {
                        stopDetection();
                        setStep(1);
                      }}
                      className="w-full py-2.5 text-xs text-textMuted font-bold hover:text-primary transition-colors text-center"
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
