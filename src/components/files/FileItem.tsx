import React from 'react';
import { FileItem as FileItemType } from '../../context/FileConversionContext';
import FileProgress from './FileProgress';
import FileActions from './FileActions';
import { formatFileSize } from '../../utils/fileUtils';
import { 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from 'lucide-react';

interface FileItemProps {
  file: FileItemType;
}

const FileItem = ({ file }: FileItemProps) => {
  const { name, size, status, progress, conversionType, error } = file;
  
  // Determine file icon
  const getFileIcon = () => {
    if (conversionType === 'xlsx-to-csv') {
      return <FileSpreadsheet className="h-5 w-5 text-blue-500" />;
    } else {
      return <FileText className="h-5 w-5 text-green-500" />;
    }
  };
  
  // Determine status icon and color
  const getStatusIndicator = () => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'processing':
        return <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`
      bg-white border rounded-lg p-4 transition-shadow hover:shadow-md
      ${status === 'error' ? 'border-red-200' : 'border-gray-200'}
    `}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getFileIcon()}
          <div>
            <h4 className="font-medium text-gray-900 break-all">{name}</h4>
            <p className="text-sm text-gray-500">{formatFileSize(size)}</p>
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIndicator()}
          <span className="text-sm text-gray-600 capitalize">{status}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <FileProgress progress={progress} status={status} />
      </div>
      
      {status === 'completed' && (
        <div className="mt-3">
          <FileActions file={file} />
        </div>
      )}
    </div>
  );
};

export default FileItem;