import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react';
import { OllamaStatus as OllamaStatusType } from '../types';
import { apiService } from '../services/api';

interface OllamaStatusProps {
  onClose: () => void;
}

const OllamaStatus: React.FC<OllamaStatusProps> = ({ onClose }) => {
  const [status, setStatus] = useState<OllamaStatusType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      setIsLoading(true);
      setError('');
      const statusData = await apiService.checkOllamaStatus();
      setStatus(statusData);
    } catch (err) {
      setError('Failed to check Ollama status');
      console.error('Error checking Ollama status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader className="w-6 h-6 animate-spin text-blue-500" />;
    if (error) return <AlertCircle className="w-6 h-6 text-red-500" />;
    if (status?.status === 'success') return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (status?.status === 'warning') return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    return <AlertCircle className="w-6 h-6 text-red-500" />;
  };

  const getStatusColor = () => {
    if (isLoading) return 'text-blue-600';
    if (error) return 'text-red-600';
    if (status?.status === 'success') return 'text-green-600';
    if (status?.status === 'warning') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Ollama Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
                {isLoading ? 'Checking Status...' : 
                 error ? 'Connection Failed' :
                 status?.status === 'success' ? 'All Systems Operational' :
                 status?.status === 'warning' ? 'Partial Setup' : 'Setup Required'}
              </h3>
              <p className="text-gray-600 text-sm">
                {isLoading ? 'Verifying Ollama configuration...' :
                 error ? 'Unable to connect to Ollama service' :
                 status?.message || 'Checking system status...'}
              </p>
            </div>
          </div>

          {status && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Ollama Service</h4>
                  <div className="flex items-center space-x-2">
                    {status.ollama_running ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={status.ollama_running ? 'text-green-600' : 'text-red-600'}>
                      {status.ollama_running ? 'Running' : 'Not Running'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Llama3 Model</h4>
                  <div className="flex items-center space-x-2">
                    {status.llama3_available ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={status.llama3_available ? 'text-green-600' : 'text-red-600'}>
                      {status.llama3_available ? 'Available' : 'Not Found'}
                    </span>
                  </div>
                </div>
              </div>

              {status.available_models && status.available_models.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Available Models</h4>
                  <div className="flex flex-wrap gap-2">
                    {status.available_models.map((model, index) => (
                      <span
                        key={index}
                        className="bg-white px-3 py-1 rounded-full text-sm border"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Setup Instructions</h4>
            <div className="text-sm text-blue-700 space-y-2">
              <p>To get the best AI experience with Mirah Voice:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">ollama.ai</a></li>
                <li>Run: <code className="bg-blue-100 px-2 py-1 rounded">ollama pull llama3</code></li>
                <li>Start Ollama service: <code className="bg-blue-100 px-2 py-1 rounded">ollama serve</code></li>
                <li>Refresh this status to verify setup</li>
              </ol>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={checkStatus}
              disabled={isLoading}
              className="btn-secondary flex items-center space-x-2"
            >
              <Loader className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            
            <a
              href="https://ollama.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Ollama</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OllamaStatus;
