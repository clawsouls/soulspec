---
sidebar_position: 1
title: REST API
description: ClawSouls REST API reference.
---

# REST API Reference

The ClawSouls REST API provides programmatic access to the soul registry.

**Base URL:** `https://clawsouls.ai/api`

## Endpoints

### Search Souls

```
GET /api/souls/search?q={query}&category={category}&tag={tag}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query |
| `category` | string | Filter by category |
| `tag` | string | Filter by tag |
| `limit` | number | Results per page (default: 20) |
| `offset` | number | Pagination offset |

**Response:**
```json
{
  "souls": [
    {
      "name": "surgical-coder",
      "owner": "clawsouls",
      "displayName": "Surgical Coder",
      "description": "Precision-focused coding agent",
      "version": "1.0.0",
      "downloads": 1250,
      "rating": 4.8,
      "tags": ["coding", "precision"]
    }
  ],
  "total": 85
}
```

### Get Soul Details

```
GET /api/souls/{owner}/{name}
```

Returns full soul metadata including `soul.json` content, file list, SoulScan score, and download stats.

### Get Soul Files

```
GET /api/souls/{owner}/{name}/files/{filename}
```

Returns the raw content of a specific soul file (e.g., `SOUL.md`, `IDENTITY.md`).

### List Categories

```
GET /api/categories
```

Returns the category tree with soul counts.

### Publish Soul

```
POST /api/souls/publish
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

Uploads a soul package. Requires authentication via `clawsouls login`.

## Authentication

API tokens are obtained via `clawsouls login` in the CLI or from your [dashboard](https://clawsouls.ai/dashboard).

```bash
# Authenticate
clawsouls login <token>
```

## Rate Limits

- **Anonymous:** 60 requests/minute
- **Authenticated:** 300 requests/minute
