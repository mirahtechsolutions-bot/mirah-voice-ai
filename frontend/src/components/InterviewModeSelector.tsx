import React from 'react';
import { InterviewMode } from '../types';

interface InterviewModeSelectorProps {
  currentMode: InterviewMode;
  onModeChange: (mode: InterviewMode) => void;
}

const InterviewModeSelector: React.FC<InterviewModeSelectorProps> = ({ 
  currentMode, 
  onModeChange 
}) => {
  const modes = [
    { 
      id: 'hr' as InterviewMode, 
      name: 'HR Questions', 
      description: 'General interview questions about experience, motivation, and fit',
      icon: '👥'
    },
    { 
      id: 'technical' as InterviewMode, 
      name: 'Technical', 
      description: 'Programming, system design, and technical skills',
      icon: '💻'
    },
    { 
      id: 'behavioral' as InterviewMode, 
      name: 'Behavioral', 
      description: 'Situational and experience-based questions',
      icon: '🎯'
    }
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Choose Interview Mode
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map(mode => (
          <button
            key={mode.id}
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              currentMode === mode.id
                ? 'border-primary-500 bg-primary-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
            }`}
            onClick={() => onModeChange(mode.id)}
            title={mode.description}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{mode.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-800">{mode.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{mode.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InterviewModeSelector;
