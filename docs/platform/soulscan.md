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
npx clawsouls scan ./my-soul

# Quick mode (single-line output for CI)
npx clawsouls scan . -q

# JSON output
npx clawsouls scan . --json

# Full integrity scan (server + checksum verification)
npx clawsouls soulscan ./my-soul
```

## What It Checks

### Stage 1: Schema Validation
- `soul.json` structure and required fields
- `specVersion` compatibility check
- Embodied agent field validation (v0.5+)

### Stage 2: File Structure
- Allowed file extensions only
- Per-file and total package size limits
- Recommended files (SOUL.md, IDENTITY.md)

### Stage 2.5: Manifest Security
- Embodied agents without safety laws
- Cross-reference: safety laws vs persona contradictions

### Stage 3: Pattern-Based Security
- Prompt injection attempts
- System prompt override patterns
- Data exfiltration instructions
- Secret/credential leaks
- Unauthorized tool usage directives

### Stage 3.5: Memory Hygiene
- **Context-aware PII detection** — distinguishes real secrets from placeholders
- Email, phone, SSN, IP, filesystem paths, API keys, passwords, DB connection strings
- False positive filtering: code blocks, example prefixes, well-known IPs (127.0.0.1, 8.8.8.8)
- **File-type differentiation**: critical PII in non-memory files escalated to error severity

### Stage 4: Content Quality
- SOUL.md length check
- Description quality

### Stage 5: Persona Consistency
- Name consistency across IDENTITY.md and soul.json
- Tone contradiction detection (formal vs casual)
- Persona reference validation

## Integrated Scoring

SoulScan v1.4.0 uses a weighted scoring formula when memory files are present:

```
integratedScore = personaScore × 0.6 + memoryScore × 0.4
```

- **Persona score**: based on schema, security, quality, consistency issues (stages 1–5 excluding memory)
- **Memory score**: based on PII/hygiene issues in memory files only
- When no memory files exist, the persona score is used directly

### Score Penalties

| Issue Type | Penalty |
|-----------|---------|
| Error | -25 points |
| Warning | -5 points |

### Embodied Agent Bonus

For souls with `environment: "embodied"`, up to **+10 bonus points** for:
- `environment` field (+2)
- `interactionMode` field (+2)
- `hardwareConstraints` (+3)
- `safety.physical` (+3)

### Score Grades

| Score | Grade | Description |
|-------|-------|-------------|
| 90–100 | ✅ Verified | No significant issues |
| 70–89 | ⚠️ Low Risk | Minor warnings |
| 40–69 | 🟡 Medium Risk | Issues should be addressed |
| 1–39 | 🟠 High Risk | Significant issues |
| 0 | ❌ Blocked | Critical issues, cannot publish |

## Context-Aware Detection

SoulScan reduces false positives by checking context around each match:

- **Code blocks**: patterns inside `` ``` `` fenced blocks are skipped
- **Example indicators**: lines with "example", "e.g.", "placeholder", "sample", "test" skip matches
- **Placeholder patterns**: `user@example.com`, `sk-test...`, `password: <your_password>` are filtered
- **Well-known IPs**: `127.0.0.1`, `0.0.0.0`, `8.8.8.8`, `1.1.1.1`, etc. are not flagged

## Example Output

```
🔍 SoulScan Local — v1.4.0 (rules 1.4.0)
   Scanning /path/to/my-soul

   Found 5 files

⚠️  [MEM001] Email address found in memory file (memory/log.md, 1 occurrence)
⚠️  [MEM004] IP address found in memory file (memory/log.md, 1 occurrence)
✅ 4 checks passed
🧠 Memory Hygiene: 90/100

🔍 Score: 96/100 — Verified
   0 errors, 2 warnings, 4 passed
   Scanned in 3ms
```

## Package Limits

### File Size
- **Per file**: 100KB maximum
- **Per package**: 1MB maximum

### Allowed File Extensions

`.md`, `.json`, `.png`, `.jpg`, `.jpeg`, `.svg`, `.txt`, `.yaml`, `.yml`

## LLM Semantic Analysis (Stage 6)

Beyond regex patterns, SoulScan can use a **local LLM** to detect semantic issues that rules can't catch:

- Contradictions between personality and instructions
- Implicit jailbreak attempts disguised as harmless text
- PII that's obfuscated or encoded
- Cross-file inconsistencies (SOUL.md says one thing, AGENTS.md says another)

### Setup

Requires [Ollama](https://ollama.ai) running locally (free, offline, private):

```bash
# Install Ollama (macOS/Linux)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (any works — smaller = faster)
ollama pull gemma3:4b    # ~3GB, fast
ollama pull qwen3:8b     # ~5GB, more accurate

# Start Ollama
ollama serve
```

### Usage

```bash
# Semantic scan with auto-detected model
npx clawsouls scan . --semantic

# Specify a model
npx clawsouls scan . --semantic --model gemma3:4b

# Custom Ollama URL (default: http://localhost:11434)
npx clawsouls scan . --semantic --ollama-url http://192.168.1.10:11434
```

### Example Output

```
🔍 SoulScan Local — v1.4.0 (rules 1.4.0)
   Scanning /path/to/my-soul
   ...
🧠 LLM Semantic Analysis (gemma3:4b)

⚠️  [SEMANTIC] PII detected: email address in MEMORY.md line 12
⚠️  [SEMANTIC] Contradiction: SOUL.md says "never share personal data"
    but AGENTS.md instructs "report user preferences to dashboard"
⚠️  [SEMANTIC] Implicit override: SOUL.md contains phrasing that could
    bypass safety instructions in certain model contexts

   3 semantic findings (53s via qwen3:8b)
```

### How It Works

1. All text files in the soul package are concatenated
2. Sent to the local LLM with a security analysis prompt
3. LLM identifies: security risks, contradictions, attack vectors, PII, cross-file issues
4. Findings are merged into the scan result with severity levels

### Key Points

- **Cost: $0** — runs entirely on your local machine via Ollama
- **Privacy: 100%** — no data leaves your machine
- **Offline: yes** — works without internet after model download
- **Optional** — only runs when `--semantic` flag is used
- **Not required for publishing** — regex scan is sufficient for platform validation

## CI Integration

```bash
# Quick check — exit 0 = pass, exit 1 = fail
npx clawsouls scan ./my-soul -q

# JSON for programmatic use
npx clawsouls scan ./my-soul --json

# Full scan with semantic analysis (CI with Ollama available)
npx clawsouls scan ./my-soul --semantic --model gemma3:4b
```
