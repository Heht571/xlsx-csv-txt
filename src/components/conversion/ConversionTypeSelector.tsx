import React from 'react';
import { ConversionType } from '../../context/FileConversionContext';
import { FileSpreadsheet, FileText } from 'lucide-react';

interface ConversionTypeSelectorProps {
  selectedType: ConversionType;
  onTypeChange: (type: ConversionType) => void;
  disabled?: boolean;
}

const ConversionTypeSelector = ({ 
  selectedType, 
  onTypeChange,
  disabled = false
}: ConversionTypeSelectorProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Conversion Type
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onTypeChange('xlsx-to-csv')}
          disabled={disabled}
          className={`
            p-4 border rounded-lg text-center flex items-center justify-center space-x-3
            ${selectedType === 'xlsx-to-csv' 
              ? 'bg-blue-50 border-blue-500 text-blue-700' 
              : 'bg-white border-gray-300 text-gray-700'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}
            transition-colors
          `}
        >
          <FileSpreadsheet className="h-5 w-5" />
          <span>XLSX to CSV</span>
        </button>
        <button
          type="button"
          onClick={() => onTypeChange('csv-to-txt')}
          disabled={disabled}
          className={`
            p-4 border rounded-lg text-center flex items-center justify-center space-x-3
            ${selectedType === 'csv-to-txt' 
              ? 'bg-blue-50 border-blue-500 text-blue-700' 
              : 'bg-white border-gray-300 text-gray-700'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}
            transition-colors
          `}
        >
          <FileText className="h-5 w-5" />
          <span>CSV to TXT</span>
        </button>
      </div>
      {disabled && (
        <p className="mt-2 text-sm text-gray-500">
          Clear all files to change conversion type
        </p>
      )}
    </div>
  );
};

export default ConversionTypeSelector;