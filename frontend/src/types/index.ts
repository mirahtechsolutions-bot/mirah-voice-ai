export interface InterviewType {
  id: string;
  name: string;
  questionCount: number;
}

export interface QuestionResponse {
  question: string;
  type: string;
}

export interface InterviewRequest {
  user_answer: string;
  question: string;
  interview_type: string;
  resume_context?: ResumeData['parsed_data'];
}

export interface InterviewResponse {
  success: boolean;
  feedback: string;
  original_answer: string;
  question: string;
  fallback?: boolean;
}

export interface OllamaStatus {
  status: string;
  ollama_running: boolean;
  llama3_available: boolean;
  available_models: string[];
  message: string;
}

export interface ResumeData {
  id: string;
  filename: string;
  content: string;
  parsed_data: {
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
    experience?: Array<{
      company: string;
      position: string;
      duration: string;
      description: string;
    }>;
    education?: Array<{
      institution: string;
      degree: string;
      year: string;
    }>;
    skills?: string[];
    projects?: Array<{
      name: string;
      description: string;
      technologies: string[];
    }>;
  };
  uploaded_at: string;
}

export interface ResumeUploadResponse {
  success: boolean;
  resume_id: string;
  parsed_data: ResumeData['parsed_data'];
  message: string;
}

export type InterviewMode = 'hr' | 'technical' | 'behavioral';
