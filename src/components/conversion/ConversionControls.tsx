import React from 'react';
import { Play, Trash2, RefreshCw } from 'lucide-react';

interface ConversionControlsProps {
  onStartConversion: () => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  canStartConversion: boolean;
  canClearCompleted: boolean;
  canClearAll: boolean;
}

const ConversionControls = ({
  onStartConversion,
  onClearCompleted,
  onClearAll,
  canStartConversion,
  canClearCompleted,
  canClearAll,
}: ConversionControlsProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={onStartConversion}
        disabled={!canStartConversion}
        className={`
          px-4 py-2 rounded-md flex items-center space-x-2
          ${canStartConversion 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          transition-colors
        `}
      >
        <Play className="h-4 w-4" />
        <span>Start Conversion</span>
      </button>
      
      <button
        onClick={onClearCompleted}
        disabled={!canClearCompleted}
        className={`
          px-4 py-2 rounded-md flex items-center space-x-2
          ${canClearCompleted 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          transition-colors
        `}
      >
        <RefreshCw className="h-4 w-4" />
        <span>Clear Completed</span>
      </button>
      
      <button
        onClick={onClearAll}
        disabled={!canClearAll}
        className={`
          px-4 py-2 rounded-md flex items-center space-x-2
          ${canClearAll 
            ? 'bg-red-600 text-white hover:bg-red-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          transition-colors
        `}
      >
        <Trash2 className="h-4 w-4" />
        <span>Clear All</span>
      </button>
    </div>
  );
};

export default ConversionControls;