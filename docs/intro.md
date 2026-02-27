---
sidebar_position: 1
slug: /intro
title: What is Soul Spec?
---

# What is Soul Spec?

**Soul Spec** is an open standard for defining AI agent personas. It gives your AI a persistent identity — personality, tone, behavioral rules, and workflow preferences — in a structured, portable format.

## The Problem

Every AI agent framework has its own way of handling custom instructions:
- Claude Code reads `CLAUDE.md`
- Cursor uses `.cursorrules` or `.cursor/rules/`
- Windsurf uses `.windsurfrules`
- OpenClaw reads `SOUL.md` from the workspace

Your agent's personality is locked to one tool. Switch frameworks, and you start over.

## The Solution

Soul Spec standardizes persona definition into a portable package:

```
my-soul/
├── soul.json       # Metadata (name, version, author, tags)
├── SOUL.md         # Core personality & behavior
├── IDENTITY.md     # Name, appearance, background
├── AGENTS.md       # Workflow rules & tool usage
├── STYLE.md        # Communication style
└── HEARTBEAT.md    # Periodic check-in behavior
```

One persona definition, multiple frameworks. Install a soul, export it to your tool's format, and your AI becomes the same agent everywhere.

## Key Features

- **Portable** — Works with OpenClaw, Claude Code, Claude Desktop, Cursor, Windsurf, and any SOUL.md-compatible framework
- **Structured** — Each file has a clear purpose, not one giant prompt
- **Versioned** — Spec versions (v0.3, v0.4, v0.5) with clear migration paths
- **Secure** — SoulScan checks for prompt injection, secret leaks, and 50+ patterns
- **Shareable** — Publish to [clawsouls.ai](https://clawsouls.ai) registry, install with one command
- **Git-friendly** — Plain markdown files, clean diffs, full version history

## Quick Example

```bash
# Install a soul from the registry
npx clawsouls install clawsouls/surgical-coder

# Activate it in your agent
npx clawsouls use surgical-coder
```

Or create your own:

```bash
npx clawsouls init my-agent
# Edit the generated files, then publish
npx clawsouls publish ./my-agent
```

## Latest Version

The current spec version is **v0.5**, which adds support for robotics and embodied agents with sensor/actuator schemas. See the [Spec Overview](/docs/spec/overview) for details.

## Next Steps

- [Quick Start](/docs/getting-started/quick-start) — Get up and running in 5 minutes
- [Spec Overview](/docs/spec/overview) — Understand the spec structure
- [Framework Guides](/docs/guides/openclaw) — Set up Soul Spec with your tool
