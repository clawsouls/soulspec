---
sidebar_position: 4
title: SoulScan API
description: Programmatically scan soul packages for security vulnerabilities and quality issues.
---

# SoulScan API

The SoulScan API lets you scan soul packages programmatically — validate security, check quality, and enforce standards before deploying AI agents.

**Base URL:** `https://clawsouls.ai/api/v1`

## Authentication

All scan requests require an API key.

```
X-API-Key: cs_scan_xxxxx
```

Get your API key from the [Dashboard → API Keys](https://clawsouls.ai/dashboard/api-keys) page.

### Free Tier

- **100 scans/month** per API key
- No credit card required
- Rate limit: 429 response when exceeded

Need more? Contact us for enterprise pricing.

## Endpoints

### Scan Soul Package

```http
POST /soulscan/scan
```

Scan a set of soul files for security issues, schema errors, and quality warnings.

#### Request

**Headers:**
```
X-API-Key: cs_scan_xxxxx
Content-Type: application/json
```

**Body:**
```json
{
  "files": {
    "soul.json": "{ \"name\": \"my-agent\", \"version\": \"1.0.0\", \"specVersion\": \"0.3\", \"displayName\": \"My Agent\", \"description\": \"A helpful assistant\", \"author\": { \"name\": \"me\" }, \"license\": \"MIT\", \"tags\": [\"utility\"], \"category\": \"utility\", \"files\": { \"soul\": \"SOUL.md\" } }",
    "SOUL.md": "# My Agent\n\nYou are a helpful assistant. Professional and concise.",
    "IDENTITY.md": "# My Agent\n\n- **Name:** My Agent\n- **Creature:** AI assistant"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `files` | `object` | ✅ | Map of filename → file content (string) |

**Supported files:** `.md`, `.json`, `.txt`, `.yaml`, `.yml`, `.png`, `.jpg`, `.svg`  
**Max file size:** 100KB per file, 1MB total  
**Max request size:** 2MB

#### Response

```json
{
  "ok": true,
  "status": "pass",
  "score": 95,
  "grade": "Verified",
  "scannerVersion": "1.2.0",
  "scanDurationMs": 3,
  "errors": [],
  "warnings": [],
  "info": [
    {
      "code": "QUALITY010",
      "message": "SOUL.md: 58 chars",
      "file": "SOUL.md",
      "severity": "info"
    },
    {
      "code": "CONSIST010",
      "message": "Persona consistency check completed",
      "severity": "info"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `ok` | `boolean` | `true` if no errors |
| `status` | `string` | `pass`, `warn`, `fail`, or `error` |
| `score` | `number` | 0–100 |
| `grade` | `string` | `Verified` (90+), `Low Risk` (70+), `Medium Risk` (40+), `High Risk` (1+), `Blocked` (0) |
| `scannerVersion` | `string` | Scanner engine version |
| `scanDurationMs` | `number` | Scan time in milliseconds |
| `errors` | `array` | Critical issues (each -25 points) |
| `warnings` | `array` | Non-critical issues (each -5 points) |
| `info` | `array` | Informational notes |

Each issue object:

```json
{
  "code": "SEC001",
  "message": "Prompt injection pattern detected in SOUL.md",
  "file": "SOUL.md",
  "severity": "error"
}
```

### Error Responses

| Status | Meaning |
|--------|---------|
| `400` | Bad request — missing files, invalid JSON |
| `401` | Invalid or revoked API key |
| `413` | Request too large (>2MB) |
| `429` | Monthly usage limit exceeded |

**429 response body:**
```json
{
  "error": "Monthly usage limit exceeded",
  "limit": 100,
  "used": 100
}
```

## Scan Rules

SoulScan checks **55+ security and quality rules** across 4 stages:

| Stage | What it checks |
|-------|---------------|
| **1. Schema** | soul.json required fields, specVersion, format |
| **2. File Structure** | Allowed extensions, file sizes, recommended files |
| **3. Security** | Prompt injection, jailbreak, PII exposure, credential leaks |
| **4. Quality** | Content length, persona consistency, name matching |

For embodied agents (specVersion `0.5`), additional checks apply:
- `environment`, `interactionMode`, `hardwareConstraints` validation
- `safety.physical` and `safety.laws` checks
- Bonus points for properly configured embodied fields

## Code Examples

### cURL

```bash
curl -X POST https://clawsouls.ai/api/v1/soulscan/scan \
  -H "X-API-Key: cs_scan_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "files": {
      "soul.json": "{\"name\":\"my-agent\",\"version\":\"1.0.0\",\"specVersion\":\"0.3\",\"displayName\":\"My Agent\",\"description\":\"A helpful assistant\",\"author\":{\"name\":\"me\"},\"license\":\"MIT\",\"tags\":[\"utility\"],\"category\":\"utility\",\"files\":{\"soul\":\"SOUL.md\"}}",
      "SOUL.md": "# My Agent\nYou are a helpful, professional assistant."
    }
  }'
```

### JavaScript / TypeScript

```typescript
const response = await fetch('https://clawsouls.ai/api/v1/soulscan/scan', {
  method: 'POST',
  headers: {
    'X-API-Key': 'cs_scan_xxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    files: {
      'soul.json': JSON.stringify({
        name: 'my-agent',
        version: '1.0.0',
        specVersion: '0.3',
        displayName: 'My Agent',
        description: 'A helpful assistant',
        author: { name: 'me' },
        license: 'MIT',
        tags: ['utility'],
        category: 'utility',
        files: { soul: 'SOUL.md' },
      }),
      'SOUL.md': '# My Agent\nYou are a helpful, professional assistant.',
    },
  }),
});

const result = await response.json();
console.log(`Score: ${result.score}/100 (${result.grade})`);

if (!result.ok) {
  console.error('Errors:', result.errors);
}
```

### Python

```python
import requests
import json

response = requests.post(
    'https://clawsouls.ai/api/v1/soulscan/scan',
    headers={
        'X-API-Key': 'cs_scan_xxxxx',
        'Content-Type': 'application/json',
    },
    json={
        'files': {
            'soul.json': json.dumps({
                'name': 'my-agent',
                'version': '1.0.0',
                'specVersion': '0.3',
                'displayName': 'My Agent',
                'description': 'A helpful assistant',
                'author': {'name': 'me'},
                'license': 'MIT',
                'tags': ['utility'],
                'category': 'utility',
                'files': {'soul': 'SOUL.md'},
            }),
            'SOUL.md': '# My Agent\nYou are a helpful, professional assistant.',
        }
    }
)

result = response.json()
print(f"Score: {result['score']}/100 ({result['grade']})")
```

## Integration Example

Gate agent registration on SoulScan score:

```typescript
import { scanSoul } from './soulscan-client';

async function registerAgent(name: string, soulFiles: Record<string, string>) {
  // Scan before registration
  const scan = await scanSoul(soulFiles);
  
  if (scan.score < 40) {
    throw new Error(
      `Registration rejected: SoulScan score ${scan.score}/100 (${scan.grade}). ` +
      `Fix ${scan.errors.length} error(s) and try again.`
    );
  }

  // Proceed with registration
  await db.agents.insert({
    name,
    soulscan_score: scan.score,
    soulscan_grade: scan.grade,
    // ...
  });
}
```

## See Also

- [SoulScan Overview](../platform/soulscan) — How SoulScan works
- [Soul Spec Reference](../spec/overview) — Soul package format
- [REST API](./rest-api) — Full registry API
- [Dashboard](https://clawsouls.ai/dashboard/api-keys) — Manage API keys
