import asyncio
import google.generativeai as genai
from config import GEMINI_API_KEY
from prompts import GEMINI_PROMPT, format_history_string

def _sync_call_gemini(question: str, history: list = None) -> str:
    if not GEMINI_API_KEY or GEMINI_API_KEY.strip() == "" or GEMINI_API_KEY == "your_api_key_here":
        return "Gemini API key not configured"
    
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash") 
    history_str = format_history_string(history or [], max_turns=5)
    prompt = GEMINI_PROMPT.format(history=history_str, question=question)
    
    response = model.generate_content(prompt, request_options={"timeout": 10})
    
    return response.text


async def call_gemini(question: str, history: list = None) -> str:
    """Call Gemini API for online response"""
    try:
        return await asyncio.to_thread(_sync_call_gemini, question, history)
    except Exception as e:
        return f"Gemini error: {str(e)}"