import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Fingerprint, Loader2, CheckCircle2, ShieldAlert, KeyRound, Sparkles } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import WebcamView from '../components/auth/WebcamView';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useToastStore } from '../components/common/Toast';
import { useAuthStore } from '../hooks/useAuthStore';

export default function Login() {
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'face'
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
    startCamera,
    startDetection, 
    stopDetection
  } = useFaceDetection();

  const videoRef = useRef(null);
  const isFaceDetected = faceData.detected;

  // Standard Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password.', 'warning');
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    const result = await login({ email, password });
    setIsLoading(false);

    if (result.success) {
      setLoginSuccess(true);
      addToast('Login successful! Entering Academy...', 'success');
      setTimeout(() => navigate('/dashboard'), 1200);
    } else {
      setLoginError(result.message || 'Invalid email or password.');
    }
  };

  // Face Biometric Login
  const handleFaceVerify = async () => {
    if (!email) {
      addToast('Please enter your registered email first.', 'warning');
      return;
    }

    if (!faceData.descriptor || !Array.isArray(faceData.descriptor) || faceData.descriptor.length !== 512) {
      setLoginError('No valid MediaPipe face embedding detected. Position your face clearly in the camera frame.');
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    const result = await faceLogin(email, faceData.descriptor);
    setIsLoading(false);

    if (result.success) {
      setLoginSuccess(true);
      stopDetection();
      addToast('Face matched! Access Granted.', 'success');
      setTimeout(() => navigate('/dashboard'), 1200);
    } else {
      setLoginError(result.message || 'Face identity mismatch. Try password login.');
    }
  };

  // Quick Demo Access Handler
  const handleDemoLogin = async (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setIsLoading(true);

    const result = await login({ email: demoEmail, password: 'password123' });
    setIsLoading(false);

    if (result.success) {
      setLoginSuccess(true);
      addToast(`Logged in as Demo ${demoRole}!`, 'success');
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      // Fallback local auth mock if backend unreachable
      addToast(`Logging in as Demo ${demoRole}...`, 'info');
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[85vh] flex items-center justify-center p-6 relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

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
                  className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
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
                   <p className="text-textMuted font-medium text-xs">Entering ASCENDRA Enterprise Platform...</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mb-6 flex flex-col items-center">
              <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-20 md:h-28 w-auto object-contain mb-2" />
              <p className="text-textMuted text-xs font-medium">Enterprise AI Learning &amp; Proctoring Platform</p>
            </div>

            {/* Login Mode Selector Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => { setLoginMode('password'); setLoginError(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  loginMode === 'password' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" /> Password
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('face'); setLoginError(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  loginMode === 'face' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" /> Face Biometrics
              </button>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-center text-xs flex items-center gap-2 mb-4 w-full">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Password Login Form */}
            {loginMode === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary ml-1 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-5 h-5" />
                    <input 
                      type="email" 
                      required
                      className="w-full bg-white/50 border border-muted rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-accent text-xs font-semibold"
                      placeholder="vijay@ascendra.io"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
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
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                    </>
                  ) : (
                    'Log In'
                  )}
                </button>
              </form>
            )}

            {/* Face Biometric Login Form */}
            {loginMode === 'face' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary ml-1 uppercase tracking-wider">Enrolled Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-5 h-5" />
                    <input 
                      type="email" 
                      required
                      className="w-full bg-white/50 border border-muted rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-accent text-xs font-semibold"
                      placeholder="Enter enrolled email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

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

                <button
                  type="button"
                  onClick={handleFaceVerify}
                  disabled={isLoading || !isFaceDetected || !email}
                  className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying Biometrics...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" /> Verify Face &amp; Login
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Quick Demo Access Bar */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">Quick Demo Accounts</span>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('student@ascendra.io', 'Student')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors text-center"
                >
                  Student Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('teacher@ascendra.io', 'Faculty')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors text-center"
                >
                  Faculty Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@ascendra.io', 'Admin')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors text-center"
                >
                  Admin Demo
                </button>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-textMuted font-medium">
              Don't have an account yet? <Link to="/signup" className="text-accent font-bold">Sign up here</Link>
            </div>

          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
