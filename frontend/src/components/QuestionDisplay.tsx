import React from 'react';
import { RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { QuestionResponse } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface QuestionDisplayProps {
  question: QuestionResponse | null;
  isLoading: boolean;
  onNewQuestion: () => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  question, 
  isLoading, 
  onNewQuestion 
}) => {
  const { isSpeaking, speak, stop, isSupported } = useSpeechSynthesis();

  const handleSpeak = () => {
    if (question?.question) {
      if (isSpeaking) {
        stop();
      } else {
        speak(question.question);
      }
    }
  };

  return (
    <div className="glass-card p-6 min-h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Interview Question
        </h3>
        <div className="flex items-center space-x-2">
          {isSupported && question?.question && (
            <button
              onClick={handleSpeak}
              disabled={isLoading}
              className="btn-secondary flex items-center space-x-2"
              title={isSpeaking ? 'Stop speaking' : 'Listen to question'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={onNewQuestion}
            disabled={isLoading}
            className="btn-secondary flex items-center space-x-2"
            title="Get new question"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading new question...</p>
          </div>
        ) : question ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              {question.question}
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Mode: <span className="font-medium capitalize">{question.type}</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>Click the refresh button to get a new question.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
