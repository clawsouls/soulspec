---
sidebar_position: 1
title: REST API
description: ClawSouls REST API reference for the soul registry.
---

# REST API Reference

The ClawSouls REST API provides programmatic access to the soul registry — search, download, publish, and manage AI agent personas.

**Base URL:** `https://clawsouls.ai/api/v1`

## Authentication

Most read endpoints are public. Write operations (publish, download) require authentication.

**Header formats** (either works):

```
Authorization: Bearer cs_xxxxx
x-api-key: cs_xxxxx
```

Get your API token from `clawsouls login` in the CLI or from your [dashboard](https://clawsouls.ai/dashboard).

## Endpoints

### List Souls

```http
GET /api/v1/souls
```

Returns all published souls with filtering and pagination.

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Full-text search (name, description, tags, category) |
| `category` | string | Filter by category prefix |
| `tag` | string | Filter by tag |
| `sort` | string | Sort order (default: `name`) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 20, max: 100) |

**Example:**

```bash
curl "https://clawsouls.ai/api/v1/souls?q=coding&limit=5"
```

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
      "category": "work/coding",
      "tags": ["coding", "precision"],
      "downloads": 1250,
      "rating": 4.8
    }
  ],
  "total": 85,
  "page": 1,
  "limit": 5
}
```

:::tip Markdown for Agents
Send `Accept: text/markdown` to get a markdown-formatted soul listing — useful for LLM agents.
:::

---

### Search Souls

```http
GET /api/v1/search?q={query}
```

Dedicated search endpoint. Requires at least one filter parameter.

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query |
| `tag` | string | Filter by tag |
| `category` | string | Filter by category prefix |

**Example:**

```bash
curl "https://clawsouls.ai/api/v1/search?q=devops&tag=infrastructure"
```

**Response:**

```json
{
  "query": { "q": "devops", "tag": "infrastructure", "category": null },
  "results": [ ... ],
  "total": 3
}
```

---

### Get Soul Details

```http
GET /api/v1/souls/{owner}/{name}
```

Returns full soul metadata, file contents, SoulScan results, and download stats.

**Example:**

```bash
curl "https://clawsouls.ai/api/v1/souls/clawsouls/surgical-coder"
```

Supports `Accept: text/markdown` for agent-friendly output with full file contents.

---

### Download Soul (ZIP)

```http
GET /api/v1/souls/{owner}/{name}/download
Authorization: Bearer cs_xxxxx
```

Downloads the soul as a ZIP archive containing all files. Requires authentication.

| Parameter | Type | Description |
|-----------|------|-------------|
| `version` | string | Specific version (default: latest) |

**Example:**

```bash
curl -H "Authorization: Bearer cs_xxxxx" \
  "https://clawsouls.ai/api/v1/souls/clawsouls/surgical-coder/download" \
  -o soul.zip
```

---

### Publish Soul

```http
PUT /api/v1/souls/{owner}/{name}/publish
Authorization: Bearer cs_xxxxx
Content-Type: application/json
```

Publishes or updates a soul. You can only publish under your own namespace.

**Request body:**

```json
{
  "manifest": {
    "specVersion": "0.4",
    "name": "my-soul",
    "displayName": "My Soul",
    "version": "1.0.0",
    "description": "A helpful coding assistant.",
    "author": { "name": "yourname", "github": "yourname" },
    "license": "MIT",
    "tags": ["coding"],
    "category": "work/coding",
    "files": { "soul": "SOUL.md" }
  },
  "files": {
    "SOUL.md": "# My Soul\n\nYou are a helpful coding assistant.",
    "IDENTITY.md": "# Identity\n\n- Name: Helper"
  }
}
```

**Response (success):**

```json
{
  "ok": true,
  "message": "Published yourname/my-soul v1.0.0",
  "url": "https://clawsouls.ai/en/souls/yourname/my-soul"
}
```

:::note
The `clawsouls` namespace is reserved for official souls (superuser only).
:::

---

### Validate Soul

```http
POST /api/v1/validate
Content-Type: application/json
```

Validates a soul package without publishing. Checks schema, license, and runs SoulScan.

**Request body:**

```json
{
  "manifest": { ... },
  "files": {
    "SOUL.md": "...",
    "IDENTITY.md": "..."
  }
}
```

**Response:**

```json
{
  "valid": true,
  "checks": [
    { "type": "pass", "message": "soul.json schema valid (spec v0.4)" },
    { "type": "pass", "message": "License \"MIT\" is allowed" },
    { "type": "pass", "message": "SoulScan passed (score: 95/100)" }
  ]
}
```

---

### List Categories

```http
GET /api/v1/categories
```

Returns all categories with soul counts.

**Response:**

```json
{
  "categories": [
    { "name": "work", "count": 35 },
    { "name": "creative", "count": 18 },
    { "name": "lifestyle", "count": 12 }
  ]
}
```

---

### SoulScan Results

```http
GET /api/v1/souls/{owner}/{name}/scan
```

Returns the latest SoulScan security scan results for a soul.

---

### Get Soul Versions

```http
GET /api/v1/souls/{owner}/{name}/versions
```

Lists all published versions of a soul.

---

### Get Specific Version

```http
GET /api/v1/souls/{owner}/{name}/versions/{version}
```

Returns metadata for a specific version.

---

### Download Bundle

```http
GET /api/v1/bundle/{owner}/{name}
```

Returns a pre-built bundle for quick installation.

---

### Get Current User

```http
GET /api/v1/me
Authorization: Bearer cs_xxxxx
```

Returns the authenticated user's profile.

**Response:**

```json
{
  "tier": "free",
  "username": "yourname",
  "hasStripeCustomer": false
}
```

---

### Report Soul

```http
POST /api/v1/souls/{owner}/{name}/report
Authorization: Bearer cs_xxxxx
```

Report a soul for policy violations (harmful content, prompt injection, etc.).

---

### Scan Rules

```http
GET /api/v1/scan-rules
```

Returns the current SoulScan rule set (pattern IDs and descriptions).

## Rate Limits

- **Anonymous:** 60 requests/minute
- **Authenticated:** 300 requests/minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1709052000
```

## Error Format

All errors follow a consistent format:

```json
{
  "error": "Soul not found"
}
```

Common HTTP status codes:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (missing parameters) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (wrong namespace, blocked account) |
| 404 | Not found |
| 429 | Rate limited |
