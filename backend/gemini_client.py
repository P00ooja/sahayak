import google.generativeai as genai
from config import GEMINI_API_KEY
from prompts import GEMINI_PROMPT

async def call_gemini(question: str) -> str:
    """Call Gemini API for online response"""
    try:
        if not GEMINI_API_KEY:
            return "Gemini API key not configured"
        
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash") 
        prompt = GEMINI_PROMPT.format(question=question)
        response = model.generate_content(prompt)
        
        return response.text
    except Exception as e:
        return f"Gemini error: {str(e)}"