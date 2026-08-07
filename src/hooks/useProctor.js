import { useEnterpriseProctor } from './useEnterpriseProctor';

export const useProctor = (isActive, faceData, arg3, arg4, arg5) => {
  let videoRef = null;
  let onStrike = null;
  let sessionId = 'session-default';

  if (typeof arg3 === 'function') {
    onStrike = arg3;
    sessionId = arg4 || 'session-default';
  } else {
    videoRef = arg3;
    onStrike = arg4;
    sessionId = arg5 || 'session-default';
  }

  const enterprise = useEnterpriseProctor(isActive, faceData, videoRef, onStrike, sessionId);

  return {
    strikes: enterprise.strikes,
    audioLevel: enterprise.audioLevel,
    integrityScore: enterprise.integrityScore,
    evidenceLog: enterprise.evidenceLog,
    report: enterprise.report,
    generateReport: enterprise.generateReport
  };
};
