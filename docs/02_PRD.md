# Product Requirements Document

## User Workflows

### Workflow 1: Worksheet Generation
1. Teacher opens Sahayak
2. Clicks "Worksheet Generator"
3. Uploads image/PDF from textbook
4. Selects: Difficulty (Easy/Medium/Hard), Question Types (MCQ/Fill-blank/Match)
5. Optionally adds prompt for customization
6. Clicks "Generate"
7. AI generates worksheet (offline or online)
8. Teacher previews and downloads as PDF/Word

### Workflow 2: Lesson Planning
1. Teacher opens Sahayak
2. Clicks "Lesson Planner"
3. Uploads syllabus (text or image)
4. Selects: Grade level, available hours/week
5. Clicks "Generate"
6. AI creates detailed lesson plan
7. Teacher downloads as Word doc

### Workflow 3: Q&A
1. Teacher opens Sahayak
2. Clicks "Q&A"
3. Types question
4. AI answers (offline or enhanced online)
5. Teacher can ask follow-up questions

### Workflow 4: Game Generator
1. Teacher opens Sahayak
2. Clicks "Game Zone"
3. Uploads chapter/content
4. Selects game type (Quiz/Puzzle/Memory/Matching)
5. Clicks "Generate"
6. Teacher plays/previews
7. Downloads shareable link

## Feature Requirements

### Feature 1: Worksheet Generator
- Upload: Image, PDF
- Output: PDF, Word doc
- Offline capable: Yes
- Time to generate: <30 seconds

### Feature 2: Lesson Planner
- Input: Text/Image syllabus
- Output: Word doc with week-by-week breakdown
- Offline capable: Yes
- Time to generate: <60 seconds

### Feature 3: Q&A
- Input: Natural language question
- Output: Natural language answer
- Offline capable: Yes (basic)
- Online enhanced: Yes (better explanations)

### Feature 4: Game Generator
- Input: Content (text/image)
- Output: Playable HTML game
- Game types: Quiz, Puzzle, Matching, Memory
- Offline capable: Yes (basic)

## Non-Functional Requirements

- Offline mode works without any internet
- Online mode activates seamlessly when internet available
- All features have offline fallback
- UI is intuitive (no training needed)
- Works on Mac and Windows
- Single-user desktop application