# API Specification

Backend API endpoints (will be implemented in Week 2).

## Base URL

- Development: `http://localhost:8000`
- Production: `https://sahayak.example.com` (future)

## Endpoints (Planned)

### POST /api/generate

Universal endpoint for all features.

**Request:**
```json
{
  "feature": "worksheet|lesson|qa|game",
  "prompt": "user input",
  "options": {
    "difficulty": "easy|medium|hard",
    "format": "pdf|word|html"
  }
}
```

**Response:**
```json
{
  "id": "unique_id",
  "content": "generated content",
  "offline": true,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### GET /api/health

Check if backend is running.

**Response:**
```json
{
  "status": "ok",
  "version": "0.1.0"
}
```

## Status Codes

- `200` OK
- `400` Bad Request
- `500` Server Error
- `503` Service Unavailable

## Authentication (Future)

Will use API keys or OAuth2 in Week 3+.

## Rate Limiting (Future)

Will implement rate limiting in production.

## Error Handling

All errors return JSON:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```