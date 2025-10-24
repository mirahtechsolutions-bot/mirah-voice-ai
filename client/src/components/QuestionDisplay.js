import React from 'react';
import { RefreshCw, Volume2, VolumeX } from 'lucide-react';

const QuestionDisplay = ({ 
  question, 
  isLoading, 
  onNewQuestion, 
  onSpeak, 
  isSpeaking 
}) => {
  return (
    <div className="question-card">
      <div className="question-header">
        <h3 className="question-title">Interview Question</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary"
            onClick={onSpeak}
            disabled={!question || isSpeaking}
            title="Listen to question"
          >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onNewQuestion}
            disabled={isLoading}
            title="Get new question"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      
      <div className="question-content">
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <p className="question-text">
            {question || 'Click the refresh button to get a new question.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
