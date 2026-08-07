import { FilesetResolver, ObjectDetector } from '@mediapipe/tasks-vision';

let cachedObjectDetector = null;
let objectDetectorPromise = null;

export class BehaviorEngine {
  constructor(sessionId = 'session-default') {
    this.sessionId = sessionId;
    this.audioContext = null;
    this.analyser = null;
    this.audioStream = null;
    this.audioAnimFrame = null;
    this.isAudioActive = false;
    this.audioLevel = 0;
    
    this.buffers = {
      absence: 0,
      gaze: 0,
      noise: 0,
      phone: 0,
      multiplePersons: 0
    };

    this.objectDetector = null;
  }

  async initObjectDetector() {
    if (cachedObjectDetector) {
      this.objectDetector = cachedObjectDetector;
      return;
    }
    if (!objectDetectorPromise) {
      objectDetectorPromise = (async () => {
        try {
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
          );
          cachedObjectDetector = await ObjectDetector.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float32/1/efficientdet_lite0.tflite",
              delegate: "CPU"
            },
            scoreThreshold: 0.35,
            runningMode: "VIDEO"
          });
        } catch (err) {
          console.warn('[BehaviorEngine] MediaPipe ObjectDetector load warning:', err);
          cachedObjectDetector = null;
        }
      })();
    }
    await objectDetectorPromise;
    this.objectDetector = cachedObjectDetector;
  }

  startAudioMonitoring(onViolation) {
    if (this.isAudioActive) return;

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioStream = stream;
        
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioCtx();
        this.analyser = this.audioContext.createAnalyser();
        
        const source = this.audioContext.createMediaStreamSource(stream);
        source.connect(this.analyser);
        this.analyser.fftSize = 256;
        
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.isAudioActive = true;

        const checkAudio = () => {
          if (!this.analyser || !this.isAudioActive) return;

          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          this.audioLevel = Math.round(average);

          if (average > 45) {
            this.buffers.noise++;
            if (this.buffers.noise > 15) {
              if (typeof onViolation === 'function') {
                onViolation({
                  engine: 'BEHAVIOR',
                  violationType: 'AUDIO_NOISE_DETECTED',
                  severity: 'MEDIUM',
                  metadata: { audioLevel: this.audioLevel }
                });
              }
              this.buffers.noise = 0;
            }
          } else {
            this.buffers.noise = Math.max(0, this.buffers.noise - 1);
          }

          this.audioAnimFrame = requestAnimationFrame(checkAudio);
        };

        checkAudio();
      } catch (err) {
        console.warn('[BehaviorEngine] Audio initialization warning:', err);
      }
    };

    initAudio();
  }

  stopAudioMonitoring() {
    this.isAudioActive = false;
    if (this.audioAnimFrame) {
      cancelAnimationFrame(this.audioAnimFrame);
      this.audioAnimFrame = null;
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }

  evaluateBehaviorFrame(faceData, videoElement, onViolation) {
    if (!faceData) return;

    // 1. Multiple Faces via Face Mesh
    if (faceData.multiple) {
      if (typeof onViolation === 'function') {
        onViolation({
          engine: 'BEHAVIOR',
          violationType: 'MULTIPLE_FACES_DETECTED',
          severity: 'HIGH',
          metadata: { facesDetected: 2 }
        });
      }
    }

    // 2. Face Presence / Absence
    if (!faceData.detected) {
      this.buffers.absence++;
      if (this.buffers.absence > 10) {
        if (typeof onViolation === 'function') {
          onViolation({
            engine: 'BEHAVIOR',
            violationType: 'FACE_ABSENT',
            severity: 'HIGH',
            metadata: { absenceBuffer: this.buffers.absence }
          });
        }
        this.buffers.absence = 0;
      }
    } else {
      this.buffers.absence = 0;
    }

    // 3. Head Pose & Eye Gaze Tracking
    if (faceData.gaze && faceData.gaze.direction !== 'Center') {
      this.buffers.gaze++;
      if (this.buffers.gaze > 8) {
        if (typeof onViolation === 'function') {
          onViolation({
            engine: 'BEHAVIOR',
            violationType: 'LOOKING_AWAY',
            severity: 'LOW',
            metadata: { direction: faceData.gaze.direction, pose: faceData.pose }
          });
        }
        this.buffers.gaze = 0;
      }
    } else {
      this.buffers.gaze = 0;
    }

    // 4. Object Detection (Phone & Person Detection)
    if (videoElement && videoElement.readyState >= 2 && this.objectDetector) {
      try {
        const now = performance.now();
        const detections = this.objectDetector.detectForVideo(videoElement, now);

        if (detections && detections.detections) {
          let phoneDetected = false;
          let personCount = 0;

          detections.detections.forEach(det => {
            det.categories.forEach(cat => {
              const name = (cat.categoryName || '').toLowerCase();
              if (name.includes('phone') || name.includes('cell')) {
                phoneDetected = true;
              }
              if (name === 'person') {
                personCount++;
              }
            });
          });

          if (phoneDetected) {
            this.buffers.phone++;
            if (this.buffers.phone > 3) {
              if (typeof onViolation === 'function') {
                onViolation({
                  engine: 'BEHAVIOR',
                  violationType: 'PHONE_DETECTED',
                  severity: 'CRITICAL',
                  metadata: { objectDetected: 'Cell Phone' }
                });
              }
              this.buffers.phone = 0;
            }
          } else {
            this.buffers.phone = 0;
          }

          if (personCount > 1) {
            this.buffers.multiplePersons++;
            if (this.buffers.multiplePersons > 5) {
              if (typeof onViolation === 'function') {
                onViolation({
                  engine: 'BEHAVIOR',
                  violationType: 'ADDITIONAL_PERSON_DETECTED',
                  severity: 'HIGH',
                  metadata: { count: personCount }
                });
              }
              this.buffers.multiplePersons = 0;
            }
          } else {
            this.buffers.multiplePersons = 0;
          }
        }
      } catch (err) {
        console.warn('[BehaviorEngine] Object detection frame warning:', err);
      }
    }
  }
}
