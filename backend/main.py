from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import ollama
import logging

app = FastAPI()

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return {"error": "No message provided"}

        # Call Ollama
        response = ollama.chat(
            model="llama3.2:1b",
            messages=[{"role": "user", "content": user_message}]
        )

        # Safe extraction
        content = response.get("message", {}).get("content", "")
        if not content:
            content = "Sorry, I couldn't generate a response."

        return {"response": content}

    except Exception as e:
        logging.error(f"Chat error: {e}")
        return {"error": "Something went wrong on the server."}

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}
