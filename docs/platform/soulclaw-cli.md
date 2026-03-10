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
npm install -g openclaw
```

## Quick Start

```bash
# Initial setup
openclaw setup

# Start the gateway
openclaw gateway start

# Check status
openclaw status
```

## Semantic Memory Search

SoulClaw CLI uses Ollama's bge-m3 embedding model for semantic memory retrieval. Unlike keyword matching, this finds contextually relevant memories even when exact words don't match.

```bash
# Install Ollama + embedding model
ollama pull bge-m3

# Memory search happens automatically during conversations
# The agent searches MEMORY.md + memory/*.md using vector similarity
```

### How It Works

1. **Indexing**: Memory files are chunked and embedded on startup
2. **Query**: Each user message triggers a semantic search
3. **Retrieval**: Top-k relevant snippets are injected into context
4. **Update**: New memories are indexed in real-time

## Channel Adapters

Deploy your agent to any messaging platform:

```yaml
# openclaw.json
{
  "telegram": {
    "token": "BOT_TOKEN",
    "allowedUsers": ["user_id"]
  }
}
```

Supported channels:
- **Telegram** — Full support (inline buttons, reactions, voice)
- **Discord** — Threads, slash commands, voice
- **Slack** — App integration, threads
- **Signal** — End-to-end encrypted
- **iMessage** — macOS only (BlueBubbles)

## Automation

### Cron Jobs

```bash
# Schedule tasks
openclaw cron add --schedule "0 8 * * *" --message "Daily standup report"
```

### Background Sessions

```bash
# Spawn isolated agent sessions
openclaw sessions spawn --task "Analyze logs and report issues"
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

## SoulScan

Run security scans from the terminal:

```bash
# Scan current soul package
clawsouls soulscan

# Quick scan (for cron)
clawsouls soulscan -q

# Initialize baseline
clawsouls soulscan --init
```

## Comparison with VSCode Extension

|  | SoulClaw CLI | SoulClaw for VSCode |
|--|-------------|-------------------|
| **Killer Feature** | Semantic Memory Search | Swarm Memory + Checkpoints + Visual UI |
| **LLM Engine** | Gateway-based | Embedded, direct API |
| **Target** | Terminal users, automation | IDE users, developers |
| **Channels** | Telegram, Discord, Slack, Signal | VSCode chat panel |
| **Setup** | npm install + config | Install extension + API key |

## Links

- [GitHub](https://github.com/clawsouls/soulclaw-cli)
- [npm](https://www.npmjs.com/package/openclaw)
- [Soul Spec](/docs/spec/overview)
- [SoulScan](/docs/platform/soulscan)
