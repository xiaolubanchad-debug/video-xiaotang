# OpenClaw Ingest API

This project exposes internal APIs for automated content ingest. These routes are intended for `openclaw` and other trusted internal workers, not for public clients.

## Base Requirements

- Base URL: `http://localhost:3000`
- Header: `x-api-key: <INTERNAL_API_KEY>`
- Content-Type: `application/json`
- Idempotency key: use `sourceProvider + sourceExternalId`

## 1. Upsert a Video

**Endpoint**

```bash
POST /api/internal/videos/upsert
```

**Example**

```bash
curl -X POST http://localhost:3000/api/internal/videos/upsert \
  -H "Content-Type: application/json" \
  -H "x-api-key: replace-with-an-internal-api-key" \
  -d '{
    "sourceProvider": "openclaw",
    "sourceExternalId": "movie-10001",
    "title": "Neon Harbor",
    "subtitle": "Season 1",
    "description": "A moody coastal thriller.",
    "coverUrl": "https://cdn.example.com/covers/neon-harbor.jpg",
    "posterUrl": "https://cdn.example.com/posters/neon-harbor.jpg",
    "trailerUrl": "https://cdn.example.com/trailers/neon-harbor.mp4",
    "type": "series",
    "region": "US",
    "language": "English",
    "year": 2026,
    "durationSeconds": 3120,
    "status": "PUBLISHED",
    "publishedAt": "2026-03-24T15:30:00.000Z",
    "sourcePayload": {
      "crawler": "openclaw",
      "originUrl": "https://source.example.com/show/neon-harbor"
    },
    "category": {
      "name": "Thriller",
      "slug": "thriller"
    },
    "tags": [
      { "name": "Noir" },
      { "name": "Crime" }
    ],
    "sources": [
      {
        "sourceType": "hls",
        "sourceUrl": "https://stream.example.com/neon-harbor/master.m3u8",
        "resolution": "1080p",
        "format": "m3u8",
        "sortOrder": 0
      }
    ],
    "episodes": [
      {
        "title": "Episode 1",
        "episodeNo": 1,
        "sourceUrl": "https://stream.example.com/neon-harbor/ep1.m3u8",
        "durationSeconds": 3120,
        "isFree": true,
        "sortOrder": 0,
        "publishedAt": "2026-03-24T15:30:00.000Z"
      }
    ],
    "subtitles": [
      {
        "language": "en",
        "fileUrl": "https://cdn.example.com/subtitles/neon-harbor-en.vtt",
        "format": "vtt"
      }
    ]
  }'
```

## 2. Batch Upsert

**Endpoint**

```bash
POST /api/internal/videos/batch-upsert
```

**Example**

```bash
curl -X POST http://localhost:3000/api/internal/videos/batch-upsert \
  -H "Content-Type: application/json" \
  -H "x-api-key: replace-with-an-internal-api-key" \
  -d '{
    "items": [
      {
        "sourceProvider": "openclaw",
        "sourceExternalId": "movie-10001",
        "title": "Neon Harbor",
        "type": "series",
        "status": "PUBLISHED"
      },
      {
        "sourceProvider": "openclaw",
        "sourceExternalId": "movie-10002",
        "title": "Signal After Dark",
        "type": "movie",
        "status": "DRAFT"
      }
    ]
  }'
```

## 3. Delete a Video

**Endpoint**

```bash
DELETE /api/internal/videos/:sourceProvider/:sourceExternalId
```

**Example**

```bash
curl -X DELETE http://localhost:3000/api/internal/videos/openclaw/movie-10001 \
  -H "x-api-key: replace-with-an-internal-api-key"
```

## Response Shape

### Upsert success

```json
{
  "ok": true,
  "action": "upsert",
  "videoId": "cm8abc1230000xyz",
  "sourceProvider": "openclaw",
  "sourceExternalId": "movie-10001"
}
```

### Batch success

```json
{
  "ok": true,
  "action": "batch-upsert",
  "total": 2,
  "success": 2,
  "failed": 0
}
```

### Delete success

```json
{
  "ok": true,
  "action": "delete",
  "deleted": true,
  "sourceProvider": "openclaw",
  "sourceExternalId": "movie-10001"
}
```

### Error

```json
{
  "ok": false,
  "error": "Invalid internal API key."
}
```

## Notes for OpenClaw

- Keep `sourceProvider` stable. Example: `openclaw`.
- Keep `sourceExternalId` stable for the same title or episode group.
- Re-send the same object when metadata changes. The API is designed for idempotent upserts.
- Every ingest attempt is recorded in `IngestLog`.
