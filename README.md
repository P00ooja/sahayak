# Sahayak

Offline-first AI teaching assistant for rural and multi-grade classrooms.

## Vision

Sahayak empowers teachers in low-resource environments with intelligent classroom planning, automated educational content generation, and seamless cloud-enhanced capabilities when connectivity is available.

## Core Features

- 📄 **Worksheet Generator** - Generate worksheets from textbook images
- 📚 **Lesson Planner** - Create realistic lesson plans from syllabus
- 💬 **Q&A** - AI-powered teaching assistant
- 🎮 **Game Zone** - Create educational games and quizzes

## Technology

- **Frontend**: React + Tauri
- **Backend**: FastAPI (Python)
- **Offline AI**: Ollama + Phi-3 Mini
- **Online AI**: Gemini API
- **Database**: SQLite

## Quick Start

### 1. Clone & Setup Backend
```bash
git clone https://github.com/P00ooja/sahayak.git
cd sahayak/backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env from template and add your GEMINI_API_KEY
cp .env.example .env
python main.py
```

### 2. Setup & Run Frontend
In a new terminal:
```bash
cd sahayak/frontend
npm install
npm run dev
```

### 3. Setup Offline AI (Optional)
Install [Ollama](https://ollama.com) and pull `phi`:
```bash
ollama pull phi
```

For detailed instructions and troubleshooting, see [docs/SETUP.md](docs/SETUP.md).


## Project Status

- Week 1: Platform shell (UI)
- Week 2: Backend + AI routing
- Week 3: Feature implementation + testing

## License

MIT

## Team

Built by the Sahayak team.