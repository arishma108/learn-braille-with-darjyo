import React from 'react';

interface BrailleDotProps {
  position: number;
  active: boolean;
  onClick?: () => void;
  interactive?: boolean;
}

export const BrailleDot: React.FC<BrailleDotProps> = ({ position, active, onClick, interactive = false }) => {
  const baseClasses = "w-8 h-8 rounded-full transition-all duration-200";
  const activeClasses = active ? "bg-blue-500" : "bg-gray-200";
  const interactiveClasses = interactive ? "hover:bg-blue-300 cursor-pointer" : "";

  return (
    <button
      className={`${baseClasses} ${activeClasses} ${interactiveClasses}`}
      onClick={onClick}
      disabled={!interactive}
      aria-label={`Dot position ${position}`}
    />
  );
};