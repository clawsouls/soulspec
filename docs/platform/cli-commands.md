---
sidebar_position: 7
title: CLI Commands
description: SoulClaw CLI commands for SoulScan, Persona Engine, and Swarm Memory.
---

# SoulClaw CLI Commands

SoulClaw extends OpenClaw with three key modules: **SoulScan** (security scanning), **Persona Engine** (drift detection), and **Swarm Memory** (multi-agent sync). Each has dedicated CLI commands.

## SoulScan

Scan soul files for security and quality issues.

### Usage

```bash
# Scan workspace (default)
soulclaw soulscan

# Scan a specific directory
soulclaw soulscan ./my-soul

# JSON output (for CI/CD pipelines)
soulclaw soulscan --json

# Set minimum passing score (default: 30)
soulclaw soulscan --min-score 70
```

### What It Checks

SoulScan runs a 4-stage pipeline:

1. **Schema Validation** — Valid soul.json / SOUL.md structure
2. **File Structure** — Allowed extensions, file sizes, total package size
3. **Security** — 58+ pattern rules (prompt injection, data exfiltration, harmful content)
4. **Quality** — Completeness, best practices

### Scoring

| Score | Grade | Meaning |
|-------|-------|---------|
| 90-100 | Verified | Clean, no issues |
| 70-89 | Low Risk | Minor warnings |
| 40-69 | Medium Risk | Needs attention |
| 1-39 | High Risk | Significant issues |
| 0 | Blocked | Critical security problems |

### Inline Scanning

SoulScan also runs automatically after agent turns (rate-limited to once per 5 minutes). This is always active when SOUL.md or soul.json exists in the workspace — no configuration needed.

---

## Persona Engine

Monitor persona drift — detect when an agent's responses deviate from its defined personality in SOUL.md.

### Configuration

Persona drift detection is **disabled by default**. Enable it via CLI:

```bash
# Enable drift detection
soulclaw persona config --enable

# Disable drift detection
soulclaw persona config --disable

# View current settings
soulclaw persona config
```

#### Configuration Options

```bash
# Check every N agent responses (default: 5)
soulclaw persona config --interval 3

# Set warning threshold (0-1, default: 0.3)
soulclaw persona config --threshold 0.4

# Set severe alert threshold (0-1, default: 0.7)
soulclaw persona config --severe 0.8

# Enable/disable Telegram notifications
soulclaw persona config --notify
soulclaw persona config --no-notify

# Use Ollama for detection (default) or keyword-only
soulclaw persona config --ollama
soulclaw persona config --no-ollama

# Set Ollama model
soulclaw persona config --model qwen3:8b
```

This writes to `openclaw.json`:

```json
{
  "agents": {
    "defaults": {
      "personaDrift": {
        "enabled": true,
        "checkInterval": 5,
        "driftThreshold": 0.3,
        "severeThreshold": 0.7,
        "notify": true,
        "useOllama": true,
        "ollamaModel": "qwen3:8b"
      }
    }
  }
}
```

### Manual Drift Check

```bash
# Check a specific response against SOUL.md persona
soulclaw persona check --text "Here is my response to evaluate"

# View parsed persona rules from SOUL.md
soulclaw persona rules
soulclaw persona rules --json

# View drift check history
soulclaw persona metrics
soulclaw persona metrics -n 10
```

### How Drift Detection Works

1. **Every N responses** (configurable), the last assistant message is compared to SOUL.md rules
2. **Ollama** (default) or **keyword matching** (fallback) computes a drift score (0 = perfect match, 1 = full deviation)
3. If score exceeds the warning threshold:
   - A **reminder** is injected into the next prompt
   - A **notification** is sent via Telegram/gateway (if enabled)
4. If score exceeds the severe threshold:
   - A **severe warning** is injected
   - An **urgent notification** is sent

### Notifications

When drift is detected and notifications are enabled, alerts are sent via the gateway to your configured messaging channels (Telegram, Discord, Slack, etc.):

```
⚠️ Persona Drift WARNING
Score: 0.450 (method: keyword)
Session: agent:main:telegram:12345
Action: reminder
```

---

## Swarm Memory

Sync memory files across multiple agents or devices via a shared Git repository.

### Quick Start

```bash
# Initialize swarm memory
soulclaw swarm init

# Initialize with a remote repository
soulclaw swarm init --remote git@github.com:user/swarm-memory.git

# Custom directory
soulclaw swarm init --dir ~/my-swarm
```

### Status & Sync

```bash
# Check swarm status
soulclaw swarm status

# Force sync now (default: fallback to "ours" on conflicts)
soulclaw swarm sync

# Sync with LLM-powered semantic merge for conflicts
soulclaw swarm sync --llm-merge

# Specify Ollama model for merge
soulclaw swarm sync --llm-merge --model gemma3:4b
```

### Conflict Resolution

When multiple agents modify the same memory files, conflicts can occur. SoulClaw offers multiple resolution strategies:

```bash
# Auto-resolve all conflicts with LLM (default)
soulclaw swarm resolve

# Resolve a specific file
soulclaw swarm resolve MEMORY.md

# Keep our version (discard theirs)
soulclaw swarm resolve --ours

# Keep their version (discard ours)
soulclaw swarm resolve --theirs

# List conflicted files for manual editing
soulclaw swarm resolve --manual

# Use a specific Ollama model
soulclaw swarm resolve --model gemma3:4b
```

#### LLM Semantic Merge

When `--llm-merge` or `--llm` is used, SoulClaw sends the conflicted file to Ollama with instructions to:
- Preserve all unique information from both sides
- Remove duplicate entries
- Keep the most recent/complete version of conflicting entries
- Remove all conflict markers

If Ollama is unavailable, it falls back to the "ours" strategy automatically.

### Configuration

```json
{
  "agents": {
    "defaults": {
      "swarm": {
        "dir": "~/.openclaw/swarm",
        "autoSync": true,
        "syncIntervalMinutes": 10
      }
    }
  }
}
```

### Auto-Sync

When a swarm repository is initialized and the gateway is running, memory files are automatically synced every 10 minutes (configurable). The sync copies:
- `MEMORY.md` — Long-term curated memory
- `memory/*.md` — Daily/session memory files

### Architecture

```
Agent A (Mac)                    Agent B (Server)
    │                                │
    ├─ workspace/MEMORY.md           ├─ workspace/MEMORY.md
    ├─ workspace/memory/*.md         ├─ workspace/memory/*.md
    │                                │
    └─── swarm sync ──→ Git Repo ←── swarm sync ───┘
                            │
                     Conflict Resolution
                     ├── LLM Semantic Merge
                     ├── Keep Ours
                     ├── Keep Theirs
                     └── Manual Edit
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `soulclaw soulscan` | Scan soul files for security issues |
| `soulclaw persona config --enable` | Enable drift detection |
| `soulclaw persona check --text "..."` | Manual drift check |
| `soulclaw persona metrics` | View drift history |
| `soulclaw persona rules` | View parsed persona rules |
| `soulclaw swarm init` | Initialize swarm memory |
| `soulclaw swarm status` | Check swarm status |
| `soulclaw swarm sync --llm-merge` | Sync with LLM merge |
| `soulclaw swarm resolve` | Resolve conflicts |
