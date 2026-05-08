import { useEffect, useRef, useCallback } from 'react';
import { useToastStore } from '../components/common/Toast';

export const useProctor = (isActive, onStrike) => {
  const { addToast } = useToastStore();
  const strikes = useRef(0);

  const addStrike = useCallback((reason) => {
    strikes.current += 1;
    onStrike(strikes.current, reason);
    addToast(`Warning ${strikes.current}/3: ${reason}`, 'warning');
  }, [onStrike, addToast]);

  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        addStrike('Tab switched or window minimized');
      }
    };

    const handleBlur = () => {
      addStrike('Window lost focus');
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      addToast('Copy/Paste is disabled during the assessment', 'error');
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      addToast('Right-click is strictly disabled during the assessment', 'error');
    };

    const handleKeyDown = (e) => {
      // Prevent common shortcuts like F12, Ctrl+C, Ctrl+V, etc.
      if (
        e.key === 'F12' || 
        (e.ctrlKey && ['c', 'v', 'x', 'p', 's', 'i', 'u'].includes(e.key.toLowerCase())) ||
        (e.metaKey && ['c', 'v', 'x', 'p', 's', 'i', 'u'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        addToast('Keyboard shortcuts are disabled', 'error');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, addStrike, addToast]);

  return { strikes: strikes.current };
};
