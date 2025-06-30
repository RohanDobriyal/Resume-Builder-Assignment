import React, { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { ResumeData } from '../types/resume';

interface FileUploadProps {
  onResumeLoad: (resume: ResumeData) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onResumeLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      alert('Please upload only PDF or DOCX files');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      if (result.success && result.resume) {
        onResumeLoad(result.resume);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.docx"
        className="hidden"
      />
      <div
        onClick={handleClick}
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <Upload size={32} className="text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">Upload Your Resume</p>
            <p className="text-sm text-gray-500 mt-2">
              Drag and drop or click to upload PDF or DOCX files
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <FileText size={16} />
            <span>Supported formats: PDF, DOCX</span>
          </div>
        </div>
      </div>
    </div>
  );
};