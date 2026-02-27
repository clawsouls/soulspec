---
sidebar_position: 2
title: SoulScan
description: Security verification for AI agent personas.
---

# SoulScan

SoulScan is the security engine that verifies soul packages. It checks for prompt injection, data exfiltration, harmful content, and 50+ other patterns.

## How It Works

Every soul published to [clawsouls.ai](https://clawsouls.ai) is automatically scanned. You can also run SoulScan locally:

```bash
# Scan a soul package
npx clawsouls soulscan ./my-soul

# Scan your active workspace
npx clawsouls soulscan

# Initialize baseline checksums
npx clawsouls soulscan --init
```

## What It Checks

### Security (Critical)
- Prompt injection attempts
- System prompt override patterns
- Data exfiltration instructions
- Secret/credential leaks
- Unauthorized tool usage directives

### Quality (Warning)
- Missing required files
- Schema validation errors
- Inconsistent personality across files
- Overly long descriptions
- Model compatibility hints

### Integrity
- File checksum verification (with `--init`)
- Unexpected file modifications
- Tamper detection

## Score

SoulScan outputs a score from 0–100:

| Score | Status | Description |
|-------|--------|-------------|
| 90–100 | ✅ Excellent | No issues found |
| 70–89 | ⚠️ Good | Minor warnings |
| 50–69 | 🟡 Fair | Issues should be addressed |
| 0–49 | ❌ Fail | Critical issues, cannot publish |

## Example Output

```
🔒 SoulScan Results — my-soul
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score: 95/100

✅ No prompt injection patterns
✅ No secret leaks
✅ Schema valid
⚠️ STYLE.md missing (optional but recommended)

53 patterns checked · 0 critical · 1 warning
```

## CI Integration

Add SoulScan to your CI pipeline:

```bash
npx clawsouls soulscan ./my-soul -q
# Exit code 0 = pass, 1 = fail
```
