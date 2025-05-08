import React from 'react';
import { useFileConversion } from '../../context/FileConversionContext';
import FileItem from './FileItem';

const FileList = () => {
  const { files } = useFileConversion();
  
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Files ({files.length})</h3>
      <div className="space-y-3">
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
};

export default FileList;