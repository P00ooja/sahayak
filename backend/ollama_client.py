import asyncio
import requests
from config import OLLAMA_HOST, OLLAMA_MODEL
from prompts import OLLAMA_PROMPT, format_history_string

def _sync_call_ollama(question: str, history: list = None) -> str:
    history_str = format_history_string(history or [], max_turns=5)

    prompt = OLLAMA_PROMPT.format(history=history_str, question=question)
    
    # Adjust max output tokens dynamically based on question intent
    q = question.lower()
    is_list_request = any(kw in q for kw in [
        "top ", "list", "formula", "formulas", "all ", "steps", "types of",
        "give me", "write all", "write the", "show all", "show me"
    ])
    is_detail_request = any(kw in q for kw in [
        "detail", "explain", "lesson plan", "example", "elaborate", "in depth"
    ])

    if is_list_request or is_detail_request:
        max_tokens = 700
    else:
        max_tokens = 200


    response = requests.post(
        f"{OLLAMA_HOST}/api/generate",
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_predict": max_tokens,
                "temperature": 0.3
            }
        },
        timeout=90
    )
    
    if response.status_code == 200:
        data = response.json()
        return data.get("response", "No response from Ollama").strip()
    else:
        return f"Error: {response.status_code}"


async def call_ollama(question: str, history: list = None) -> str:
    """Call Ollama locally for offline response"""
    try:
        return await asyncio.to_thread(_sync_call_ollama, question, history)
    except Exception as e:
        return f"Ollama error: {str(e)}"