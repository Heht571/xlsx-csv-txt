import React, { useState } from 'react';
import FileUploadZone from './uploader/FileUploadZone';
import FileList from './files/FileList';
import ConversionControls from './conversion/ConversionControls';
import { ConversionType, useFileConversion } from '../context/FileConversionContext';
import ConversionTypeSelector from './conversion/ConversionTypeSelector';

const FileConverter = () => {
  const { files, clearAllFiles, clearCompletedFiles, startConversion } = useFileConversion();
  const [selectedConversionType, setSelectedConversionType] = useState<ConversionType>('xlsx-to-csv');

  const handleConversionTypeChange = (type: ConversionType) => {
    setSelectedConversionType(type);
  };

  const hasFiles = files.length > 0;
  const hasWaitingFiles = files.some(file => file.status === 'waiting');
  const hasProcessingFiles = files.some(file => file.status === 'processing');
  const hasCompletedFiles = files.some(file => file.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">File Converter</h2>
        
        <ConversionTypeSelector 
          selectedType={selectedConversionType}
          onTypeChange={handleConversionTypeChange}
          disabled={hasFiles}
        />
        
        <FileUploadZone conversionType={selectedConversionType} disabled={hasProcessingFiles} />
        
        {hasFiles && (
          <>
            <div className="mt-6">
              <FileList />
            </div>
            
            <div className="mt-6">
              <ConversionControls 
                onStartConversion={startConversion}
                onClearCompleted={clearCompletedFiles}
                onClearAll={clearAllFiles}
                canStartConversion={hasWaitingFiles && !hasProcessingFiles}
                canClearCompleted={hasCompletedFiles && !hasProcessingFiles}
                canClearAll={!hasProcessingFiles}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileConverter;