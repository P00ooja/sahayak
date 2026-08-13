# Q&A API Specification

## Base URL
- Development: `http://localhost:8000`

## Endpoints

### 1. Create New Chat
**POST** `/api/qa/new-chat`

Request:
```json
{}
```

Response:
```json
{
  "chat_id": "uuid-here",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 2. Ask Question
**POST** `/api/qa/ask`

Request:
```json
{
  "chat_id": "uuid-here",
  "question": "How do I teach multiplication?"
}
```

Response:
```json
{
  "message_id": "uuid-here",
  "chat_id": "uuid-here",
  "question": "How do I teach multiplication?",
  "answer": "You can start by using real objects...",
  "offline": false,
  "model": "gemini|ollama",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### 3. Get Chat History
**GET** `/api/qa/history/{chat_id}`

Response:
```json
{
  "chat_id": "uuid-here",
  "title": "Chat about teaching methods",
  "created_at": "2024-01-01T00:00:00Z",
  "messages": [
    {
      "message_id": "uuid",
      "question": "How do I teach multiplication?",
      "answer": "You can start by...",
      "offline": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 4. List All Chats
**GET** `/api/qa/chats`

Response:
```json
{
  "chats": [
    {
      "chat_id": "uuid",
      "title": "Teaching methods",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## Status Codes
- `200` OK
- `201` Created
- `400` Bad Request
- `500` Server Error

## Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```