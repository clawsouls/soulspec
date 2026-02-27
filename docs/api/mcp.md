---
sidebar_position: 2
title: MCP Server
description: soul-spec-mcp — browse, install, and manage AI agent personas via MCP.
---

# MCP Server (soul-spec-mcp)

MCP server for browsing, installing, and managing AI agent personas via [Soul Spec](https://clawsouls.ai/spec).

Give your Claude agent a persistent identity — browse 80+ personas, preview them, and install as `CLAUDE.md` with one command.

[![npm](https://img.shields.io/npm/v/soul-spec-mcp)](https://www.npmjs.com/package/soul-spec-mcp)

## Quick Start

### Claude Desktop / Cowork

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "soul-spec": {
      "command": "npx",
      "args": ["-y", "soul-spec-mcp"]
    }
  }
}
```

Restart Claude Desktop. You can now ask Claude: *"Search for coding personas and install one"*

### Claude Code

```bash
claude mcp add soul-spec -- npx -y soul-spec-mcp
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "soul-spec": {
      "command": "npx",
      "args": ["-y", "soul-spec-mcp"]
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `search_souls` | Search personas by keyword, category, or tag |
| `get_soul` | Get detailed info about a specific soul |
| `apply_persona` | Apply a persona to the current conversation instantly |
| `install_soul` | Download and convert to CLAUDE.md (permanent) |
| `preview_soul` | Preview CLAUDE.md output without saving |
| `list_categories` | Browse available persona categories |

## How It Works

1. **Search** — Find personas from the [ClawSouls](https://clawsouls.ai) registry
2. **Preview** — See what the CLAUDE.md will look like
3. **Install** — Downloads the soul and generates a `CLAUDE.md` file
4. Claude automatically reads `CLAUDE.md` as project instructions

Soul Spec files (`SOUL.md`, `IDENTITY.md`, `STYLE.md`, `AGENTS.md`, `HEARTBEAT.md`) are merged into a single `CLAUDE.md` that Claude Code and Cowork understand natively.

## Examples

Ask Claude:

- *"Search for creative writing personas"*
- *"Show me details about TomLeeLive/brad"*
- *"Install the surgical-coder soul to my project folder"*
- *"What categories of souls are available?"*
