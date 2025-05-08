export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return '.' + filename.split('.').pop()?.toLowerCase();
};

export const createResultFilename = (originalFilename: string, newExtension: string, sheetName?: string): string => {
  const baseName = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
  const sheetSuffix = sheetName ? `-${sheetName}` : '';
  return `${baseName}${sheetSuffix}${newExtension}`;
};