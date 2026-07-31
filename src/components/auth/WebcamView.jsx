import React, { useEffect, useRef } from 'react';

const WebcamView = ({ videoRef, canvasRef, isFaceDetected, onStart, autoStart = true }) => {
  const onStartRef = useRef(onStart);

  useEffect(() => {
    onStartRef.current = onStart;
  }, [onStart]);

  useEffect(() => {
    if (autoStart && onStartRef.current) {
      onStartRef.current();
    }
  }, [autoStart]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ring */}
      <div className={`absolute rounded-full border-4 transition-all duration-500 ${
        isFaceDetected
          ? 'border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.6)]'
          : 'border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.4)]'
      }`}
        style={{ width: 280, height: 280 }}
      />

      {/* Spinning scan ring */}
      <div
        className="absolute rounded-full border-2 border-transparent animate-spin"
        style={{
          width: 295,
          height: 295,
          borderTopColor: isFaceDetected ? '#4ade80' : '#a78bfa',
          animationDuration: '2s',
        }}
      />

      {/* Video container — circular clip */}
      <div
        className="relative overflow-hidden rounded-full bg-gray-900"
        style={{ width: 260, height: 260 }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Scan line animation */}
        {!isFaceDetected && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-70"
            style={{
              animation: 'scanLine 2s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Status indicator */}
      <div className={`absolute -bottom-8 text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
        isFaceDetected ? 'text-green-400' : 'text-violet-400'
      }`}>
        <div className={`w-2 h-2 rounded-full animate-pulse ${
          isFaceDetected ? 'bg-green-400' : 'bg-violet-400'
        }`} />
        {isFaceDetected ? 'Face Detected' : 'Scanning...'}
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};

export default WebcamView;
