import os
from dotenv import load_dotenv

load_dotenv()

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Ollama Settings
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "phi")

# Database
DATABASE_PATH = os.getenv("DATABASE_PATH", "sahayak.db")

# App
DEBUG = os.getenv("DEBUG", "False") == "True"