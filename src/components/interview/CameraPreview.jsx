import React from 'react';
import WebcamView from '../auth/WebcamView';

export default function CameraPreview({ videoRef, canvasRef, isFaceDetected, error }) {
  return (
    <div className="glass p-6 rounded-[2.5rem] border border-slate-200/50 flex flex-col items-center justify-center min-h-[340px]">
      {error ? (
        <div className="text-center p-6 text-xs text-error font-semibold leading-relaxed">
          <p>{error}</p>
        </div>
      ) : (
        <div className="py-6">
          <WebcamView
            videoRef={videoRef}
            canvasRef={canvasRef}
            isFaceDetected={isFaceDetected}
            autoStart={true}
          />
        </div>
      )}
    </div>
  );
}
