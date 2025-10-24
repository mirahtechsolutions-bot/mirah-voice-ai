import React from 'react';
import { Volume2, VolumeX, User, Bot, AlertCircle } from 'lucide-react';
import { InterviewResponse } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface AnswerDisplayProps {
  userAnswer: string;
  aiFeedback: InterviewResponse | null;
  isLoading: boolean;
  error: string;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ 
  userAnswer, 
  aiFeedback, 
  isLoading, 
  error 
}) => {
  const { isSpeaking, speak, stop, isSupported } = useSpeechSynthesis();

  const handleSpeakFeedback = () => {
    if (aiFeedback?.feedback) {
      if (isSpeaking) {
        stop();
      } else {
        speak(aiFeedback.feedback);
      }
    }
  };

  if (!userAnswer && !aiFeedback && !error && !isLoading) {
    return (
      <div className="glass-card p-6 min-h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Your answer and AI feedback will appear here</p>
          <p className="text-sm mt-2">Record or type your answer to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="glass-card p-4 border-l-4 border-red-500 bg-red-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 font-medium">Error</p>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {userAnswer && (
        <div className="glass-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-primary-600" />
            <h4 className="text-lg font-semibold text-gray-800">Your Answer</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-500">
            <p className="text-gray-700 leading-relaxed">{userAnswer}</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="glass-card p-6 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">AI is analyzing your answer...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      )}

      {aiFeedback && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-green-600" />
              <h4 className="text-lg font-semibold text-gray-800">AI Feedback</h4>
              {aiFeedback.fallback && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Fallback Mode
                </span>
              )}
            </div>
            {isSupported && (
              <button
                onClick={handleSpeakFeedback}
                className="btn-secondary flex items-center space-x-2"
                title={isSpeaking ? 'Stop speaking' : 'Listen to feedback'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <div className="prose prose-sm max-w-none">
              {aiFeedback.feedback.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          {aiFeedback.fallback && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> AI feedback is running in fallback mode. 
                For enhanced feedback, ensure Ollama with Llama3 is properly configured.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerDisplay;
