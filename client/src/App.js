import React, { useState, useEffect } from 'react';
import './App.css';
import VoiceRecorder from './components/VoiceRecorder';
import InterviewModeSelector from './components/InterviewModeSelector';
import QuestionDisplay from './components/QuestionDisplay';
import AnswerDisplay from './components/AnswerDisplay';
import Header from './components/Header';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

function App() {
  const [currentMode, setCurrentMode] = useState('hr');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
    
    // Load initial question
    loadNewQuestion();
  }, [currentMode]);

  const loadNewQuestion = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(`/api/question/${currentMode}`);
      const data = await response.json();
      setCurrentQuestion(data.question);
      setUserAnswer('');
      setAiFeedback('');
    } catch (err) {
      setError('Failed to load question. Please try again.');
      console.error('Error loading question:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (answer) => {
    if (!answer.trim()) {
      setError('Please provide an answer before submitting.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setUserAnswer(answer);

      const response = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAnswer: answer,
          question: currentQuestion,
          interviewType: currentMode
        }),
      });

      const data = await response.json();
      setAiFeedback(data.feedback);
    } catch (err) {
      setError('Failed to get AI feedback. Please try again.');
      console.error('Error getting feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text) => {
    if (!speechSynthesis || !text) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <InterviewModeSelector 
            currentMode={currentMode}
            onModeChange={setCurrentMode}
          />

          <div className="interview-section">
            <QuestionDisplay 
              question={currentQuestion}
              isLoading={isLoading}
              onNewQuestion={loadNewQuestion}
              onSpeak={() => speakText(currentQuestion)}
              isSpeaking={isSpeaking}
            />

            <VoiceRecorder 
              onAnswerSubmit={handleAnswerSubmit}
              isListening={isListening}
              setIsListening={setIsListening}
              isLoading={isLoading}
            />

            <AnswerDisplay 
              userAnswer={userAnswer}
              aiFeedback={aiFeedback}
              isLoading={isLoading}
              error={error}
              onSpeakFeedback={() => speakText(aiFeedback)}
              onStopSpeaking={stopSpeaking}
              isSpeaking={isSpeaking}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
