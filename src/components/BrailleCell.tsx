import React from 'react';
import { BrailleDot } from './BrailleDot';
import type { BraillePattern } from '../lib/braille';

interface BrailleCellProps {
  pattern: BraillePattern;
  onDotClick?: (position: number) => void;
  interactive?: boolean;
}

export const BrailleCell: React.FC<BrailleCellProps> = ({ pattern, onDotClick, interactive = false }) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-2 bg-white rounded-lg shadow-sm" style={{ width: "80px" }}>
      {[1, 2, 3, 4, 5, 6].map((position) => (
        <BrailleDot
          key={position}
          position={position}
          active={pattern.includes(position)}
          onClick={() => onDotClick?.(position)}
          interactive={interactive}
        />
      ))}
    </div>
  );
};