from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Sahayak", version="0.1.0")

# Enable CORS (allow frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import database and config after FastAPI initialization
from database import init_db, get_connection, dict_factory
from config import DEBUG

# Initialize database on startup
init_db()

# ============ HEALTH CHECK ============

@app.get("/api/health")
async def health():
    """Check if backend is running"""
    return {
        "status": "ok",
        "version": "0.1.0",
        "debug": DEBUG
    }

# ============ Q&A ENDPOINTS ============

@app.post("/api/qa/new-chat")
async def create_new_chat():
    """Create a new chat session"""
    try:
        chat_id = str(uuid.uuid4())
        title = f"Chat {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        
        conn = get_connection()
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO chats (id, title) VALUES (?, ?)",
            (chat_id, title)
        )
        conn.commit()
        conn.close()
        
        return {
            "chat_id": chat_id,
            "title": title,
            "created_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/qa/ask")
async def ask_question(data: dict):
    """Ask a question in a chat"""
    try:
        chat_id = data.get("chat_id")
        question = data.get("question")
        
        if not chat_id or not question:
            raise HTTPException(status_code=400, detail="Missing chat_id or question")
        
        # TODO: Call LLM (Ollama or Gemini)
        # For now, return placeholder
        answer = "This is a placeholder response. Week 2 Day 3 will add Ollama integration."
        
        message_id = str(uuid.uuid4())
        
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            """INSERT INTO messages (id, chat_id, question, answer, offline, model) 
               VALUES (?, ?, ?, ?, ?, ?)""",
            (message_id, chat_id, question, answer, False, "placeholder")
        )
        conn.commit()
        conn.close()
        
        return {
            "message_id": message_id,
            "chat_id": chat_id,
            "question": question,
            "answer": answer,
            "offline": False,
            "model": "placeholder",
            "created_at": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/qa/history/{chat_id}")
async def get_chat_history(chat_id: str):
    """Get all messages in a chat"""
    try:
        conn = get_connection()
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        # Get chat info
        cursor.execute("SELECT * FROM chats WHERE id = ?", (chat_id,))
        chat = cursor.fetchone()
        
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        # Get messages
        cursor.execute("SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC", (chat_id,))
        messages = cursor.fetchall()
        
        conn.close()
        
        return {
            "chat_id": chat_id,
            "title": chat.get("title"),
            "created_at": chat.get("created_at"),
            "messages": messages
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/qa/chats")
async def list_chats():
    """List all chats"""
    try:
        conn = get_connection()
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM chats ORDER BY updated_at DESC")
        chats = cursor.fetchall()
        
        conn.close()
        
        return {"chats": chats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============ STARTUP ============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)