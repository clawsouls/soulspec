---
sidebar_position: 6
title: SoulClaw CLI
description: Full-featured AI agent in your terminal with semantic memory search, channel adapters, and automation.
---

# SoulClaw CLI

Full-featured AI agent in your terminal. Gateway-based architecture with multi-channel deployment.

## Overview

| Feature | Description |
|---------|-------------|
| **Tiered Bootstrap** | Loads only needed context — up to 60% fewer tokens per session |
| **Semantic Memory Search** | Vector-based memory recall powered by Ollama bge-m3 |
| **Channel Adapters** | Telegram, Discord, Slack, Signal, iMessage |
| **Gateway Architecture** | Centralized gateway with session management |
| **Cron Jobs** | Scheduled tasks and background automation |
| **Multi-Agent Sessions** | Multiple agents running concurrently |
| **SoulScan** | CLI-based security scanning |

## Tiered Bootstrap

SoulClaw CLI uses a **tiered bootstrapping** system that dramatically reduces token consumption:

- **Tier 0 (Always)**: SOUL.md, IDENTITY.md — core personality (~500 tokens)
- **Tier 1 (On demand)**: MEMORY.md, USER.md — loaded when relevant
- **Tier 2 (Lazy)**: memory/*.md, TOOLS.md — loaded only when referenced
- **Tier 3 (Search)**: Semantic search results — injected per-query

Instead of loading all files into every conversation, SoulClaw injects only what the current context requires. This means:

- **60% fewer tokens** on average per session
- **Faster responses** — less context to process
- **Lower cost** — pay only for tokens you actually need
- **Longer conversations** — more room before hitting context limits

Read more: [Tiered Bootstrap deep dive](https://blog.clawsouls.ai/en/posts/soulclaw-tiered-bootstrap/)

## Installation

```bash
npm install -g soulclaw
```

## Quick Start

```bash
# Interactive onboarding (gateway + workspace + channels)
soulclaw onboard

# Start the gateway
soulclaw gateway start

# Check status
soulclaw status
```

## Semantic Memory Search

SoulClaw CLI uses Ollama's bge-m3 embedding model for semantic memory retrieval. Unlike keyword matching, this finds contextually relevant memories even when exact words don't match.

### Setup

**Step 1: Install Ollama**

Download from [ollama.com](https://ollama.com) and install.

**Step 2: Pull the embedding model**

```bash
ollama pull bge-m3
```

> bge-m3 is ~600MB. It supports multilingual embeddings (English, Korean, Chinese, Japanese, etc.)

**Step 3: Enable memory search in SoulClaw**

```bash
soulclaw config set agents.defaults.memorySearch.enabled true
soulclaw config set agents.defaults.memorySearch.provider ollama
```

Or edit `~/.openclaw/openclaw.json` directly:

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "enabled": true,
        "provider": "ollama"
      }
    }
  }
}
```

**Step 4: Restart the gateway**

```bash
soulclaw gateway restart
```

**Step 5: Verify**

```bash
soulclaw memory status --deep
```

### How It Works

1. **Indexing**: Memory files (`MEMORY.md` + `memory/*.md`) are chunked and embedded on startup
2. **Query**: Each user message triggers a semantic search
3. **Retrieval**: Top-k relevant snippets are injected into context
4. **Update**: New memories are indexed in real-time

### Supported Providers

| Provider | Model | Setup |
|----------|-------|-------|
| **Ollama** (default) | bge-m3 | Local, free, multilingual |
| OpenAI | text-embedding-3-small | Requires API key |
| Gemini | embedding-001 | Requires API key |
| Voyage | voyage-3 | Requires API key |
| Mistral | mistral-embed | Requires API key |

## Channel Adapters

Deploy your agent to any messaging platform.

Supported channels:
- **Telegram** — Full support (inline buttons, reactions, voice)
- **Discord** — Threads, slash commands, voice
- **Slack** — App integration, threads
- **Signal** — End-to-end encrypted
- **iMessage** — macOS only (BlueBubbles)

### Telegram Setup Guide

**Step 1: Create a Telegram Bot**

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` and follow the prompts
3. Set a name and username for your bot
4. Copy the **Bot Token** (e.g., `7123456789:AAH...`)

**Step 2: Configure SoulClaw**

Option A — Interactive wizard:
```bash
soulclaw configure --section channels
# Select Telegram → Paste your Bot Token
```

Option B — Edit config directly (`~/.openclaw/openclaw.json`):
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "7123456789:AAH..."
    }
  }
}
```

**Step 3: Start the Gateway**

```bash
soulclaw gateway restart
```

**Step 4: Pair Your Account**

1. Open Telegram and send any message to your bot
2. A pairing code will appear in the terminal logs
3. Approve the pairing:

```bash
soulclaw pairing approve telegram <code>
```

**Step 5: (Optional) Restrict Access**

To allow only specific users:

```bash
soulclaw config set session.dmScope "per-channel-peer"
```

Your bot is now live — send it a message and it will respond with your soul's personality.

### Other Channels

For Discord, Slack, Signal, and iMessage, use the interactive wizard:

```bash
soulclaw configure --section channels
```

## Automation

### Cron Jobs

```bash
# Schedule tasks
soulclaw cron add --schedule "0 8 * * *" --message "Daily standup report"
```

### Background Sessions

```bash
# Spawn isolated agent sessions
soulclaw sessions spawn --task "Analyze logs and report issues"
```

## Soul Integration

SoulClaw CLI works with the same [Soul Spec](/docs/spec/overview) used by the VSCode extension:

```
workspace/
├── SOUL.md          # Personality
├── IDENTITY.md      # Name, avatar, emoji
├── MEMORY.md        # Long-term memory
├── memory/          # Daily logs
├── AGENTS.md        # Workflow rules
├── USER.md          # User preferences
└── TOOLS.md         # Tool configuration
```

## Switching Souls

To change your AI's persona:

```bash
# 1. Install the soul
clawsouls install clawsouls/charlie

# 2. Apply it to your workspace
clawsouls use clawsouls/charlie

# 3. Restart the gateway
soulclaw gateway restart

# 4. Start a fresh session
# Send /new in Telegram/chat to clear previous persona context
```

:::caution Session Reset Required
After switching souls, **you must start a new session** (`/new` in Telegram, or refresh the gateway chat UI). The previous conversation history contains responses from the old persona — the LLM will continue mimicking it until the session is cleared.

This applies to all chat interfaces: Telegram, Discord, gateway web UI, etc.
:::

To revert to your previous soul:
```bash
clawsouls restore
soulclaw gateway restart
# Send /new in chat
```

## SoulScan

Scan soul files for security and quality issues directly from the terminal.

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

SoulScan runs a **4-stage pipeline**: Schema → File Structure → Security (58+ rules) → Quality.

| Score | Grade | Meaning |
|-------|-------|---------|
| 90-100 | Verified | Clean, no issues |
| 70-89 | Low Risk | Minor warnings |
| 40-69 | Medium Risk | Needs attention |
| 1-39 | High Risk | Significant issues |
| 0 | Blocked | Critical security problems |

**Inline Scanning**: SoulScan also runs automatically after agent turns (rate-limited to once per 5 minutes) when SOUL.md or soul.json exists in the workspace.

You can also use the clawsouls CLI for quick scans:

```bash
clawsouls soulscan
clawsouls soulscan -q    # Quick mode (single-line output)
```

## Persona Engine

Monitor persona drift — detect when an agent's responses deviate from its defined personality in SOUL.md.

### Enable Drift Detection

Drift detection is **disabled by default**. Enable it with:

```bash
soulclaw persona config --enable
```

### Configuration

```bash
# View current settings
soulclaw persona config

# Check every N agent responses (default: 5)
soulclaw persona config --interval 3

# Set warning threshold (0-1, default: 0.3)
soulclaw persona config --threshold 0.4

# Set severe alert threshold (0-1, default: 0.7)
soulclaw persona config --severe 0.8

# Enable/disable notifications
soulclaw persona config --notify
soulclaw persona config --no-notify

# Use Ollama (default) or keyword-only detection
soulclaw persona config --no-ollama

# Set Ollama model
soulclaw persona config --model qwen3:8b

# Disable drift detection
soulclaw persona config --disable
```

Config is stored in `openclaw.json`:

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
# Check a response against SOUL.md persona
soulclaw persona check --text "Here is my response to evaluate"

# View parsed persona rules
soulclaw persona rules
soulclaw persona rules --json

# View drift check history
soulclaw persona metrics
soulclaw persona metrics -n 10
```

### How It Works

1. Every N responses, the last assistant message is compared to SOUL.md rules
2. **Ollama** (default) or **keyword matching** (fallback) computes a drift score (0 = perfect, 1 = full deviation)
3. Above the warning threshold → **reminder injected** + notification sent
4. Above the severe threshold → **severe warning** + urgent notification

### Notifications

When drift is detected, alerts are sent via the gateway to your configured messaging channels (Telegram, Discord, etc.):

```
⚠️ Persona Drift WARNING
Score: 0.450 (method: keyword)
Session: agent:main:telegram:12345
Action: reminder
```

## Swarm Memory

Sync memory files across multiple agents or devices via a shared Git repository.

### Initialize

```bash
# Initialize swarm memory
soulclaw swarm init

# With a remote repository
soulclaw swarm init --remote git@github.com:user/swarm-memory.git

# Custom directory
soulclaw swarm init --dir ~/my-swarm
```

### Status & Sync

```bash
# Check swarm status
soulclaw swarm status

# Force sync now
soulclaw swarm sync

# Sync with LLM-powered semantic merge for conflicts
soulclaw swarm sync --llm-merge

# Specify Ollama model for merge
soulclaw swarm sync --llm-merge --model gemma3:4b
```

### Conflict Resolution

When multiple agents modify the same files, conflicts can occur:

```bash
# Auto-resolve with LLM semantic merge (default)
soulclaw swarm resolve

# Resolve a specific file
soulclaw swarm resolve MEMORY.md

# Keep our version
soulclaw swarm resolve --ours

# Keep their version
soulclaw swarm resolve --theirs

# List conflicted files for manual editing
soulclaw swarm resolve --manual
```

The **LLM semantic merge** sends conflicted files to Ollama, which preserves unique information from both sides, removes duplicates, and resolves intelligently. Falls back to "ours" if Ollama is unavailable.

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

Auto-sync runs every 10 minutes when the gateway is running, copying `MEMORY.md` and `memory/*.md` between workspace and swarm repo.

## Comparison with VSCode Extension

|  | SoulClaw CLI | SoulClaw for VSCode |
|--|-------------|-------------------|
| **Killer Feature** | Semantic Memory Search | Swarm Memory + Checkpoints + Visual UI |
| **LLM Engine** | Gateway-based | Embedded, direct API |
| **Target** | Terminal users, automation | IDE users, developers |
| **Channels** | Telegram, Discord, Slack, Signal | VSCode chat panel |
| **Setup** | npm install + config | Install extension + API key |

## Links

- [GitHub](https://github.com/clawsouls/soulclaw)
- [npm](https://www.npmjs.com/package/soulclaw)
- [Soul Spec](/docs/spec/overview)
- [SoulScan](/docs/platform/soulscan)
