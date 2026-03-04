---
sidebar_position: 2
title: SoulScan
description: Security verification for AI agent personas.
---

# SoulScan

SoulScan is the security engine that verifies soul packages. It checks for prompt injection, data exfiltration, harmful content, and 55+ other patterns.

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

```
Score = 100 - (errors × 25) - (warnings × 5)
```

For embodied agents (`environment: "embodied"`), a quality bonus of up to **+10 points** is applied for well-defined hardware constraints, safety declarations, and other embodied-specific fields.

| Score | Grade | Description |
|-------|-------|-------------|
| 90–100 | ✅ Verified | No issues found |
| 70–89 | ⚠️ Low Risk | Minor warnings |
| 40–69 | 🟡 Medium Risk | Issues should be addressed |
| 1–39 | 🟠 High Risk | Significant issues, review required |
| 0 | ❌ Blocked | Critical issues, cannot publish |

## Example Output

```
🔒 SoulScan Results — my-soul
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score: 95/100

✅ No prompt injection patterns
✅ No secret leaks
✅ Schema valid
⚠️ STYLE.md missing (optional but recommended)

58 patterns checked · 0 critical · 1 warning
```

## Package Limits

### File Size
- **Per file**: 100KB maximum
- **Per package**: 1MB maximum (total of all files)

### Allowed File Extensions

Only the following file extensions are permitted in a soul package:

`.md`, `.json`, `.png`, `.jpg`, `.jpeg`, `.svg`, `.txt`, `.yaml`, `.yml`

Files with other extensions will be flagged by SoulScan.

## CI Integration

Add SoulScan to your CI pipeline:

```bash
npx clawsouls soulscan ./my-soul -q
# Exit code 0 = pass, 1 = fail
```
