import React from 'react';

const InterviewModeSelector = ({ currentMode, onModeChange }) => {
  const modes = [
    { id: 'hr', name: 'HR Questions', description: 'General interview questions' },
    { id: 'technical', name: 'Technical', description: 'Programming & tech skills' },
    { id: 'behavioral', name: 'Behavioral', description: 'Situational & experience-based' }
  ];

  return (
    <div className="mode-selector">
      <h3>Choose Interview Mode</h3>
      <div className="mode-buttons">
        {modes.map(mode => (
          <button
            key={mode.id}
            className={`mode-button ${currentMode === mode.id ? 'active' : ''}`}
            onClick={() => onModeChange(mode.id)}
            title={mode.description}
          >
            {mode.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InterviewModeSelector;
