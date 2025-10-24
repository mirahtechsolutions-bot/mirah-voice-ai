import React from 'react';
import { Settings, Mic } from 'lucide-react';

interface HeaderProps {
  onShowOllamaStatus: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowOllamaStatus }) => {
  return (
    <header className="glass-card mx-4 mt-4 sticky top-4 z-50">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Mirah Voice
            </h1>
            <p className="text-sm text-gray-600">
              AI-Powered Voice Interview Helper
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-green-600 font-medium flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Free & Open Source
          </span>
          
          <button
            onClick={onShowOllamaStatus}
            className="btn-secondary flex items-center space-x-2"
            title="Check Ollama Status"
          >
            <Settings className="w-4 h-4" />
            <span>Status</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
