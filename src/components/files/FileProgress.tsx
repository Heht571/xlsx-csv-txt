import React from 'react';
import { FileStatus } from '../../context/FileConversionContext';

interface FileProgressProps {
  progress: number;
  status: FileStatus;
}

const FileProgress = ({ progress, status }: FileProgressProps) => {
  // Get color based on status
  const getColorClass = () => {
    switch (status) {
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-600">Progress</span>
        <span className="text-xs font-medium text-gray-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full rounded-full ${getColorClass()} transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FileProgress;