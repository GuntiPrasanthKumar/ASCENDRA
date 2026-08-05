import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Fingerprint, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import WebcamView from '../components/auth/WebcamView';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useToastStore } from '../components/common/Toast';
import { useAuthStore } from '../hooks/useAuthStore';

// Cosine similarity for Float32Array MediaPipe embeddings
function computeCosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { faceLogin } = useAuthStore();
  
  const { 
    canvasRef, 
    faceData, 
    startCamera,
    startDetection, 
    stopDetection, 
    error: faceApiError
  } = useFaceDetection();

  const videoRef = useRef(null);
  const isFaceDetected = faceData.detected;

  const handleFaceVerify = async () => {
    if (!email) {
      addToast('Please enter your email first to verify face.', 'warning');
      return;
    }

    if (!faceData.descriptor || !Array.isArray(faceData.descriptor) || faceData.descriptor.length !== 512) {
      setLoginError('No valid MediaPipe face embedding detected. Please position your face clearly in the camera frame.');
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    const current = faceData.descriptor;
    const result = await faceLogin(email, current);
    setIsLoading(false);

    if (result.success) {
      setLoginSuccess(true);
      stopDetection();
      addToast('Face matched! Access Granted.', 'success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setLoginError(result.message || 'Face identity mismatch. Please try again.');
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
                   <p className="text-textMuted font-medium">Identity verified via MediaPipe AI. Entering Academy...</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mb-6 flex flex-col items-center">
              <img src="/ascendra-logo.png" alt="ASCENDRA" className="h-20 md:h-28 w-auto object-contain mb-2" />
              <p className="text-textMuted text-xs font-medium">AI-powered learning and career platform</p>
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
                  onStop={stopDetection}
                />
              </div>

              {loginError && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-center text-xs flex items-center gap-2 mb-6 w-full">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                onClick={handleFaceVerify}
                disabled={isLoading || !isFaceDetected || !email}
                className="w-full py-4 rounded-2xl bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Verifying Biometrics...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5" /> Verify Face & Login
                  </>
                )}
              </button>

              <div className="mt-6 text-center text-xs text-textMuted font-medium">
                Don't have an account yet? <Link to="/signup" className="text-accent font-bold">Sign up here</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
