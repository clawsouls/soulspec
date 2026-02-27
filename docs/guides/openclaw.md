---
sidebar_position: 1
title: OpenClaw + Soul Spec
description: Configure your OpenClaw AI agent's personality using Soul Spec.
---

# OpenClaw + Soul Spec

OpenClaw supports SOUL.md-based persona configuration natively. Soul Spec extends this with a structured, portable format that gives your agent a complete identity.

## Quick Start

### 1. Create a Soul Package

```bash
npx clawsouls init my-soul
```

This scaffolds a Soul Spec template directory:

```
├── soul.json      # Metadata
├── SOUL.md        # Personality & tone
├── IDENTITY.md    # Agent identity
├── AGENTS.md      # Behavioral rules
├── HEARTBEAT.md   # Periodic check-in
└── STYLE.md       # Communication style
```

### 2. Copy to Your OpenClaw Workspace

```bash
cp SOUL.md IDENTITY.md AGENTS.md ~/.openclaw/workspace/
```

OpenClaw automatically reads these files from its workspace directory.

### 3. Customize

Edit `SOUL.md` to define your agent's personality:

```markdown
# Agent Name — Role

You are [Name]. A [tone] [role] who [core behavior].

## Personality
- **Tone**: [Professional / Casual / Technical]
- **Style**: [Concise / Detailed / Conversational]

## Principles
- [Key behavior 1]
- [Key behavior 2]
```

### 4. Verify with SoulScan

```bash
npx clawsouls soulscan
```

SoulScan checks for schema compliance, security issues (prompt injection, secret leaks), and persona consistency across files.

## Why Soul Spec for OpenClaw?

| Without Soul Spec | With Soul Spec |
|---|---|
| Personality in one big SOUL.md | Structured across focused files |
| No version tracking | Git-friendly, full history |
| No security checks | SoulScan automated verification |
| Not shareable | Publish to ClawSouls marketplace |
| Locked to OpenClaw | Portable to any framework |

## Install a Community Soul

```bash
npx clawsouls install owner/soul-name
npx clawsouls use soul-name
openclaw gateway restart
```

Browse pre-built personas at [clawsouls.ai](https://clawsouls.ai).
