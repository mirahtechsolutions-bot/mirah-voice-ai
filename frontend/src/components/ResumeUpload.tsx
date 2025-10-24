import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader, Eye } from 'lucide-react';
import { ResumeData, ResumeUploadResponse } from '../types';
import { apiService } from '../services/api';
import ResumeDisplay from './ResumeDisplay';

interface ResumeUploadProps {
  onResumeUploaded: (resume: ResumeData) => void;
  currentResume: ResumeData | null;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onResumeUploaded, currentResume }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showResumeDetails, setShowResumeDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF, DOC, DOCX, or TXT file.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError('');
      setUploadSuccess('');

      const response: ResumeUploadResponse = await apiService.uploadResume(file);
      
      if (response.success) {
        setUploadSuccess('Resume uploaded and parsed successfully!');
        
        // Create ResumeData object from response
        const resumeData: ResumeData = {
          id: response.resume_id,
          filename: file.name,
          content: '', // We don't store the full content in frontend
          parsed_data: response.parsed_data,
          uploaded_at: new Date().toISOString(),
        };
        
        onResumeUploaded(resumeData);
      } else {
        setUploadError(response.message || 'Failed to upload resume.');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      setUploadError('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeCurrentResume = () => {
    onResumeUploaded(null as any);
    setUploadSuccess('');
    setUploadError('');
    setShowResumeDetails(false);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Resume Upload</span>
        </h3>
        {currentResume && (
          <button
            onClick={removeCurrentResume}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Remove current resume"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {currentResume ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-800">Resume Uploaded</span>
              </div>
              <button
                onClick={() => setShowResumeDetails(!showResumeDetails)}
                className="btn-secondary flex items-center space-x-2 text-sm"
                title={showResumeDetails ? 'Hide details' : 'Show details'}
              >
                <Eye className="w-4 h-4" />
                <span>{showResumeDetails ? 'Hide' : 'View'} Details</span>
              </button>
            </div>
            <p className="text-green-700 text-sm mb-2">
              <strong>File:</strong> {currentResume.filename}
            </p>
            {currentResume.parsed_data.name && (
              <p className="text-green-700 text-sm">
                <strong>Name:</strong> {currentResume.parsed_data.name}
              </p>
            )}
            <p className="text-green-600 text-xs mt-2">
              AI will now generate personalized questions based on your resume.
            </p>
          </div>

          {showResumeDetails && (
            <ResumeDisplay 
              resume={currentResume} 
              onRemove={removeCurrentResume}
            />
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="space-y-4">
              <Loader className="w-12 h-12 mx-auto text-primary-500 animate-spin" />
              <p className="text-gray-600">Uploading and parsing resume...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Upload your resume for personalized questions
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your resume here, or click to browse
                </p>
                <button
                  onClick={openFileDialog}
                  className="btn-primary"
                  disabled={isUploading}
                >
                  Choose File
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Supports PDF, DOC, DOCX, and TXT files (max 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">Upload Error</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{uploadError}</p>
        </div>
      )}

      {uploadSuccess && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 font-medium">Success</span>
          </div>
          <p className="text-green-600 text-sm mt-1">{uploadSuccess}</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Benefits of uploading your resume:</p>
        <ul className="space-y-1 text-xs">
          <li>• Get questions tailored to your experience and skills</li>
          <li>• AI will reference your background in feedback</li>
          <li>• More relevant technical questions based on your tech stack</li>
          <li>• Personalized behavioral questions from your work history</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUpload;
