from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import ollama
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mirah Voice API",
    description="AI-powered voice interview helper backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class InterviewRequest(BaseModel):
    user_answer: str
    question: str
    interview_type: str

class InterviewResponse(BaseModel):
    success: bool
    feedback: str
    original_answer: str
    question: str
    fallback: Optional[bool] = False

class QuestionResponse(BaseModel):
    question: str
    type: str

class InterviewTypeResponse(BaseModel):
    id: str
    name: str
    question_count: int

# Interview question templates
INTERVIEW_QUESTIONS = {
    "hr": [
        "Tell me about yourself and your background.",
        "What are your greatest strengths and weaknesses?",
        "Why do you want to work for our company?",
        "Where do you see yourself in 5 years?",
        "Describe a challenging situation you faced and how you overcame it.",
        "What motivates you in your work?",
        "How do you handle stress and pressure?",
        "What's your ideal work environment?",
        "Tell me about a time you had to work with a difficult team member.",
        "What questions do you have for us?",
        "How do you prioritize your work when you have multiple deadlines?",
        "Describe a time when you had to learn something new quickly.",
        "What's your approach to working in a team?",
        "How do you handle constructive criticism?",
        "What's the most important thing you've learned in your career?"
    ],
    "technical": [
        "Explain a complex technical concept to a non-technical person.",
        "How do you approach debugging a problem you've never seen before?",
        "Describe your experience with version control systems.",
        "What's your preferred programming language and why?",
        "How do you stay updated with the latest technology trends?",
        "Explain the difference between frontend and backend development.",
        "How do you ensure code quality in your projects?",
        "Describe a time when you had to learn a new technology quickly.",
        "What's your experience with databases and data modeling?",
        "How do you handle technical debt in your projects?",
        "Explain the concept of RESTful APIs.",
        "How do you approach testing in your development process?",
        "What's your experience with cloud platforms?",
        "How do you handle performance optimization?",
        "Describe your experience with agile development methodologies."
    ],
    "behavioral": [
        "Tell me about a time you failed and what you learned from it.",
        "Describe a situation where you had to meet a tight deadline.",
        "Give me an example of when you had to work with limited resources.",
        "Tell me about a time you had to adapt to a significant change.",
        "Describe a situation where you had to persuade someone to see your point of view.",
        "Tell me about a time you had to work with someone you didn't get along with.",
        "Give me an example of when you took initiative on a project.",
        "Describe a time when you had to make a difficult decision.",
        "Tell me about a time you had to learn something new quickly.",
        "Give me an example of when you had to work under pressure.",
        "Describe a time when you had to resolve a conflict in your team.",
        "Tell me about a time you had to present to a large group.",
        "Give me an example of when you had to manage multiple priorities.",
        "Describe a time when you had to implement feedback from others.",
        "Tell me about a time you had to work with a difficult client or stakeholder."
    ]
}

# Initialize Ollama client
try:
    ollama_client = ollama.Client()
    logger.info("Ollama client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Ollama client: {e}")
    ollama_client = None

@app.get("/")
async def root():
    return {"message": "Mirah Voice API is running", "status": "healthy"}

@app.get("/api/health")
async def health_check():
    return {"status": "OK", "message": "Mirah Voice API is running"}

@app.get("/api/question/{question_type}", response_model=QuestionResponse)
async def get_random_question(question_type: str):
    """Get a random interview question of the specified type"""
    if question_type not in INTERVIEW_QUESTIONS:
        raise HTTPException(status_code=400, detail="Invalid interview type")
    
    questions = INTERVIEW_QUESTIONS[question_type]
    import random
    random_question = random.choice(questions)
    
    return QuestionResponse(
        question=random_question,
        type=question_type
    )

@app.get("/api/interview-types", response_model=List[InterviewTypeResponse])
async def get_interview_types():
    """Get all available interview types"""
    return [
        InterviewTypeResponse(
            id=type_id,
            name=type_id.capitalize(),
            question_count=len(questions)
        )
        for type_id, questions in INTERVIEW_QUESTIONS.items()
    ]

@app.post("/api/generate-answer", response_model=InterviewResponse)
async def generate_ai_feedback(request: InterviewRequest):
    """Generate AI feedback for user's interview answer"""
    try:
        if not request.user_answer or not request.question:
            raise HTTPException(status_code=400, detail="User answer and question are required")

        # Create the prompt for the AI
        prompt = f"""You are an expert interview coach. The candidate was asked: "{request.question}"

The candidate answered: "{request.user_answer}"

Please provide:
1. A brief assessment of their answer (what they did well, what could be improved)
2. A suggested improved answer that demonstrates best practices
3. Key points they should have covered
4. Tips for similar questions in the future

Keep the response concise, constructive, and helpful. Format it as a coaching response."""

        # Try to use Ollama with Llama3
        if ollama_client:
            try:
                response = ollama_client.chat(
                    model='llama3',
                    messages=[
                        {
                            'role': 'system',
                            'content': 'You are a professional interview coach who provides constructive feedback and helps candidates improve their interview skills.'
                        },
                        {
                            'role': 'user',
                            'content': prompt
                        }
                    ]
                )
                ai_feedback = response['message']['content']
                logger.info("Successfully generated feedback using Ollama Llama3")
                
            except Exception as ollama_error:
                logger.warning(f"Ollama request failed: {ollama_error}")
                ai_feedback = get_fallback_response(request.user_answer, request.question)
        else:
            logger.warning("Ollama client not available, using fallback response")
            ai_feedback = get_fallback_response(request.user_answer, request.question)

        return InterviewResponse(
            success=True,
            feedback=ai_feedback,
            original_answer=request.user_answer,
            question=request.question,
            fallback=ollama_client is None
        )

    except Exception as e:
        logger.error(f"Error generating AI response: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate AI feedback")

def get_fallback_response(user_answer: str, question: str) -> str:
    """Provide a fallback response when AI is not available"""
    return f"""Thank you for your answer. Here are some general tips for interview success:

**Assessment of Your Answer:**
Your response shows engagement with the question. Here are some areas to consider:

**Key Points to Cover:**
1. Use the STAR method (Situation, Task, Action, Result) for behavioral questions
2. Be specific with examples and quantify your achievements when possible
3. Show enthusiasm and genuine interest in the role
4. Ask thoughtful questions about the company and role
5. Practice active listening and stay focused on the question asked

**Tips for Similar Questions:**
- Prepare 3-5 specific examples from your experience
- Practice your responses out loud
- Research the company and role beforehand
- Be authentic and honest in your responses
- Show how your experience relates to the role

Keep practicing and you'll continue to improve!"""

@app.get("/api/ollama-status")
async def check_ollama_status():
    """Check if Ollama is running and Llama3 model is available"""
    try:
        if not ollama_client:
            return {"status": "error", "message": "Ollama client not initialized"}
        
        # Check if Llama3 model is available
        models = ollama_client.list()
        llama3_available = any('llama3' in model['name'] for model in models['models'])
        
        return {
            "status": "success" if llama3_available else "warning",
            "ollama_running": True,
            "llama3_available": llama3_available,
            "available_models": [model['name'] for model in models['models']],
            "message": "Llama3 model is available" if llama3_available else "Llama3 model not found. Please install it."
        }
    except Exception as e:
        return {
            "status": "error",
            "ollama_running": False,
            "llama3_available": False,
            "message": f"Ollama connection failed: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
