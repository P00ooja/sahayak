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

# Import and include feature routers
from routes_settings import router as settings_router
from routes_lesson_planner import router as lesson_planner_router

app.include_router(settings_router)
app.include_router(lesson_planner_router)


# ============ HEALTH CHECK ============

@app.get("/api/health")
async def health():
    """Check if backend is running"""
    return {
        "status": "ok",
        "version": "0.1.0",
        "debug": DEBUG
    }

def prune_old_chats(conn, max_unsaved: int = 15):
    """Prune unsaved chats beyond the 15 most recent"""
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id FROM chats 
            WHERE is_saved = 0 OR is_saved IS NULL
            ORDER BY updated_at DESC
            LIMIT -1 OFFSET ?
        """, (max_unsaved,))
        old_chats = cursor.fetchall()
        
        for row in old_chats:
            old_id = row[0] if isinstance(row, tuple) else row.get("id")
            cursor.execute("DELETE FROM messages WHERE chat_id = ?", (old_id,))
            cursor.execute("DELETE FROM chats WHERE id = ?", (old_id,))
        conn.commit()
    except Exception as e:
        print(f"Error pruning chats: {e}")

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
            "INSERT INTO chats (id, title, is_saved) VALUES (?, ?, 0)",
            (chat_id, title)
        )
        prune_old_chats(conn, max_unsaved=15)
        conn.commit()
        conn.close()
        
        return {
            "chat_id": chat_id,
            "title": title,
            "is_saved": False,
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
        
        # 1. Fetch previous conversation history for this chat session
        conn = get_connection()
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        cursor.execute(
            "SELECT question, answer FROM messages WHERE chat_id = ? ORDER BY created_at ASC",
            (chat_id,)
        )
        history = cursor.fetchall()
        conn.close()

        # 2. Call AI router with question and history
        from ai_router import get_answer
        ai_response = await get_answer(question, history=history)
        
        answer = ai_response["answer"]
        offline = ai_response["offline"]
        model = ai_response["model"]
        
        message_id = str(uuid.uuid4())
        
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO messages (id, chat_id, question, answer, offline, model) 
               VALUES (?, ?, ?, ?, ?, ?)""",
            (message_id, chat_id, question, answer, offline, model)
        )
        
        # Auto-update title on first question and refresh updated_at timestamp
        new_title = question.strip()
        if len(new_title) > 30:
            new_title = new_title[:30] + "..."
            
        cursor.execute("SELECT title, (SELECT COUNT(*) FROM messages WHERE chat_id = ?) as msg_count FROM chats WHERE id = ?", (chat_id, chat_id))
        chat_row = cursor.fetchone()
        
        if chat_row:
            current_title = chat_row[0] if isinstance(chat_row, tuple) else chat_row.get("title")
            msg_count = chat_row[1] if isinstance(chat_row, tuple) else chat_row.get("msg_count", 0)
            
            if msg_count <= 1 or (current_title and current_title.startswith("Chat ")):
                cursor.execute(
                    "UPDATE chats SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                    (new_title, chat_id)
                )
            else:
                cursor.execute(
                    "UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                    (chat_id,)
                )
                
        prune_old_chats(conn, max_unsaved=15)
        conn.commit()
        conn.close()

        return {
            "message_id": message_id,
            "chat_id": chat_id,
            "question": question,
            "answer": answer,
            "offline": offline,
            "model": model,
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
            "is_saved": bool(chat.get("is_saved")),
            "created_at": chat.get("created_at"),
            "messages": messages
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/qa/chats")
async def list_chats():
    """List all chats ordered by pinned first, then updated time"""
    try:
        conn = get_connection()
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id AS chat_id, id, title, is_saved, created_at, updated_at 
            FROM chats 
            ORDER BY is_saved DESC, updated_at DESC
        """)
        chats = cursor.fetchall()
        
        conn.close()
        
        return {"chats": chats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/qa/chats/{chat_id}/toggle-save")
async def toggle_save_chat(chat_id: str):
    """Toggle saved/pinned status of a chat"""
    try:
        conn = get_connection()
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute("SELECT is_saved FROM chats WHERE id = ?", (chat_id,))
        chat = cursor.fetchone()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        current_saved = chat[0] if isinstance(chat, tuple) else chat.get("is_saved", 0)
        new_saved = 0 if current_saved else 1
        
        cursor.execute("UPDATE chats SET is_saved = ? WHERE id = ?", (new_saved, chat_id))
        conn.commit()
        conn.close()
        
        return {"chat_id": chat_id, "is_saved": bool(new_saved)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============ STARTUP ============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)