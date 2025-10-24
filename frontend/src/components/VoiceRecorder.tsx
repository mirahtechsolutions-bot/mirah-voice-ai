import React, { useState } from 'react';
import { Mic, MicOff, Send, Type } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface VoiceRecorderProps {
  onAnswerSubmit: (answer: string) => void;
  isLoading: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onAnswerSubmit, 
  isLoading 
}) => {
  const [manualInput, setManualInput] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  
  const {
    transcript,
    isListening,
    isSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const currentText = isManualMode ? manualInput : transcript;
  const hasText = currentText.trim().length > 0;

  const handleSubmit = () => {
    if (hasText) {
      onAnswerSubmit(currentText);
      if (isManualMode) {
        setManualInput('');
      } else {
        resetTranscript();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleMode = () => {
    setIsManualMode(!isManualMode);
    if (!isManualMode) {
      resetTranscript();
    } else {
      setManualInput('');
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Your Answer
        </h3>
        <button
          onClick={toggleMode}
          className={`btn-secondary flex items-center space-x-2 ${
            isManualMode ? 'bg-primary-100 text-primary-700' : ''
          }`}
          title={isManualMode ? 'Switch to voice input' : 'Switch to manual input'}
        >
          <Type className="w-4 h-4" />
          <span>{isManualMode ? 'Voice' : 'Type'}</span>
        </button>
      </div>

      {speechError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {speechError}
        </div>
      )}

      {!isManualMode && (
        <div className="text-center mb-6">
          <button
            className={`voice-button ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported || isLoading}
            title={isListening ? 'Stop recording' : 'Start recording'}
          >
            {isListening ? <MicOff /> : <Mic />}
          </button>
          
          <div className="text-sm text-gray-600 mt-2">
            {isListening ? 'Listening... Speak now' : 'Click the microphone to start recording'}
          </div>
        </div>
      )}

      <div className="mb-6">
        <textarea
          value={currentText}
          onChange={(e) => isManualMode ? setManualInput(e.target.value) : undefined}
          onKeyDown={handleKeyDown}
          placeholder={
            isManualMode 
              ? "Type your answer here..." 
              : "Your answer will appear here, or you can type manually..."
          }
          className="w-full min-h-[120px] p-4 border-2 border-gray-200 rounded-xl text-base font-sans resize-y outline-none transition-colors focus:border-primary-500"
          readOnly={!isManualMode}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleSubmit}
          disabled={!hasText || isLoading}
          className="btn-primary flex items-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>{isLoading ? 'Processing...' : 'Submit Answer'}</span>
        </button>

        {hasText && (
          <button
            onClick={() => isManualMode ? setManualInput('') : resetTranscript()}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p className="font-medium mb-2">Instructions:</p>
        <ul className="space-y-1 text-xs">
          {isManualMode ? (
            <>
              <li>• Type your answer in the text area above</li>
              <li>• Press Enter to submit (Shift+Enter for new line)</li>
              <li>• Switch to voice mode for hands-free recording</li>
            </>
          ) : (
            <>
              <li>• Click the microphone to record your answer</li>
              <li>• Speak clearly and at a normal pace</li>
              <li>• You can also type manually by switching modes</li>
              <li>• Works best in Chrome or Edge browsers</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default VoiceRecorder;
