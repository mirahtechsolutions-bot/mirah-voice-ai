import axios from 'axios';
import { QuestionResponse, InterviewRequest, InterviewResponse, InterviewType, OllamaStatus, ResumeUploadResponse, ResumeData } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for AI requests
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await api.get('/health');
    return response.data;
  },

  // Get random interview question
  async getRandomQuestion(type: string): Promise<QuestionResponse> {
    const response = await api.get(`/question/${type}`);
    return response.data;
  },

  // Get all interview types
  async getInterviewTypes(): Promise<InterviewType[]> {
    const response = await api.get('/interview-types');
    return response.data;
  },

  // Generate AI feedback
  async generateFeedback(request: InterviewRequest): Promise<InterviewResponse> {
    const response = await api.post('/generate-answer', request);
    return response.data;
  },

  // Check Ollama status
  async checkOllamaStatus(): Promise<OllamaStatus> {
    const response = await api.get('/ollama-status');
    return response.data;
  },

  // Upload resume
  async uploadResume(file: File): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get uploaded resumes
  async getResumes(): Promise<ResumeData[]> {
    const response = await api.get('/resumes');
    return response.data;
  },

  // Delete resume
  async deleteResume(resumeId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/resumes/${resumeId}`);
    return response.data;
  },
};

export default api;
