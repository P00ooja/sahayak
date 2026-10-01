# Sahayak Setup & Installation Guide

This document provides a step-by-step guide to clone, set up, configure, and run **Sahayak** from scratch on any macOS or Windows machine.

---

## 📋 System Prerequisites

Before starting, ensure you have the following installed on your system:

| Dependency | Required Version | Purpose |
|---|---|---|
| **Git** | `v2.x+` | Source control & cloning repository |
| **Python** | `3.10.x` to `3.13.x` | Backend runtime environment |
| **Node.js** | `v18.x` or `v20.x` (LTS) | Frontend React/Vite development server |
| **npm** | `v9.x+` or `v10.x+` | Node package manager |
| **Ollama** | Latest version | Local offline LLM runner |

---

## 🚀 Step 1: Clone the Repository

Open your terminal or command prompt and clone the repository:

```bash
git clone https://github.com/P00ooja/sahayak.git
cd sahayak
```

---

## 🦙 Step 2: Install & Configure Ollama (For Offline AI)

Sahayak uses **Meta's Llama 3.2 (3B)** for local, offline AI responses ($0 cost, 100% private).

1. **Download & Install Ollama:**
   - **macOS / Windows:** Download installer from [ollama.com](https://ollama.com) and install it.
2. **Pull the Llama 3.2 (3B) Model:**
   Open a terminal window and run:
   ```bash
   ollama pull llama3.2:3b
   ```
3. **Verify Ollama is Running:**
   ```bash
   ollama list
   ```
   *You should see `llama3.2:3b` listed under model names.*

---

## 🐍 Step 3: Backend Setup (FastAPI & Python Virtual Environment)

1. **Navigate to the `backend` directory:**
   ```bash
   cd backend
   ```

2. **Create a Virtual Environment (`venv`):**
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - **Windows (Command Prompt):**
     ```cmd
     python -m venv venv
     venv\Scripts\activate
     ```
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```

3. **Install Dependencies:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables (`.env`):**
   Create a file named `.env` inside the `backend/` folder:
   ```bash
   # On macOS/Linux:
   cp .env.example .env
   ```
   Or manually create `backend/.env` with the following contents:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   OLLAMA_HOST=http://localhost:11434
   OLLAMA_MODEL=llama3.2:3b
   DEBUG=True
   DATABASE_PATH=sahayak.db
   ```
   > 💡 **Note:** `GEMINI_API_KEY` is optional for initial startup. You can also enter or update your Google Gemini API key directly inside the app's Settings Modal at any time.

---

## 💻 Step 4: Frontend Setup (React + Vite + Tailwind CSS)

1. **Open a new terminal window** and navigate to the `frontend` directory:
   ```bash
   cd sahayak/frontend
   ```

2. **Install Node Package Dependencies:**
   ```bash
   npm install
   ```

---

## ▶️ Step 5: Running the Application

To run Sahayak, keep **two terminal windows running concurrently**:

### Terminal 1: Start Backend Server
```bash
cd sahayak/backend
# Ensure your virtual environment is active (source venv/bin/activate or venv\Scripts\activate)
python main.py
```
*Output should show:* `Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)`

### Terminal 2: Start Frontend Development Server
```bash
cd sahayak/frontend
npm run dev
```
*Output should show:* `Local: http://localhost:5173/`

---

## 🌐 Step 6: Accessing Sahayak

1. Open your web browser and go to: `http://localhost:5173`
2. **Q&A Assistant:** Ask any educational or technical question. Switches seamlessly between online (Gemini) and offline (`llama3.2:3b`).
3. **Lesson Planner:** Generate structured multi-period lesson plans with interactive activities, teaching strategies, and custom edits.
4. **App Settings (BYOK):** Click the ⚙️ Gear icon in the top navigation bar to test/save your own free Gemini API key from Google AI Studio.

---

## 🛠️ Troubleshooting & FAQs

- **Backend fails to start (`ModuleNotFoundError`):** Make sure your virtual environment is activated (`source venv/bin/activate`) before running `python main.py`.
- **Offline mode gives errors / fails to respond:** Ensure Ollama is running in the background and that `llama3.2:3b` was downloaded (`ollama pull llama3.2:3b`).
- **SQLite DB errors:** SQLite is built into Python natively. The `sahayak.db` database file and all tables (`chats`, `messages`, `lesson_plans`, `settings`) are generated automatically on backend startup.
