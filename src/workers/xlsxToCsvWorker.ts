import * as XLSX from 'xlsx';
import { createResultFilename } from '../utils/fileUtils';

// Worker code as a string (to be used with Blob URL)
const workerCode = `
  // Import XLSX library
  importScripts('https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.full.min.js');

  function handleDuplicateHeaders(headers) {
    const seen = new Map();
    return headers.map(header => {
      if (!header) return '_blank_'; // Handle empty headers
      const baseHeader = String(header).trim();
      const count = seen.get(baseHeader) || 0;
      seen.set(baseHeader, count + 1);
      return count > 0 ? \`\${baseHeader}_\${count}\` : baseHeader;
    });
  }

  function processCell(cell) {
    if (!cell) return '';
    const rawValue = [
      cell.w,
      cell.v ? cell.v.toString() : '',
      ''
    ].find(v => v !== undefined && v !== null);
    if (/^[+=@-]/.test(rawValue) || 
      /^\d+E\+\d+$/.test(rawValue) || 
      rawValue.length > 15
    ) {
      return "\t" + rawValue;
    }
    return rawValue;

  }

  function forceTextFormat(worksheet) {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({r: R, c: C});
        const cell = worksheet[cellRef];
        
        if (cell) {
          // Process and force text format for all cells
          const value = processCell(cell);
          worksheet[cellRef] = {
            t: 's', // Set type to string
            v: value, // Set the value
            w: value, // Set the formatted text
            z: '@' // Force text format
          };
        }
      }
    }
    
    return worksheet;
  }

  self.onmessage = async function(e) {
    const { file } = e.data;
    const CHUNK_SIZE = 50000; // Process 50,000 lines at a time (matching Python implementation)
    
    try {
      // Read the file as array buffer
      const data = await file.arrayBuffer();
      
      // Parse workbook with text format for all cells
      const workbook = XLSX.read(data, { 
        type: 'array',
        cellText: true, // Force text format
        cellDates: false, // Handle dates
        cellNF: true, // Ignore number formats
        cellStyles: false, // Ignore styles
        raw: false, // Get raw values
        cellFormula: false
      });
      
      // Process each sheet
      const sheets = workbook.SheetNames;
      const totalSheets = sheets.length;
      const results = [];
      
      for (let i = 0; i < sheets.length; i++) {
        const sheetName = sheets[i];
        const worksheet = workbook.Sheets[sheetName];
        
        // Get the range of the sheet
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        const totalRows = range.e.r - range.s.r + 1;
        
        // Get and process headers
        const headers = [];
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cell = worksheet[XLSX.utils.encode_cell({r: range.s.r, c: C})];
          headers.push(cell ? processCell(cell) : '_blank_');
        }
        
        // Handle duplicate headers
        const uniqueHeaders = handleDuplicateHeaders(headers);
        
        // Update headers in worksheet
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cellRef = XLSX.utils.encode_cell({r: range.s.r, c: C});
          worksheet[cellRef] = {
            t: 's',
            v: uniqueHeaders[C],
            w: uniqueHeaders[C],
            z: '@'
          };
        }
        
        // Force text format for all cells
        forceTextFormat(worksheet);
        
        // Convert to CSV with strict text formatting
        const csv = XLSX.utils.sheet_to_csv(worksheet, {
          strip: false, // Preserve whitespace
          blankrows: true, // Skip empty rows
          rawNumbers: false, // Keep raw string values
          dateNF: '@', // Force text format for dates
          forceQuotes: true // Force quotes around all fields
        });
        
        // Process CSV in chunks
        const lines = csv.split('\\n');
        const totalLines = lines.length;
        let processedLines = 0;
        let processedCsv = '';
        
        // Process header line first
        processedCsv += lines[0] + '\\n';
        processedLines++;
        
        // Process remaining lines in chunks
        for (let j = 1; j < totalLines; j += CHUNK_SIZE) {
          const chunk = lines.slice(j, Math.min(j + CHUNK_SIZE, totalLines));
          processedCsv += chunk.join('\\n') + (j + CHUNK_SIZE < totalLines ? '\\n' : '');
          processedLines += chunk.length;
          
          // Calculate progress considering all sheets
          const sheetProgress = processedLines / totalLines;
          const overallProgress = Math.floor(((i + sheetProgress) / totalSheets) * 100);
          
          // Report progress
          self.postMessage({ 
            type: 'progress', 
            progress: overallProgress,
            detail: {
              sheet: sheetName,
              processedRows: processedLines,
              totalRows: totalLines
            }
          });
          
          // Small delay to prevent UI blocking
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        
        // Create Blob for this sheet's CSV
        const blob = new Blob([processedCsv], { type: 'text/csv;charset=utf-8' });
        
        // Create a sanitized sheet name for the filename
        const safeName = sheetName.replace(/[\\/:*?"<>|]/g, '_');
        
        // Add to results
        results.push({
          content: blob,
          name: safeName
        });
      }
      
      // Send final result
      self.postMessage({ type: 'complete', results });
      
    } catch (error) {
      self.postMessage({ 
        type: 'error', 
        error: error.message || 'Unknown error processing XLSX file' 
      });
    }
  };
`;

export const createXlsxToCsvWorker = (
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
      const { type, progress, results, error } = e.data;
      
      if (type === 'progress') {
        onProgress(progress);
      } else if (type === 'complete') {
        // Convert results (with Blobs) to Files
        const files = results.map((result: { content: Blob, name: string }) => {
          return new File(
            [result.content],
            createResultFilename(file.name, '.csv', result.name),
            { type: 'text/csv' }
          );
        });
        
        onComplete(files);
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
      onError('Worker error: ' + error.message);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };
    
    // Start the worker
    worker.postMessage({ file });
    
  } catch (error) {
    onError('Failed to create XLSX to CSV worker: ' + (error instanceof Error ? error.message : String(error)));
  }
};