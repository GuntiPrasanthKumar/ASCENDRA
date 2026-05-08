import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import WebcamView from '../components/auth/WebcamView';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useToastStore } from '../components/common/Toast';

const BlobScene = React.lazy(() => import('../components/3d/HeroScene'));

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [videoRef, setVideoRef] = useState(null);
  
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  
  const { isDetecting, faceData, startDetection, stopDetection } = useFaceDetection(videoRef);

  const handleVideoReady = useCallback((ref) => {
    setVideoRef(ref);
  }, []);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password) {
      setStep(2);
    } else {
      addToast('Please fill all fields', 'warning');
    }
  };

  const handleEnroll = () => {
    if (!isDetecting) {
      startDetection();
      addToast('Please look straight into the camera', 'info');
      return;
    }

    if (faceData.detected && !faceData.multiple) {
      stopDetection();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6C63FF', '#10B981', '#FF6584']
      });
      addToast('Face captured successfully ✓', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else if (faceData.multiple) {
      addToast('Multiple faces detected. Please ensure only you are in frame.', 'error');
    } else {
      addToast('Face not clearly detected. Move closer to the camera.', 'error');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[90vh] flex">
        {/* Left 3D side - hidden on mobile */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-primary rounded-r-[4rem]">
          <React.Suspense fallback={<div className="absolute inset-0 bg-primary" />}>
            <BlobScene />
          </React.Suspense>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent pointer-events-none" />
          <div className="absolute bottom-12 left-12 text-white">
            <h2 className="text-4xl font-display font-bold mb-4">Join the Future of Learning</h2>
            <p className="text-white/80 max-w-md font-body">Secure your academic journey with advanced AI proctoring and adaptive assessments.</p>
          </div>
        </div>

        {/* Right Form side */}
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
                  <h2 className="text-3xl font-display font-bold text-primary mb-2">Create Account</h2>
                  <p className="text-textMuted mb-8">Step 1 of 2: Basic Details</p>

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

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-primary ml-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-5 h-5" />
                        <input 
                          type="password" 
                          required
                          className="w-full bg-white/50 border border-muted rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-accent transition-colors"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="text-sm font-medium text-primary ml-1">Role</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, role: 'student'})}
                          className={`py-2 rounded-xl border ${formData.role === 'student' ? 'bg-primary text-white border-primary' : 'bg-white/50 text-textMuted border-muted'}`}
                        >
                          Student
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, role: 'faculty'})}
                          className={`py-2 rounded-xl border ${formData.role === 'faculty' ? 'bg-primary text-white border-primary' : 'bg-white/50 text-textMuted border-muted'}`}
                        >
                          Faculty
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-primary text-white py-4 rounded-xl font-medium mt-6 hover:bg-accent flex items-center justify-center gap-2 group transition-all"
                    >
                      Next Step
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
                  className="glass p-8 rounded-3xl text-center flex flex-col items-center"
                >
                  <ShieldCheck className="w-12 h-12 text-accent mb-4" />
                  <h2 className="text-3xl font-display font-bold text-primary mb-2">Face Enrollment</h2>
                  <p className="text-textMuted mb-8">Step 2 of 2: Secure your account</p>

                  <WebcamView 
                    onVideoReady={handleVideoReady} 
                    isScanning={isDetecting} 
                    faceStatus={faceData} 
                  />

                  <div className="h-12 mt-6 flex items-center justify-center text-sm font-medium">
                    {!isDetecting && <span className="text-textMuted">Click below to start scanning</span>}
                    {isDetecting && !faceData.detected && <span className="text-warning animate-pulse">Position your face in the circle...</span>}
                    {isDetecting && faceData.detected && !faceData.multiple && <span className="text-success">Face detected! Hold still...</span>}
                    {isDetecting && faceData.multiple && <span className="text-error">Multiple faces detected!</span>}
                  </div>

                  <div className="flex gap-4 w-full mt-4">
                    <button 
                      onClick={() => { stopDetection(); setStep(1); }}
                      className="flex-1 py-4 rounded-xl border border-muted bg-white/50 text-textPrimary hover:bg-white transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleEnroll}
                      className="flex-[2] bg-accent text-white py-4 rounded-xl font-medium hover:bg-primary transition-all flex items-center justify-center gap-2"
                    >
                      {isDetecting ? 'Capture & Finish' : 'Start Camera'}
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
