import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { registerFileWorker } from '../workers/workerManager';

export type ConversionType = 'xlsx-to-csv' | 'csv-to-txt';
export type FileStatus = 'waiting' | 'processing' | 'completed' | 'error';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  progress: number;
  conversionType: ConversionType;
  error?: string;
  result?: File[];
}

interface FileConversionContextType {
  files: FileItem[];
  addFiles: (files: File[], conversionType: ConversionType) => void;
  updateFileProgress: (id: string, progress: number) => void;
  updateFileStatus: (id: string, status: FileStatus, result?: File[], error?: string) => void;
  clearCompletedFiles: () => void;
  clearAllFiles: () => void;
  startConversion: () => void;
}

const FileConversionContext = createContext<FileConversionContextType | undefined>(undefined);

export const useFileConversion = () => {
  const context = useContext(FileConversionContext);
  if (!context) {
    throw new Error('useFileConversion must be used within a FileConversionProvider');
  }
  return context;
};

export const FileConversionProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileItem[]>([]);

  const addFiles = useCallback((newFiles: File[], conversionType: ConversionType) => {
    const fileItems: FileItem[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'waiting',
      progress: 0,
      conversionType,
    }));

    setFiles((prevFiles) => [...prevFiles, ...fileItems]);
  }, []);

  const updateFileProgress = useCallback((id: string, progress: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => (file.id === id ? { ...file, progress } : file))
    );
  }, []);

  const updateFileStatus = useCallback(
    (id: string, status: FileStatus, result?: File[], error?: string) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === id ? { ...file, status, result, error, progress: status === 'completed' ? 100 : file.progress } : file
        )
      );
    },
    []
  );

  const clearCompletedFiles = useCallback(() => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.status !== 'completed'));
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const startConversion = useCallback(() => {
    const waitingFiles = files.filter((file) => file.status === 'waiting');
    
    waitingFiles.forEach((fileItem) => {
      // Mark as processing
      updateFileStatus(fileItem.id, 'processing');
      
      // Initialize worker and start conversion
      registerFileWorker(
        fileItem,
        (progress) => updateFileProgress(fileItem.id, progress),
        (result) => updateFileStatus(fileItem.id, 'completed', result),
        (error) => updateFileStatus(fileItem.id, 'error', undefined, error)
      );
    });
  }, [files, updateFileProgress, updateFileStatus]);

  const value = {
    files,
    addFiles,
    updateFileProgress,
    updateFileStatus,
    clearCompletedFiles,
    clearAllFiles,
    startConversion,
  };

  return (
    <FileConversionContext.Provider value={value}>
      {children}
    </FileConversionContext.Provider>
  );
};