import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Fingerprint, LogIn, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import WebcamView from '../components/auth/WebcamView';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useToastStore } from '../components/common/Toast';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'face'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { login, faceLogin } = useAuthStore();
  
  const { 
    canvasRef, 
    faceData, 
    isModelLoaded,
    startCamera,
    startDetection, 
    stopDetection, 
    error: faceApiError
  } = useFaceDetection();

  const videoRef = useRef(null);
  const isFaceDetected = faceData.detected;

  // Reset errors when switching modes
  useEffect(() => {
    setLoginError(null);
    if (loginMode === 'password') {
      stopDetection();
    }
  }, [loginMode, stopDetection]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login({ email, password });
    setIsLoading(false);

    if (result.success) {
      addToast('Login successful! Welcome back 👋', 'success');
      navigate('/dashboard');
    } else {
      addToast(result.message, 'error');
    }
  };

  const handleFaceVerify = async () => {
    if (!email) {
      addToast('Please enter your email first to verify face.', 'warning');
      return;
    }

    if (!faceData.descriptor) {
      setLoginError('No face detected. Please look at the camera.');
      return;
    }

    const storedStr = localStorage.getItem('faceDescriptor_' + email);
    
    if (!storedStr) {
      setLoginError('No face enrolled for this email. Please sign up first.');
      return;
    }

    const stored = JSON.parse(storedStr);
    const current = faceData.descriptor;
    
    // Calculate distance using faceapi (imported globally or via useFaceDetection)
    const distance = faceapi.euclideanDistance(stored, current);
    const isMatch = distance < 0.65; // Relaxed slightly for better user experience

    if (isMatch) {
      setIsLoading(true);
      const result = await faceLogin(email, current);
      setIsLoading(false);

      if (result.success) {
        setLoginSuccess(true);
        stopDetection();
        addToast('Face matched! Access Granted.', 'success');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setLoginError(result.message);
      }
    } else {
      setLoginError('Face not recognized. Please position your face clearly.');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center p-6 relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent2/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[2.5rem] shadow-2xl border border-muted overflow-hidden relative"
          >
            {/* Success Overlay */}
            <AnimatePresence>
              {loginSuccess && (
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
                   <h2 className="text-2xl font-display font-black text-primary">Access Granted</h2>
                   <p className="text-textMuted font-medium">Identity verified. Entering Academy...</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-primary mb-2">Welcome Back</h2>
              <p className="text-textMuted">Log in to continue your journey</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-4 w-full">
                <label className="text-xs font-bold text-primary ml-1 uppercase tracking-widest mb-2 block">Confirm Email First</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-5 h-5 group-focus-within:text-accent transition-colors" />
                  <input 
                    type="email" 
                    required
                    className="w-full bg-white/50 border border-muted rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent transition-all text-center"
                    placeholder="Enter enrolled email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-8">
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

              {(faceApiError || loginError) && (
                <div className="w-full mb-6 text-xs text-red-500 bg-red-500/10 rounded-xl px-4 py-3 border border-red-500/20 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{faceApiError || loginError}</span>
                </div>
              )}

              <button 
                onClick={handleFaceVerify}
                disabled={!isFaceDetected || isLoading}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  isFaceDetected
                    ? 'bg-primary text-white hover:bg-accent shadow-primary/20'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isFaceDetected ? (
                  <>
                    <Fingerprint className="w-5 h-5" />
                    Verify My Face
                  </>
                ) : (
                  'Position Face in Camera'
                )}
              </button>
            </div>

            <p className="text-center mt-8 text-textMuted text-sm font-medium">
              New to SkillTrove? <Link to="/signup" className="text-accent font-bold hover:underline">Create Account</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
