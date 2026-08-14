import requests
from config import OLLAMA_HOST, OLLAMA_MODEL
from prompts import OLLAMA_PROMPT

async def call_ollama(question: str) -> str:
    """Call Ollama locally for offline response"""
    try:
        prompt = OLLAMA_PROMPT.format(question=question)
        
        response = requests.post(
            f"{OLLAMA_HOST}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get("response", "No response from Ollama")
        else:
            return f"Error: {response.status_code}"
    except Exception as e:
        return f"Ollama error: {str(e)}"