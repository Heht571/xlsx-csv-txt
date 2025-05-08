import React from 'react';
import { FileItem } from '../../context/FileConversionContext';
import { Download } from 'lucide-react';

interface FileActionsProps {
  file: FileItem;
}

const FileActions = ({ file }: FileActionsProps) => {
  const { result } = file;
  
  if (!result || result.length === 0) {
    return null;
  }
  
  const handleDownload = (resultFile: File) => {
    const url = URL.createObjectURL(resultFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = resultFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div>
      {result.length === 1 ? (
        <button
          onClick={() => handleDownload(result[0])}
          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download result</span>
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Multiple files generated:</p>
          <div className="space-y-1">
            {result.map((file, index) => (
              <button
                key={index}
                onClick={() => handleDownload(file)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Download className="h-3 w-3" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileActions;