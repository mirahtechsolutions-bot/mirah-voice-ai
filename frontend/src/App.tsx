import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InterviewModeSelector from './components/InterviewModeSelector';
import QuestionDisplay from './components/QuestionDisplay';
import VoiceRecorder from './components/VoiceRecorder';
import AnswerDisplay from './components/AnswerDisplay';
import OllamaStatus from './components/OllamaStatus';
import { InterviewMode, QuestionResponse, InterviewResponse } from './types';
import { apiService } from './services/api';

function App() {
  const [currentMode, setCurrentMode] = useState<InterviewMode>('hr');
  const [currentQuestion, setCurrentQuestion] = useState<QuestionResponse | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState<InterviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOllamaStatus, setShowOllamaStatus] = useState(false);

  useEffect(() => {
    loadNewQuestion();
  }, [currentMode]);

  const loadNewQuestion = async () => {
    try {
      setIsLoading(true);
      setError('');
      const question = await apiService.getRandomQuestion(currentMode);
      setCurrentQuestion(question);
      setUserAnswer('');
      setAiFeedback(null);
    } catch (err) {
      setError('Failed to load question. Please try again.');
      console.error('Error loading question:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    if (!answer.trim()) {
      setError('Please provide an answer before submitting.');
      return;
    }

    if (!currentQuestion) {
      setError('No question available. Please load a new question.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setUserAnswer(answer);

      const response = await apiService.generateFeedback({
        user_answer: answer,
        question: currentQuestion.question,
        interview_type: currentMode,
      });

      setAiFeedback(response);
    } catch (err) {
      setError('Failed to get AI feedback. Please try again.');
      console.error('Error getting feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-600">
      <Header onShowOllamaStatus={() => setShowOllamaStatus(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <InterviewModeSelector 
            currentMode={currentMode}
            onModeChange={setCurrentMode}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <QuestionDisplay 
                question={currentQuestion}
                isLoading={isLoading}
                onNewQuestion={loadNewQuestion}
              />

              <VoiceRecorder 
                onAnswerSubmit={handleAnswerSubmit}
                isLoading={isLoading}
              />
            </div>

            <div className="space-y-6">
              <AnswerDisplay 
                userAnswer={userAnswer}
                aiFeedback={aiFeedback}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </main>

      {showOllamaStatus && (
        <OllamaStatus onClose={() => setShowOllamaStatus(false)} />
      )}
    </div>
  );
}

export default App;
