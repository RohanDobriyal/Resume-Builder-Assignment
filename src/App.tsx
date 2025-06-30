import React, { useState, useEffect } from 'react';
import { Save, Download, Upload as UploadIcon, FileUp as FileUser } from 'lucide-react';
import { saveAs } from 'file-saver';
import { FileUpload } from './components/FileUpload';
import { ResumeForm } from './components/ResumeForm';
import { ResumeData } from './types/resume';

function App() {
  const [resume, setResume] = useState<ResumeData>({
    name: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  // Load resume on component mount
  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/load-resume');
      if (response.ok) {
        const data = await response.json();
        setResume(data);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveResume = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/save-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resume),
      });

      if (response.ok) {
        alert('Resume saved successfully!');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Error saving resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadJson = () => {
    const jsonString = JSON.stringify(resume, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, 'resume.json');
  };

  const hasResumeData = resume.name || resume.summary || resume.experience.length > 0 || resume.education.length > 0 || resume.skills.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileUser className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Resume Editor</h1>
                <p className="text-sm text-gray-600">Create and enhance your professional resume</p>
              </div>
            </div>
            
            {hasResumeData && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={loadResume}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  <UploadIcon size={16} />
                  <span>Load</span>
                </button>
                
                <button
                  onClick={saveResume}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                
                <button
                  onClick={downloadJson}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <Download size={16} />
                  <span>Download JSON</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasResumeData ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get Started with Your Resume
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Upload an existing resume or start building from scratch
              </p>
            </div>
            
            <FileUpload onResumeLoad={setResume} />
            
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">or</span>
                </div>
              </div>
              
              <button
                onClick={() => setResume({ name: '', summary: '', experience: [], education: [], skills: [] })}
                className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Start from Scratch
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Resume Builder</h2>
              <p className="text-gray-600">
                Fill out the sections below and use AI enhancement to improve your content.
              </p>
            </div>
            
            <ResumeForm resume={resume} onResumeChange={setResume} />
          </div>
        )}
        
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;