import { useCallback } from 'react';

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

export const useAudio = () => {
  const playTone = useCallback((frequency: number = 440, duration: number = 200) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1;

    oscillator.start();
    
    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      gainNode.disconnect();
    }, duration);
  }, []);

  const playSuccess = useCallback(() => {
    playTone(880, 100);
    setTimeout(() => playTone(1100, 100), 100);
  }, [playTone]);

  const playError = useCallback(() => {
    playTone(220, 300);
  }, [playTone]);

  return { playTone, playSuccess, playError };
};