import { useState, useEffect } from 'react';

interface Progress {
  letters: number;
  numbers: number;
  punctuation: number;
  totalExercises: number;
}

const STORAGE_KEY = 'braille-progress';

export const useProgress = () => {
  const [progress, setProgress] = useState<Progress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      letters: 0,
      numbers: 0,
      punctuation: 0,
      totalExercises: 0
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (category: keyof Progress, value: number) => {
    setProgress(prev => ({
      ...prev,
      [category]: value,
      totalExercises: prev.totalExercises + 1
    }));
  };

  return { progress, updateProgress };
};