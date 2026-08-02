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

const BlobScene = React.lazy(() => import('../components/3d/HeroScene'));

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  
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
    if (descriptor) {
      // Store in localStorage as requested for demo/fallback
      localStorage.setItem('faceDescriptor_' + formData.email, JSON.stringify(descriptor));
      
      // Also register with backend if available
      const result = await signup({
        ...formData,
        faceDescriptor: descriptor
      });

      if (result.success) {
        setEnrollmentSuccess(true);
        stopDetection();
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        addToast(`Welcome aboard, ${formData.name}!`, 'success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        addToast(result.message, 'error');
      }
    } else {
      addToast('Face not detected. Please look at the camera.', 'error');
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
            <p className="text-white/80 max-w-md font-body">Secure your academic journey with advanced AI proctoring and adaptive assessments.</p>
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
                    <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-24 md:h-28 w-auto object-contain mb-1" />
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
                      <div className="grid grid-cols-2 gap-4">
                        {['student', 'faculty'].map(role => (
                          <button 
                            key={role}
                            type="button"
                            onClick={() => setFormData({...formData, role})}
                            className={`py-2 rounded-xl border transition-all ${formData.role === role ? 'bg-primary text-white border-primary' : 'bg-white/50 text-textMuted border-muted'}`}
                          >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-primary text-white py-4 rounded-xl font-medium mt-6 hover:bg-accent flex items-center justify-center gap-2 group transition-all"
                    >
                      Next: Face Enrollment
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                  <p className="text-center mt-6 text-textMuted">
                    Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Log In</Link>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass p-8 rounded-3xl text-center flex flex-col items-center relative overflow-hidden"
                >
                  <ShieldCheck className="w-12 h-12 text-accent mb-2" />
                  <h2 className="text-3xl font-display font-bold text-primary mb-2">Face Enrollment</h2>
                  <p className="text-textMuted mb-8 text-sm">Step 2 of 2: Secure your identity</p>

                  <div className="mb-12">
                    <WebcamView 
                      videoRef={videoRef} 
                      canvasRef={canvasRef} 
                      isFaceDetected={isFaceDetected} 
                      onStart={async () => {
                        const ok = await startCamera(videoRef.current);
                        if (ok) startDetection();
                      }}
                      autoStart={true}
                    />
                  </div>

                  {faceError && (
                    <div className="mt-3 text-xs text-red-400 bg-red-900/10 rounded-lg px-4 py-2 mb-4 border border-red-500/20 flex items-center justify-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" /> {faceError}
                    </div>
                  )}

                  <div className="h-8 flex items-center justify-center mb-6">
                    {isModelsLoading && (
                      <div className="flex items-center gap-2 text-accent animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-widest">Loading AI Models...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => { stopDetection(); setStep(1); }}
                      className="flex-1 py-4 rounded-xl border border-muted bg-white/50 text-textPrimary hover:bg-white transition-colors font-semibold"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleCapture}
                      disabled={!isFaceDetected || enrollmentSuccess}
                      className={`flex-[2] py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        isFaceDetected
                          ? 'bg-primary text-white hover:bg-accent shadow-lg shadow-primary/20'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {enrollmentSuccess ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Enrolled
                        </>
                      ) : isFaceDetected ? (
                        'Capture & Enroll Face'
                      ) : (
                        'Position Face in Camera'
                      )}
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
