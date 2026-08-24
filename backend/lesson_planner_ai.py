import asyncio
import json
import re
import requests
import google.generativeai as genai
from config import OLLAMA_HOST, OLLAMA_MODEL
from routes_settings import get_effective_gemini_key
from prompts_lesson_planner import LESSON_PLAN_PROMPT_OLLAMA, LESSON_PLAN_PROMPT_GEMINI

def clean_and_parse_json(text: str) -> dict:
    """Extract and parse JSON from model output safely"""
    if not text:
        raise ValueError("Empty output received from model")
    
    cleaned = text.strip()
    
    # Strip markdown code blocks if present (```json ... ```)
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    
    # Locate first '{' and last '}'
    start_idx = cleaned.find("{")
    end_idx = cleaned.rfind("}")
    
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        cleaned = cleaned[start_idx:end_idx+1]
        
    return json.loads(cleaned)

def create_fallback_plan(topic: str, grade_level: int, number_of_classes: int, minutes_per_class: int) -> dict:
    """Fallback generator if model JSON generation fails"""
    return {
        "title": f"Lesson Plan: {topic}",
        "grade_level": grade_level,
        "number_of_classes": number_of_classes,
        "minutes_per_class": minutes_per_class,
        "classes": [
            {
                "class_number": i,
                "title": f"Class {i}: Introduction to {topic}" if i == 1 else f"Class {i}: Advanced {topic} Concepts",
                "duration_minutes": minutes_per_class,
                "topics": [f"Key Concept {j}" for j in range(1, 3)],
                "teaching_strategies": ["Interactive Discussion", "Direct Instruction"],
                "activities": ["Guided Group Activity", "Class Problem Solving"],
                "assessment": "Formative Q&A & Exit Ticket"
            }
            for i in range(1, number_of_classes + 1)
        ]
    }

def _sync_generate_ollama(topic: str, grade_level: int, number_of_classes: int, minutes_per_class: int) -> dict:
    """Synchronous call to Ollama (llama3.2:3b)"""
    total_minutes = number_of_classes * minutes_per_class
    prompt = LESSON_PLAN_PROMPT_OLLAMA.format(
        topic=topic,
        grade_level=grade_level,
        number_of_classes=number_of_classes,
        minutes_per_class=minutes_per_class,
        total_minutes=total_minutes
    )
    
    response = requests.post(
        f"{OLLAMA_HOST}/api/generate",
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_predict": 1800,
                "temperature": 0.3
            }
        },
        timeout=90
    )
    
    if response.status_code == 200:
        data = response.json()
        raw_text = data.get("response", "")
        try:
            return clean_and_parse_json(raw_text)
        except Exception as e:
            print(f"Ollama JSON parse fallback: {e}")
            return create_fallback_plan(topic, grade_level, number_of_classes, minutes_per_class)
    else:
        raise Exception(f"Ollama returned HTTP status {response.status_code}")

def _sync_generate_gemini(topic: str, grade_level: int, number_of_classes: int, minutes_per_class: int) -> dict:
    """Synchronous call to Gemini 2.5 Flash"""
    api_key = get_effective_gemini_key()
    if not api_key or api_key == "your_api_key_here":
        raise Exception("No valid Gemini API key configured")
        
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    total_minutes = number_of_classes * minutes_per_class
    
    prompt = LESSON_PLAN_PROMPT_GEMINI.format(
        topic=topic,
        grade_level=grade_level,
        number_of_classes=number_of_classes,
        minutes_per_class=minutes_per_class,
        total_minutes=total_minutes
    )
    
    response = model.generate_content(prompt, request_options={"timeout": 30})
    try:
        return clean_and_parse_json(response.text)
    except Exception as e:
        print(f"Gemini JSON parse fallback: {e}")
        return create_fallback_plan(topic, grade_level, number_of_classes, minutes_per_class)

async def generate_lesson_plan_ai(topic: str, grade_level: int, number_of_classes: int, minutes_per_class: int, has_internet: bool) -> dict:
    """AI router for lesson plan generation with fallback"""
    if has_internet:
        try:
            plan = await asyncio.to_thread(_sync_generate_gemini, topic, grade_level, number_of_classes, minutes_per_class)
            return {
                "lesson_plan": plan,
                "model": "gemini",
                "offline": False
            }
        except Exception as e:
            print(f"Gemini generation failed: {e}. Falling back to Ollama...")
            
    # Offline or Gemini fallback
    try:
        plan = await asyncio.to_thread(_sync_generate_ollama, topic, grade_level, number_of_classes, minutes_per_class)
        return {
            "lesson_plan": plan,
            "model": "ollama (llama3.2:3b)",
            "offline": True
        }
    except Exception as e:
        print(f"Ollama generation failed: {e}. Using fallback structure...")
        return {
            "lesson_plan": create_fallback_plan(topic, grade_level, number_of_classes, minutes_per_class),
            "model": "fallback",
            "offline": True
        }
