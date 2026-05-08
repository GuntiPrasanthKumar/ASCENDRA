import React, { useRef, useEffect } from 'react';

const WebcamView = ({ onVideoReady, isScanning, faceStatus }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;
    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          onVideoReady(videoRef);
        }
      } catch (err) {
        console.error("Error accessing webcam", err);
      }
    };

    startVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onVideoReady]);

  let statusColor = 'border-primary/50';
  if (isScanning) {
    if (faceStatus.multiple) statusColor = 'border-warning';
    else if (faceStatus.detected) statusColor = 'border-success';
    else statusColor = 'border-error';
  }

  return (
    <div className={`relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 ${statusColor} transition-colors duration-300`}>
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
      />
      {isScanning && (
        <div className={`absolute inset-0 rounded-full border-4 border-dashed animate-dash-rotate ${faceStatus.detected ? 'border-success' : 'border-error'}`} />
      )}
      
      {/* Overlay pulse when face detected */}
      {isScanning && faceStatus.detected && (
        <div className="absolute inset-0 rounded-full bg-success/20 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

export default WebcamView;
