export class EnvironmentEngine {
  constructor(sessionId = 'session-default') {
    this.sessionId = sessionId;
    this.isListening = false;
    this.onViolationCallback = null;
    this.listeners = [];
  }

  startMonitoring(onViolation) {
    if (this.isListening) return;
    this.onViolationCallback = onViolation;
    this.isListening = true;

    // 1. Tab Switching (Visibility Change)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        this.notifyViolation('TAB_SWITCH', 'HIGH', { detail: 'Browser tab switched or minimized' });
      }
    };

    // 2. Window Blur & Focus
    const handleBlur = () => {
      this.notifyViolation('WINDOW_BLUR', 'MEDIUM', { detail: 'Window lost focus' });
    };

    // 3. Copy, Cut, Paste Prevention & Detection
    const handleCopyCutPaste = (e) => {
      this.notifyViolation(`CLIPBOARD_${e.type.toUpperCase()}`, 'MEDIUM', { eventType: e.type });
    };

    // 4. BeforeUnload (Page Refresh / Exit Attempt)
    const handleBeforeUnload = (e) => {
      this.notifyViolation('PAGE_REFRESH_ATTEMPT', 'HIGH', { detail: 'Attempted to refresh or close assessment tab' });
      e.preventDefault();
      e.returnValue = '';
    };

    // 5. DevTools & Inspection Key Combinations
    const handleKeyDown = (e) => {
      // F12 or Ctrl+Shift+I / Cmd+Option+I / Ctrl+Shift+J / Ctrl+U
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U'))
      ) {
        this.notifyViolation('DEVTOOLS_SHORTCUT_ATTEMPT', 'CRITICAL', { keyCombo: e.key });
      }
    };

    // 6. Fullscreen Change Detection
    const handleFullscreenChange = () => {
      const isFullscreen = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      if (!isFullscreen) {
        this.notifyViolation('FULLSCREEN_EXIT', 'HIGH', { detail: 'Exited fullscreen mode' });
      }
    };

    // 7. Window Screen Resize Detection
    const handleResize = () => {
      const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
      const heightDiff = Math.abs(window.outerHeight - window.innerHeight);

      // DevTools dock or window resize anomaly
      if (widthDiff > 160 || heightDiff > 160) {
        this.notifyViolation('DEVTOOLS_OR_WINDOW_RESIZE', 'MEDIUM', { widthDiff, heightDiff });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopyCutPaste);
    document.addEventListener('cut', handleCopyCutPaste);
    document.addEventListener('paste', handleCopyCutPaste);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', handleResize);

    this.listeners = [
      { target: document, type: 'visibilitychange', handler: handleVisibility },
      { target: window, type: 'blur', handler: handleBlur },
      { target: document, type: 'copy', handler: handleCopyCutPaste },
      { target: document, type: 'cut', handler: handleCopyCutPaste },
      { target: document, type: 'paste', handler: handleCopyCutPaste },
      { target: window, type: 'beforeunload', handler: handleBeforeUnload },
      { target: window, type: 'keydown', handler: handleKeyDown },
      { target: document, type: 'fullscreenchange', handler: handleFullscreenChange },
      { target: window, type: 'resize', handler: handleResize }
    ];
  }

  notifyViolation(violationType, severity, metadata = {}) {
    if (typeof this.onViolationCallback === 'function') {
      this.onViolationCallback({
        engine: 'ENVIRONMENT',
        violationType,
        severity,
        metadata
      });
    }
  }

  stopMonitoring() {
    this.listeners.forEach(({ target, type, handler }) => {
      target.removeEventListener(type, handler);
    });
    this.listeners = [];
    this.isListening = false;
    this.onViolationCallback = null;
  }
}
