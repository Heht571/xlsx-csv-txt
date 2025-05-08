import { FileItem } from '../context/FileConversionContext';
import { createXlsxToCsvWorker } from './xlsxToCsvWorker';
import { createCsvToTxtWorker } from './csvToTxtWorker';

export const registerFileWorker = (
  fileItem: FileItem,
  onProgress: (progress: number) => void,
  onComplete: (result: File[]) => void,
  onError: (message: string) => void
) => {
  try {
    const { conversionType, file } = fileItem;
    
    if (conversionType === 'xlsx-to-csv') {
      createXlsxToCsvWorker(file, onProgress, onComplete, onError);
    } else if (conversionType === 'csv-to-txt') {
      createCsvToTxtWorker(file, onProgress, onComplete, onError);
    } else {
      onError(`Unsupported conversion type: ${conversionType}`);
    }
  } catch (error) {
    onError(`Failed to initialize worker: ${error instanceof Error ? error.message : String(error)}`);
  }
};