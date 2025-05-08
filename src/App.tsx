import React from 'react';
import { FileConversionProvider } from './context/FileConversionContext';
import MainLayout from './components/layout/MainLayout';
import FileConverter from './components/FileConverter';

function App() {
  return (
    <FileConversionProvider>
      <MainLayout>
        <FileConverter />
      </MainLayout>
    </FileConversionProvider>
  );
}

export default App;