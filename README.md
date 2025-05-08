# File Converter Web Application | 文件转换器网页应用

[English](#english) | [中文](#chinese)

<a id="english"></a>

## English

A modern web application for converting files between different formats, built with React, TypeScript, and Vite.

### Features

- **XLSX to CSV Conversion**: Convert Excel files to CSV format with proper handling of data types and formatting
- **CSV to TXT Conversion**: Convert CSV files to plain text format
- **Multi-file Processing**: Upload and convert multiple files at once
- **Progress Tracking**: Real-time progress indicators for each file conversion
- **Web Worker Implementation**: Background processing to keep the UI responsive
- **Responsive Design**: Works on desktop and mobile devices with a clean, modern interface

### Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **File Processing**: Web Workers for non-blocking operations
- **Excel Processing**: SheetJS (xlsx) library
- **UI Components**: Custom React components with Lucide icons

### Deployment

#### Prerequisites

- Node.js (v14 or higher)
- npm

#### Quick Start

Simply navigate to the project directory and run:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` in your browser.

### Usage

1. Select the conversion type (XLSX to CSV or CSV to TXT)
2. Drag and drop files into the upload zone or click to browse files
3. Click "Start Conversion" to begin processing
4. Monitor progress for each file
5. Download converted files when processing is complete
6. Use "Clear Completed" to remove finished files or "Clear All" to reset

### Build for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Project Structure

```
src/
├── components/           # React components
│   ├── conversion/       # Conversion-related components
│   ├── files/            # File handling components
│   ├── layout/           # Layout components
│   └── uploader/         # File upload components
├── context/              # React context providers
├── utils/                # Utility functions
├── workers/              # Web worker implementations
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

### Key Components

- **FileConverter**: Main component that orchestrates the file conversion process
- **FileUploadZone**: Handles file uploads via drag-and-drop or file browser
- **FileList**: Displays uploaded files with their conversion status
- **ConversionControls**: Provides buttons to start conversion and manage files
- **FileConversionContext**: Manages the state of file conversions

### Web Workers

The application uses Web Workers to perform file conversions in the background:

- **xlsxToCsvWorker**: Converts Excel files to CSV format
- **csvToTxtWorker**: Converts CSV files to TXT format

### Features in Detail

#### XLSX to CSV Conversion

- Preserves data types and formatting
- Handles multiple sheets in Excel files
- Processes files in chunks to maintain performance
- Properly handles headers and special characters

#### CSV to TXT Conversion

- Cleans and normalizes CSV data
- Removes unnecessary whitespace
- Processes files in chunks for better performance

### Browser Compatibility

The application is compatible with modern browsers that support:

- Web Workers
- File API
- ES6+ JavaScript features

### License

This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments

- [SheetJS](https://sheetjs.com/) for Excel file processing
- [React Dropzone](https://react-dropzone.js.org/) for file upload functionality
- [Lucide React](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

<a id="chinese"></a>

## 中文

一个用于在不同格式之间转换文件的现代网页应用，使用 React、TypeScript 和 Vite 构建。

### 功能特点

- **XLSX 转 CSV 转换**：将 Excel 文件转换为 CSV 格式，正确处理数据类型和格式
- **CSV 转 TXT 转换**：将 CSV 文件转换为纯文本格式
- **多文件处理**：一次上传并转换多个文件
- **进度跟踪**：实时显示每个文件转换的进度指示器
- **Web Worker 实现**：后台处理以保持 UI 响应性
- **响应式设计**：具有简洁现代界面，适用于桌面和移动设备

### 技术栈

- **前端框架**：React 与 TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS
- **文件处理**：Web Workers 用于非阻塞操作
- **Excel 处理**：SheetJS (xlsx) 库
- **UI 组件**：自定义 React 组件与 Lucide 图标

### 部署

#### 前提条件

- Node.js (v14 或更高版本)
- npm

#### 快速开始

只需进入项目目录并运行：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用将在浏览器中的 `http://localhost:5173` 可用。

### 使用方法

1. 选择转换类型（XLSX 转 CSV 或 CSV 转 TXT）
2. 将文件拖放到上传区域或点击浏览文件
3. 点击"开始转换"开始处理
4. 监控每个文件的进度
5. 处理完成后下载转换后的文件
6. 使用"清除已完成"移除已完成的文件或"清除全部"重置

### 生产环境构建

要为生产环境构建应用：

```bash
npm run build
```

构建产物将存储在 `dist/` 目录中。

### 项目结构

```
src/
├── components/           # React 组件
│   ├── conversion/       # 转换相关组件
│   ├── files/            # 文件处理组件
│   ├── layout/           # 布局组件
│   └── uploader/         # 文件上传组件
├── context/              # React 上下文提供者
├── utils/                # 实用函数
├── workers/              # Web worker 实现
├── App.tsx               # 主应用组件
├── main.tsx              # 应用入口点
└── index.css             # 全局样式
```

### 关键组件

- **FileConverter**：协调文件转换过程的主要组件
- **FileUploadZone**：通过拖放或文件浏览器处理文件上传
- **FileList**：显示上传的文件及其转换状态
- **ConversionControls**：提供开始转换和管理文件的按钮
- **FileConversionContext**：管理文件转换的状态

### Web Workers

应用使用 Web Workers 在后台执行文件转换：

- **xlsxToCsvWorker**：将 Excel 文件转换为 CSV 格式
- **csvToTxtWorker**：将 CSV 文件转换为 TXT 格式

### 功能详情

#### XLSX 转 CSV 转换

- 保留数据类型和格式
- 处理 Excel 文件中的多个工作表
- 分块处理文件以保持性能
- 正确处理标题和特殊字符

#### CSV 转 TXT 转换

- 清理和规范化 CSV 数据
- 移除不必要的空白
- 分块处理文件以获得更好的性能

### 浏览器兼容性

该应用兼容支持以下功能的现代浏览器：

- Web Workers
- File API
- ES6+ JavaScript 特性

### 许可证

本项目采用 MIT 许可证 - 详情请参阅 LICENSE 文件。

### 致谢

- [SheetJS](https://sheetjs.com/) 用于 Excel 文件处理
- [React Dropzone](https://react-dropzone.js.org/) 用于文件上传功能
- [Lucide React](https://lucide.dev/) 用于图标
- [Tailwind CSS](https://tailwindcss.com/) 用于样式
