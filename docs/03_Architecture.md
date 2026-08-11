# System Architecture

## High-Level Flow

User Interface (React + Tauri)
↓
Dashboard
↓
[4 Feature Buttons]
↓
FastAPI Backend
↓
AI Router
↓
Internet?
↙ ↘
Gemini API Ollama
↘ ↙
Common Response
↓
PDF/DOCX Export
↓
User Downloads


## Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| UI | React | Modern, component-based |
| Desktop | Tauri | Lightweight (80MB) |
| Backend | FastAPI | Python-based, your team knows it |
| Offline AI | Ollama + Phi-3 Mini | Works on CPU, 2.7GB |
| Online AI | Gemini API | Better quality |
| Database | SQLite | Embedded, offline-capable |
| Export | reportlab + python-docx | Robust output |

## Folder Structure

sahayak/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── public/
│ ├── package.json
│ └── vite.config.js
├── backend/
│ ├── main.py
│ ├── ai_router.py
│ ├── database.py
│ └── requirements.txt
├── docs/
│ ├── 01_Project_Vision.md
│ ├── 02_PRD.md
│ ├── 03_Architecture.md
│ ├── SETUP.md
│ └── API.md
├── assets/
│ ├── logos/
│ └── screenshots/
├── scripts/
├── .github/
├── README.md
├── .gitignore
└── LICENSE


## Data Flow: Worksheet Generation

1. **Frontend**: User uploads image
2. **Backend**: Receives image, checks internet
3. **If Online**: Call Gemini API → Better quality
4. **If Offline**: Call Ollama locally → Functional quality
5. **Response**: JSON with questions
6. **Frontend**: Displays preview
7. **Export**: User downloads PDF/Word

## Database Schema

Worksheets Table:

id (primary key)
title
image_path
difficulty
question_types
content (JSON)
created_at
synced (boolean)

Similar tables for:

LessonPlans
QAHistory
Games

## AI Router Logic

```python
def get_response(prompt, feature_type):
    if is_internet_available():
        return call_gemini(prompt)
    else:
        return call_ollama(prompt)
```

Simple. One routing function. All features use it.