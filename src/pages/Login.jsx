import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Fingerprint, LogIn } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import WebcamView from '../components/auth/WebcamView';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useToastStore } from '../components/common/Toast';

export default function Login() {
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'face'
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [videoRef, setVideoRef] = useState(null);
  
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  
  const { isDetecting, faceData, startDetection, stopDetection } = useFaceDetection(videoRef);

  const handleVideoReady = useCallback((ref) => {
    setVideoRef(ref);
  }, []);

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      addToast('Login successful', 'success');
      navigate('/dashboard');
    } else {
      addToast('Invalid credentials', 'error');
    }
  };

  const handleFaceLogin = () => {
    if (!isDetecting) {
      startDetection();
      addToast('Looking for face match...', 'info');
      return;
    }

    if (faceData.detected && !faceData.multiple) {
      // Simulate checking liveness (blink) and match
      stopDetection();
      addToast('Face matched successfully! Logging in...', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      addToast('Face not recognized or multiple faces found.', 'error');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center p-6 relative">
        {/* Background Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent2/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-3xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-primary mb-2">Welcome Back</h2>
              <p className="text-textMuted">Log in to continue your learning journey</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-white/50 rounded-xl p-1 mb-8 border border-muted">
              <button
                onClick={() => { setLoginMode('password'); stopDetection(); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${loginMode === 'password' ? 'bg-primary text-white shadow-md' : 'text-textMuted hover:text-textPrimary'}`}
              >
                Password
              </button>
              <button
                onClick={() => setLoginMode('face')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${loginMode === 'face' ? 'bg-primary text-white shadow-md' : 'text-textMuted hover:text-textPrimary'}`}
              >
                Face Login
              </button>
            </div>

            <AnimatePresence mode="wait">
              {loginMode === 'password' ? (
                <motion.form
                  key="password-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handlePasswordLogin}
                  className="space-y-4"
                >
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

                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-accent hover:underline">Forgot password?</a>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-xl font-medium mt-4 hover:bg-accent flex items-center justify-center gap-2 group transition-all"
                  >
                    Log In
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="face-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col items-center"
                >
                  <WebcamView 
                    onVideoReady={handleVideoReady} 
                    isScanning={isDetecting} 
                    faceStatus={faceData} 
                  />

                  <div className="h-12 mt-6 flex flex-col items-center justify-center text-sm font-medium">
                    {!isDetecting && <span className="text-textMuted">Click below to start verification</span>}
                    {isDetecting && !faceData.detected && <span className="text-warning animate-pulse">Looking for your face...</span>}
                    {isDetecting && faceData.detected && <span className="text-success">Blink once to verify liveness</span>}
                  </div>

                  <button 
                    onClick={handleFaceLogin}
                    className="w-full mt-4 bg-accent text-white py-4 rounded-xl font-medium hover:bg-primary transition-all flex items-center justify-center gap-2"
                  >
                    <Fingerprint className="w-5 h-5" />
                    {isDetecting ? 'Verify Identity' : 'Start Camera'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center mt-8 text-textMuted">
              New to SkillTrove? <Link to="/signup" className="text-accent font-medium hover:underline">Create Account</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
