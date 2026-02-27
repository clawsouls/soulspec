---
sidebar_position: 3
title: Claude Desktop + Soul Spec
description: Give Claude Desktop a persistent persona using the Soul Spec MCP server.
---

# Claude Desktop + Soul Spec

Claude Desktop is Anthropic's native macOS/Windows app for Claude. It supports MCP (Model Context Protocol) servers — external tools that extend what Claude can do.

**soul-spec-mcp** connects Claude Desktop to the [ClawSouls](https://clawsouls.ai) persona registry. Search, preview, and apply AI personas directly from the conversation.

## Setup (1 minute)

### 1. Open your config file

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

### 2. Add the MCP server

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

### 3. Restart Claude Desktop

Done. The soul-spec tools are now available.

## What You Can Do

Just ask Claude in natural language:

- *"Find me a concise coding persona"*
- *"Show me what surgical-coder looks like"*
- *"Apply the TomLeeLive/brad persona"*
- *"What kinds of personas are available?"*

## Available Tools

| Tool | What it does |
|------|-------------|
| `search_souls` | Search by keyword, category, or tag |
| `get_soul` | Detailed info about a specific soul |
| `apply_persona` | Apply persona to current conversation |
| `preview_soul` | Preview without applying |
| `list_categories` | Browse persona categories |

## How It Works

When you say "Apply the brad persona", Claude calls the MCP server which:

1. Downloads soul files from the ClawSouls registry
2. Converts `SOUL.md`, `IDENTITY.md`, `STYLE.md`, `AGENTS.md` into a unified prompt
3. Applies it to the current conversation

## Also Works With Claude Cowork

Claude Cowork internally runs Claude Code CLI, which reads `CLAUDE.md`. You can also export:

```bash
clawsouls export claude-md --dir ./my-agent -o ~/cowork-tasks/CLAUDE.md
```

## Tips

- **Persona persists per conversation.** Start a new conversation to reset.
- **Combine with Projects.** Claude Desktop Projects have custom instructions — Soul Spec personas complement these.
- **SoulScan.** All published souls are security-scanned. Check scores at [clawsouls.ai/soulscan](https://clawsouls.ai/soulscan).
