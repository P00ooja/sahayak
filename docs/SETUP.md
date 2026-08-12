# Setup Guide

Complete these steps to set up Sahayak for development.

## Prerequisites

- **Node.js** 18+ (https://nodejs.org)
- **Git** (https://git-scm.com)
- **Rust** (for Tauri desktop build): https://rustup.rs/

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/sahayak.git
cd sahayak
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 to see the app running.

### 3. Setup Backend (Week 2+)

```bash
cd backend
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

pip install -r requirements.txt
python main.py
```

Backend will run on http://localhost:8000

## Development Workflow

### Making Changes

1. Create a new branch:
```bash
   git checkout -b feature/your-feature-name
```

2. Make changes

3. Test locally:
```bash
   npm run dev  # Frontend
   python main.py  # Backend
```

4. Commit with semantic message:
```bash
   git commit -m "feat: add your feature"
```

5. Push and create PR:
```bash
   git push origin feature/your-feature-name
```

### Commit Message Format

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (no logic change)
- `refactor:` Refactoring existing code
- `test:` Adding tests
- `chore:` Build/setup changes

Example:
```bash
git commit -m "feat(worksheet): add image upload component"
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:
```bash
npm run dev -- --port 3000
```

### Node Modules Issues

```bash
rm -rf node_modules
npm install
```

### Python Venv Issues

```bash
rm -rf venv
python -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

## Testing Desktop App (Tauri)

```bash
cd frontend
npm run tauri build
```

Creates:
- macOS: `src-tauri/target/release/bundle/dmg/`
- Windows: `src-tauri/target/release/`

## IDE Setup

### VS Code

Recommended extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Python
- Prettier
- GitLens

### PyCharm

- Set Python interpreter to `venv/bin/python`
- Enable Tailwind CSS support

## Contributing

1. Pick an issue from GitHub Issues
2. Create feature branch
3. Implement feature
4. Test thoroughly
5. Submit PR
6. Code review by team lead
7. Merge to `develop` then `main`

## Questions?

Open an issue or reach out to team lead.