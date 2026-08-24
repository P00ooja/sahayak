import asyncio
import google.generativeai as genai
from routes_settings import get_effective_gemini_key
from prompts import GEMINI_PROMPT, format_history_string


def _sync_call_gemini(question: str, history: list = None) -> str:
    api_key = get_effective_gemini_key()
    if not api_key or api_key.strip() == "" or api_key == "your_api_key_here":
        return "Gemini API key not configured"
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash") 
    history_str = format_history_string(history or [], max_turns=5)
    prompt = GEMINI_PROMPT.format(history=history_str, question=question)
    
    response = model.generate_content(prompt, request_options={"timeout": 15})

    
    return response.text


async def call_gemini(question: str, history: list = None) -> str:
    """Call Gemini API for online response"""
    try:
        return await asyncio.to_thread(_sync_call_gemini, question, history)
    except Exception as e:
        return f"Gemini error: {str(e)}"