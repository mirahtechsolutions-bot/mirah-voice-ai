import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

const VoiceRecorder = ({ onAnswerSubmit, isListening, setIsListening, isLoading }) => {
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      initializeSpeechRecognition();
    } else {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          setError('No microphone found. Please check your microphone.');
          break;
        case 'not-allowed':
          setError('Microphone permission denied. Please allow microphone access.');
          break;
        case 'network':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError('Speech recognition failed. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  };

  const startListening = () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (recognitionRef.current) {
      setTranscript('');
      setError('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onAnswerSubmit(transcript);
    }
  };

  const handleManualInput = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="voice-recorder">
      <h3 className="recorder-title">Your Answer</h3>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <button
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={isListening ? stopListening : startListening}
        disabled={!isSupported || isLoading}
        title={isListening ? 'Stop recording' : 'Start recording'}
      >
        {isListening ? <MicOff /> : <Mic />}
      </button>

      <div className="recorder-status">
        {isListening ? 'Listening... Speak now' : 'Click the microphone to start recording'}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={handleManualInput}
          placeholder="Your answer will appear here, or you can type manually..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '1rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.3s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={!transcript.trim() || isLoading}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
      >
        <Send size={16} />
        {isLoading ? 'Processing...' : 'Submit Answer'}
      </button>

      <div className="recorder-instructions">
        <p>
          <strong>Instructions:</strong><br />
          • Click the microphone to record your answer<br />
          • Speak clearly and at a normal pace<br />
          • You can also type your answer manually<br />
          • Press Enter to submit (Shift+Enter for new line)
        </p>
      </div>
    </div>
  );
};

export default VoiceRecorder;
