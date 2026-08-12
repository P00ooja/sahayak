# Sahayak

Offline-first AI teaching assistant for rural and multi-grade classrooms.

![Status](https://img.shields.io/badge/status-beta-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-0.1.0-blue)

## 🎯 Vision

Sahayak empowers teachers in low-resource environments with intelligent classroom planning, automated educational content generation, and seamless cloud-enhanced capabilities when connectivity is available.

## ✨ Features

- 📄 **Worksheet Generator** - Auto-generate worksheets from textbook images
- 📚 **Lesson Planner** - Create detailed, classroom-ready lesson plans
- 💬 **Q&A Assistant** - Answer teaching questions instantly
- 🎮 **Game Zone** - Generate educational games and quizzes

## 🏗️ Tech Stack

| Component | Technology |
|-----------|-----------|
| UI | React + Vite + Tailwind |
| Desktop | Tauri |
| Backend | FastAPI (Python) |
| Offline AI | Ollama + Phi-3 Mini |
| Online AI | Gemini API |
| Database | SQLite |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Rust (for Tauri)

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/sahayak.git
cd sahayak

# Setup frontend
cd frontend
npm install
npm run dev

# Backend setup (Week 2+)
cd ../backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

For detailed setup, see [docs/SETUP.md](docs/SETUP.md)

## 📋 Project Timeline

- **Week 1** ✅ Platform shell (UI)
- **Week 2** 🔄 Backend + AI routing
- **Week 3** ⏳ Features + testing + launch

## 📚 Documentation

- [Project Vision](docs/01_Project_Vision.md)
- [Product Requirements](docs/02_PRD.md)
- [Architecture](docs/03_Architecture.md)
- [Setup Guide](docs/SETUP.md)
- [API Specification](docs/API.md)

## 🤝 Contributing

1. Pick an issue
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes
4. Commit: `git commit -m "feat: description"`
5. Push: `git push origin feature/your-feature`
6. Create PR

See [CONTRIBUTING.md](#) for details (coming soon).

## 📝 Commit Message Format

feat(module): add feature
fix(module): fix bug
docs: update documentation
refactor: reorganize code


## 🎓 Team

- **Team Lead** - Architecture, oversight
- **Frontend Dev** - React UI
- **Backend Dev** - FastAPI, AI routing
- **Feature Devs** - Specific features

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 🙏 Support

For issues and questions, open a GitHub Issue or contact the team lead.

---

**Made with ❤️ for teachers in rural India**