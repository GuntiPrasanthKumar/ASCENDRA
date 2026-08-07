import { useEffect, useRef, useCallback, useState } from 'react';
import { useToastStore } from '../components/common/Toast';
import { IdentityEngine } from '../services/proctor/IdentityEngine';
import { BehaviorEngine } from '../services/proctor/BehaviorEngine';
import { EnvironmentEngine } from '../services/proctor/EnvironmentEngine';
import { IntegrityEngine } from '../services/proctor/IntegrityEngine';

export const useEnterpriseProctor = (isActive, faceData, videoRef, onStrike, sessionId = 'session-default') => {
  const { addToast } = useToastStore();
  const [strikes, setStrikes] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [evidenceLog, setEvidenceLog] = useState([]);
  const [report, setReport] = useState(null);

  const identityEngineRef = useRef(new IdentityEngine(sessionId));
  const behaviorEngineRef = useRef(new BehaviorEngine(sessionId));
  const environmentEngineRef = useRef(new EnvironmentEngine(sessionId));
  const integrityEngineRef = useRef(new IntegrityEngine(sessionId));
  const lastStrikeTime = useRef(0);
  const COOLDOWN = 4000;

  // Synchronize Session ID across engines
  useEffect(() => {
    identityEngineRef.current.setSessionId(sessionId);
    behaviorEngineRef.current.sessionId = sessionId;
    environmentEngineRef.current.sessionId = sessionId;
    integrityEngineRef.current.setSessionId(sessionId);
  }, [sessionId]);

  const handleViolation = useCallback((violation) => {
    const evidence = integrityEngineRef.current.addEvidence(violation);
    setEvidenceLog([...integrityEngineRef.current.evidenceLog]);

    const newScore = integrityEngineRef.current.calculateIntegrityScore();
    setIntegrityScore(newScore);

    const now = Date.now();
    if (now - lastStrikeTime.current >= COOLDOWN) {
      lastStrikeTime.current = now;
      setStrikes(prev => {
        const next = prev + 1;
        if (typeof onStrike === 'function') {
          onStrike(next, violation.violationType || 'Proctoring violation');
        }
        return next;
      });
      addToast(`Violation (${violation.engine}): ${violation.violationType.replace(/_/g, ' ')}`, 'warning');
    }
  }, [onStrike, addToast]);

  // 1. Behavior Audio & Object Detector Init
  useEffect(() => {
    if (!isActive) return;

    const behaviorEngine = behaviorEngineRef.current;
    behaviorEngine.initObjectDetector();
    behaviorEngine.startAudioMonitoring((violation) => {
      handleViolation(violation);
    });

    const audioInterval = setInterval(() => {
      setAudioLevel(behaviorEngine.audioLevel);
    }, 150);

    return () => {
      clearInterval(audioInterval);
      behaviorEngine.stopAudioMonitoring();
    };
  }, [isActive, handleViolation]);

  // 2. Environment Monitoring
  useEffect(() => {
    if (!isActive) return;

    const environmentEngine = environmentEngineRef.current;
    environmentEngine.startMonitoring((violation) => {
      handleViolation(violation);
    });

    return () => {
      environmentEngine.stopMonitoring();
    };
  }, [isActive, handleViolation]);

  // 3. Vision Frame Evaluation (Identity + Behavior)
  useEffect(() => {
    if (!isActive || !faceData) return;

    // Identity Engine Continuous Verification
    identityEngineRef.current.verifyContinuous(faceData, (violation) => {
      handleViolation(violation);
    });

    // Behavior Engine Frame Evaluation
    const videoEl = videoRef?.current;
    behaviorEngineRef.current.evaluateBehaviorFrame(faceData, videoEl, (violation) => {
      handleViolation(violation);
    });
  }, [isActive, faceData, videoRef, handleViolation]);

  // Generate Final Report
  const generateReport = useCallback(async (meta = {}) => {
    const finalReport = await integrityEngineRef.current.generateFinalReport({
      strikes,
      ...meta
    });
    setReport(finalReport);
    return finalReport;
  }, [strikes]);

  return {
    strikes,
    audioLevel,
    integrityScore,
    evidenceLog,
    report,
    generateReport
  };
};
