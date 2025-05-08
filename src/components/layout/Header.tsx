import React from 'react';
import { FileCheck } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileCheck className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">FileConverter Pro</h1>
        </div>
        <div className="text-sm text-gray-600">
          High Performance File Conversion
        </div>
      </div>
    </header>
  );
};

export default Header;