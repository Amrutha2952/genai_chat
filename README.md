GenAI Chat 🤖

GenAI Chat is a full-stack AI chat application that demonstrates real-world AI integration in a web app. Users can interact with an advanced AI assistant powered by LLaMA 3 (1B parameters) via Ollama, with multi-session support and device-specific conversation storage.

This project highlights AI model usage, API integration, real-time chat functionality, and full-stack development.

Key Features:
AI-powered Responses: Uses LLaMA 3 via Ollama to generate human-like responses.
FastAPI Backend: Lightweight, asynchronous, and production-ready API server.
Robust Error Handling: Returns safe fallback responses when the AI fails.
CORS Enabled: Allows frontend to communicate securely with the backend during development.
Logging: Tracks errors for debugging and monitoring.

Frontend / UX:
Multi-session chat management.
Typing animations for AI responses.
Copy AI replies to clipboard.
Theme customization and responsive design.
Session-specific message storage on the device.

Backend / AI:
Backend: Python, FastAPI, Ollama AI (LLaMA 3 model)
Frontend: React, Tailwind CSS, Vite
Storage: Browser LocalStorage (per device/session)


Project Structure:
genai_project/
backend/ # FastAPI backend
main.py # API endpoints, AI integration
requirements.txt # Python dependencies
frontend/ # React frontend
public/
index.html
src/
App.jsx
main.jsx
index.css
package.json
.gitignore
README.md

Getting Started

Backend

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Runs on http://127.0.0.1:8000

Endpoints:

POST /chat → Send a user message, get AI response

GET / → Health check, returns {"message": "Backend is running 🚀"}

Frontend

cd frontend
npm install
npm run dev

Open http://localhost:5173
 in your browser

AI Model Details

Model: LLaMA 3 (1B parameters) via Ollama

Capabilities: Natural Language Understanding, Conversational AI, Text Completion

Use Cases: Virtual assistant, Q&A, educational tool, AI research demo

Future Enhancements

Real-time streaming responses for ChatGPT-style live typing.

Multi-device session sync with authentication.

Markdown code block syntax highlighting.

Deployment via Docker for production-ready hosting.

AI fine-tuning for domain-specific responses.
