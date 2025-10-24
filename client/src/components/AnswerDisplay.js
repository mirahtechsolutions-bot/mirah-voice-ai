import React from 'react';
import { Volume2, VolumeX, User, Bot } from 'lucide-react';

const AnswerDisplay = ({ 
  userAnswer, 
  aiFeedback, 
  isLoading, 
  error, 
  onSpeakFeedback, 
  onStopSpeaking, 
  isSpeaking 
}) => {
  if (!userAnswer && !aiFeedback && !error && !isLoading) {
    return (
      <div className="answer-card">
        <h3 style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          Your answer and AI feedback will appear here
        </h3>
      </div>
    );
  }

  return (
    <div className="answer-card">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {userAnswer && (
        <div className="answer-section">
          <h4 className="answer-title">
            <User size={20} />
            Your Answer
          </h4>
          <div className="answer-content">
            {userAnswer}
          </div>
        </div>
      )}

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-spinner"></div>
          <p style={{ color: '#666', marginTop: '1rem' }}>
            AI is analyzing your answer...
          </p>
        </div>
      )}

      {aiFeedback && (
        <div className="answer-section">
          <h4 className="answer-title">
            <Bot size={20} />
            AI Feedback
            <button
              className="btn btn-secondary"
              onClick={isSpeaking ? onStopSpeaking : onSpeakFeedback}
              style={{ marginLeft: 'auto', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              title={isSpeaking ? 'Stop speaking' : 'Listen to feedback'}
            >
              {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </h4>
          <div className="answer-content feedback-content">
            {aiFeedback.split('\n').map((paragraph, index) => (
              <p key={index} style={{ marginBottom: paragraph.trim() ? '1rem' : '0' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerDisplay;
