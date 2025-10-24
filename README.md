# 🎤 Mirah Voice - AI-Powered Voice Interview Helper

A free, open-source AI-powered voice interview helper built with **React TypeScript**, **Tailwind CSS**, and **Python FastAPI** backend using **Ollama with Llama3** for local AI processing.

## ✨ Features

- **Voice Input**: Speak your answers using your microphone with real-time transcription
- **Resume Upload**: Upload your resume for personalized, contextual interview questions
- **Local AI**: Powered by Ollama with Llama3 model - completely free and private
- **Multiple Interview Modes**: HR, Technical, and Behavioral questions
- **Text-to-Speech**: Listen to questions and AI feedback
- **TypeScript Frontend**: Modern React with full type safety
- **Tailwind CSS**: Beautiful, responsive design
- **Python Backend**: FastAPI with async support
- **Resume Parsing**: AI-powered resume analysis and structured data extraction
- **Contextual Feedback**: AI feedback tailored to your background and experience
- **Real-time Status**: Check Ollama and model availability
- **Fallback Mode**: Works even without Ollama setup
- **Free & Open Source**: No API costs, completely local

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Ollama** (for local AI - optional but recommended)
- Modern browser with microphone support (Chrome/Edge recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MirahVoiceAiInterviewHelper
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up Ollama (Recommended)**
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull Llama3 model
   ollama pull llama3
   
   # Start Ollama service
   ollama serve
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 🎯 How to Use

1. **Upload Your Resume** (Optional but Recommended): Upload your resume for personalized questions
2. **Choose Interview Mode**: Select from HR, Technical, or Behavioral questions
3. **Get a Question**: Click the refresh button to get a new interview question
4. **Record Your Answer**: Click the microphone button and speak your answer, or type manually
5. **Submit**: Click "Submit Answer" to get AI feedback
6. **Review Feedback**: Read and listen to the AI's suggestions for improvement
7. **Practice More**: Get new questions and continue practicing

### Resume Upload Benefits:
- **Personalized Questions**: Get questions tailored to your experience and skills
- **Contextual Feedback**: AI references your background in feedback
- **Relevant Examples**: Questions based on your actual work history
- **Skill-Specific**: Technical questions match your tech stack

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with TypeScript
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vite**: Fast build tool and development server
- **Web Speech API**: Browser-native speech recognition
- **Web Speech Synthesis**: Text-to-speech functionality
- **Lucide React**: Beautiful, customizable icons
- **Axios**: HTTP client for API requests

### Backend
- **Python 3.8+**: Modern Python runtime
- **FastAPI**: High-performance async web framework
- **Ollama**: Local AI model runner
- **Llama3**: Meta's open-source large language model
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server for FastAPI
- **PyPDF2**: PDF text extraction
- **python-docx**: Word document processing
- **aiofiles**: Async file operations

## 📁 Project Structure

```
MirahVoiceAiInterviewHelper/
├── frontend/              # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript type definitions
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── public/           # Static files
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.ts    # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS config
│   └── tsconfig.json     # TypeScript config
├── backend/              # Python FastAPI backend
│   ├── main.py          # FastAPI application
│   ├── setup_ollama.py  # Ollama setup script
│   ├── requirements.txt # Python dependencies
│   └── env.example      # Environment variables template
├── package.json         # Root package.json
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory (optional):

```env
# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3

# Server Configuration
PORT=8000
HOST=0.0.0.0
NODE_ENV=development

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Note**: The application works without environment variables using default settings.

### Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Limited speech recognition support
- **Safari**: Limited speech recognition support
- **Mobile**: Works on modern mobile browsers

## 🚀 Deployment

### Free Deployment Options

#### Frontend (Vercel - Recommended)
1. **Connect your GitHub repository to Vercel**
2. **Set build settings in Vercel:**
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm run install-all`
3. **Deploy**: Vercel will automatically build and deploy your frontend

#### Frontend (Netlify)
1. Build the React app: `cd frontend && npm run build`
2. Deploy the `frontend/dist` folder to Netlify
3. Set environment variables in your hosting platform

#### Backend (Railway/Heroku)
1. Deploy the `backend` folder to Railway or Heroku
2. Set the `OLLAMA_HOST` environment variable (if using external Ollama)
3. Update the frontend API URL to point to your deployed backend

#### Full Stack (Docker)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Speech Recognition Not Working**
   - Ensure you're using Chrome or Edge
   - Check microphone permissions
   - Try refreshing the page

2. **Ollama Connection Issues**
   - Make sure Ollama is installed and running: `ollama serve`
   - Verify Llama3 model is installed: `ollama pull llama3`
   - Check if Ollama is accessible at http://localhost:11434
   - Use the Status button in the app to check Ollama status

3. **Python Backend Issues**
   - Ensure Python 3.8+ is installed
   - Install dependencies: `pip install -r backend/requirements.txt`
   - Check if port 8000 is available
   - Verify FastAPI is running: http://localhost:8000

4. **Frontend Build Issues**
   - Ensure Node.js 18+ is installed
   - Install dependencies: `cd frontend && npm install`
   - Check if port 3000 is available
   - Clear node_modules and reinstall if needed

5. **Microphone Permission Denied**
   - Allow microphone access in your browser
   - Check system microphone permissions
   - Try using a different browser

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Create a new issue with detailed information
- Include browser version and error messages

## 🎉 Acknowledgments

- **Ollama** for providing local AI model hosting
- **Meta** for the open-source Llama3 model
- **React team** for the amazing framework
- **FastAPI** for the high-performance Python web framework
- **Tailwind CSS** for the utility-first CSS framework
- **Web Speech API** for browser-native speech features
- All contributors and users of this project

---

**Made with ❤️ by MirahTech**

*Practice makes perfect! Start your interview preparation journey with Mirah Voice.*
