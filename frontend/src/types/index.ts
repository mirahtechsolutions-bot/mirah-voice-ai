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

export type InterviewMode = 'hr' | 'technical' | 'behavioral';
