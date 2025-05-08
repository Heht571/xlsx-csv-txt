import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ConversionType, useFileConversion } from '../../context/FileConversionContext';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploadZoneProps {
  conversionType: ConversionType;
  disabled?: boolean;
}

const FileUploadZone = ({ conversionType, disabled = false }: FileUploadZoneProps) => {
  const { addFiles } = useFileConversion();
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: File[]): boolean => {
    setError(null);
    
    if (files.length === 0) return false;
    
    const acceptedExtensions = conversionType === 'xlsx-to-csv' 
      ? ['.xlsx', '.xls'] 
      : ['.csv'];
    
    const invalidFiles = files.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return !acceptedExtensions.includes(ext);
    });
    
    if (invalidFiles.length > 0) {
      const expectedExt = conversionType === 'xlsx-to-csv' ? 'XLSX/XLS' : 'CSV';
      setError(`Some files have invalid formats. Please upload only ${expectedExt} files.`);
      return false;
    }
    
    return true;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (validateFiles(acceptedFiles)) {
        addFiles(acceptedFiles, conversionType);
      }
    },
    [addFiles, conversionType]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
  });

  const acceptedFileTypes = conversionType === 'xlsx-to-csv' 
    ? '.xlsx, .xls' 
    : '.csv';

  return (
    <div className="mt-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-3">
          <Upload 
            className={`h-12 w-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} 
          />
          <p className="text-gray-700 font-medium">
            {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select files'}
          </p>
          <p className="text-sm text-gray-500">
            {conversionType === 'xlsx-to-csv' 
              ? 'Upload XLSX files to convert to CSV' 
              : 'Upload CSV files to convert to TXT'}
          </p>
          <p className="text-xs text-gray-400">
            Accepts: {acceptedFileTypes}
          </p>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-red-600 flex items-center space-x-1">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;