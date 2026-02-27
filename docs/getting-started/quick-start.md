---
sidebar_position: 1
title: Quick Start
description: Get up and running with Soul Spec in 5 minutes.
---

# Quick Start

Get a persona running on your AI agent in under 5 minutes.

## Option 1: Install a Community Soul

Browse souls at [clawsouls.ai/souls](https://clawsouls.ai/souls), then:

```bash
# Install the CLI
npm install -g clawsouls

# Install a soul from the registry
clawsouls install clawsouls/surgical-coder

# Activate it (auto-detects your platform)
clawsouls use surgical-coder

# Restart your agent session — done!
```

The CLI auto-detects your installed platform (OpenClaw, ZeroClaw, Clawdbot, etc.) and copies soul files to the right workspace.

## Option 2: Create Your Own

```bash
# Scaffold a new soul
clawsouls init my-agent
cd my-agent
```

This creates:

```
my-agent/
├── soul.json       # Metadata
├── SOUL.md         # Personality & tone
├── IDENTITY.md     # Name, role, traits
├── AGENTS.md       # Workflow rules
├── HEARTBEAT.md    # Periodic behavior
└── README.md       # Description
```

Edit the files to define your agent's personality, then:

```bash
# Validate
clawsouls validate

# Security scan
clawsouls soulscan

# Publish to the registry
clawsouls login <your-token>
clawsouls publish .
```

## Export to Other Frameworks

Soul Spec works with any SOUL.md-compatible tool:

```bash
# Claude Code / Claude Cowork
clawsouls export claude-md --dir ./my-agent -o ./project/CLAUDE.md

# Cursor
clawsouls export cursorrules --dir ./my-agent -o ./project/.cursorrules

# Windsurf
clawsouls export windsurfrules --dir ./my-agent -o ./project/.windsurfrules
```

## Use the MCP Server

For Claude Desktop and other MCP-compatible tools:

```bash
claude mcp add soul-spec -- npx -y soul-spec-mcp
```

Then just say: *"Apply the surgical-coder persona"* — no files to manage.

## Next Steps

- [Installation](/docs/getting-started/installation) — Detailed CLI setup
- [Your First Soul](/docs/getting-started/your-first-soul) — Step-by-step soul creation
- [Framework Guides](/docs/guides/openclaw) — Platform-specific setup
