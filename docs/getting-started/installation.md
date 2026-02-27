---
sidebar_position: 2
title: Installation
description: Install the ClawSouls CLI.
---

# Installation

## Requirements

- **Node.js 22+** (check with `node -v`)
- npm or npx

## Install Options

### Use with npx (no install)

```bash
npx clawsouls <command>
```

### Install globally

```bash
npm install -g clawsouls
```

### Verify

```bash
clawsouls --version
clawsouls platform
```

The `platform` command shows your detected agent framework:

```
🔍 Agent Platform Detection

▶ Active: OpenClaw 🦞
  Workspace: /home/user/.openclaw/workspace
  Souls dir: /home/user/.openclaw/souls
  Restart:   openclaw gateway restart
```

## Supported Platforms

The CLI auto-detects your installed agent framework:

| Platform | Directory | Status |
|----------|-----------|--------|
| **OpenClaw** | `~/.openclaw/workspace/` | ✅ Auto-detected |
| **ZeroClaw** | `~/.zeroclaw/workspace/` | ✅ Auto-detected |
| **Clawdbot** | `~/.clawdbot/workspace/` | ✅ Auto-detected |
| **Moltbot** | `~/.moltbot/workspace/` | ✅ Auto-detected |
| **Moldbot** | `~/.moldbot/workspace/` | ✅ Auto-detected |
| **Custom** | Any path | ✅ Via `--workspace` or `--platform` |

### Override Platform

```bash
# Explicit platform
clawsouls --platform zeroclaw use surgical-coder

# Custom workspace path
clawsouls --workspace ~/my-agent/workspace use surgical-coder

# Environment variable
CLAWSOULS_PLATFORM=clawdbot clawsouls use surgical-coder
```

## MCP Server (Optional)

For Claude Desktop / Claude Code integration:

```bash
# Claude Code
claude mcp add soul-spec -- npx -y soul-spec-mcp

# Claude Desktop — add to config file:
# ~/Library/Application Support/Claude/claude_desktop_config.json
```

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

See the [MCP Server docs](/docs/api/mcp) for details.
