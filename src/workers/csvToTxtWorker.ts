import { createResultFilename } from '../utils/fileUtils';

// Worker code as a string (to be used with Blob URL)
const workerCode = `
  self.onmessage = async function(e) {
    const { file, chunkSize } = e.data;
    
    try {
      // Read the file as text
      const text = await file.text();
      
      // Split into lines
      const lines = text.split('\\n');
      const totalLines = lines.length;
      let processedLines = 0;
      let processedText = '';
      
      // Process in chunks
      for (let i = 0; i < totalLines; i += chunkSize) {
        const chunk = lines.slice(i, i + chunkSize);
        
        // Process each line: replace newlines and ensure consistent spacing
        const processedChunk = chunk.map(line => {
          // Replace newlines within the line
          const cleanLine = line.replace(/(\\r\\n|\\n|\\r)/gm, ' ');
          
          // Ensure no extra spaces between separators (assumes comma as separator)
          return cleanLine.split(',')
            .map(item => item.trim())
            .join(',');
        });
        
        processedText += processedChunk.join('\\n') + (i + chunkSize < totalLines ? '\\n' : '');
        processedLines += chunk.length;
        
        // Calculate progress
        const progress = Math.floor((processedLines / totalLines) * 100);
        
        // Report progress
        self.postMessage({ type: 'progress', progress });
        
        // Simulated delay to avoid UI freezing for very small files
        if (totalLines < 100) {
          await new Promise(resolve => setTimeout(resolve, 20));
        }
      }
      
      // Create Blob for the processed TXT
      const blob = new Blob([processedText], { type: 'text/plain' });
      
      // Send final result
      self.postMessage({ type: 'complete', result: blob });
      
    } catch (error) {
      self.postMessage({ type: 'error', error: error.message || 'Unknown error processing CSV file' });
    }
  };
`;

export const createCsvToTxtWorker = (
  file: File,
  onProgress: (progress: number) => void,
  onComplete: (result: File[]) => void,
  onError: (message: string) => void
) => {
  try {
    // Create a blob URL for the worker
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    
    // Create a worker
    const worker = new Worker(workerUrl);
    
    // Handle messages from the worker
    worker.onmessage = (e) => {
      const { type, progress, result, error } = e.data;
      
      if (type === 'progress') {
        onProgress(progress);
      } else if (type === 'complete') {
        // Convert Blob to File
        const txtFile = new File(
          [result],
          createResultFilename(file.name, '.txt'),
          { type: 'text/plain' }
        );
        
        onComplete([txtFile]);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      } else if (type === 'error') {
        onError(error);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      }
    };
    
    // Handle worker errors
    worker.onerror = (error) => {
      onError(`Worker error: ${error.message}`);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };
    
    // Start the worker
    worker.postMessage({
      file,
      chunkSize: 5000 // Process 5000 lines at a time
    });
    
  } catch (error) {
    onError(`Failed to create CSV to TXT worker: ${error instanceof Error ? error.message : String(error)}`);
  }
};