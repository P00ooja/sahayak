import asyncio
import socket
from ollama_client import call_ollama
from gemini_client import call_gemini

def is_internet_available() -> bool:
    """Check if internet is available"""
    try:
        socket.create_connection(("8.8.8.8", 53), timeout=2)
        return True
    except:
        return False

async def get_answer(question: str, history: list = None) -> dict:
    """Route to online or offline AI"""

    has_internet = await asyncio.to_thread(is_internet_available)
    offline = not has_internet
    
    if offline:
        answer = await call_ollama(question, history=history)
        model = "ollama"
    else:
        answer = await call_gemini(question, history=history)
        model = "gemini"
    
    return {
        "answer": answer,
        "offline": offline,
        "model": model
    }






########debug prints##########
# async def get_answer(question: str) -> dict:
#     print("Router entered")

#     internet = is_internet_available()
#     print("Internet =", internet)

#     offline = not internet

#     if offline:
#         print("Calling Ollama")
#         answer = await call_ollama(question)
#         print("Ollama finished")
#         model = "ollama"
#     else:
#         print("Calling Gemini")
#         answer = await call_gemini(question)
#         print("Gemini finished")
#         model = "gemini"

#     print("Returning router result")

#     return {
#         "answer": answer,
#         "offline": offline,
#         "model": model
#     }