---
sidebar_position: 3
title: ClawSouls Plugin for Claude
description: Install the ClawSouls Cowork plugin — persona management, Telegram/Discord channels, SoulScan safety verification, and persistent memory.
---

# ClawSouls Plugin for Claude

The ClawSouls plugin brings Soul Spec v0.5 persona management to Claude Code and Claude Cowork. Load personas from the registry, verify safety, manage persistent memory, and connect via Telegram or Discord.

## Installation

### Option A: Local Plugin (Recommended)

No marketplace registration needed:

```bash
# Clone the plugin
git clone https://github.com/clawsouls/clawsouls-claude-code-plugin.git ~/.claude/clawsouls-plugin

# Launch Claude Code with the plugin
claude --plugin-dir ~/.claude/clawsouls-plugin
```

### Option B: CLAUDE.md Only (Simplest)

No plugin needed — just the persona:

```bash
# Export any soul from the registry
npx clawsouls export claude-md TomLeeLive/brad > CLAUDE.md

# Or manually combine Soul Spec files
cat SOUL.md IDENTITY.md AGENTS.md > CLAUDE.md

# Claude Code auto-reads CLAUDE.md from project root
claude
```

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Claude Code | v2.1.80+ | Channels require v2.1.80+ |
| Node.js | 18+ | For soul-spec-mcp server |
| [Bun](https://bun.sh) | 1.0+ | Only for Telegram/Discord channels |

## Commands

| Command | What it does |
|---------|-------------|
| `/clawsouls:load-soul` | Download and install a soul from the registry |
| `/clawsouls:activate` | Apply the current soul to the session |
| `/clawsouls:browse` | Search personas by keyword or category |
| `/clawsouls:scan` | Safety verification — 53 patterns, A+ to F grade |
| `/clawsouls:export` | Package current persona as Soul Spec directory |
| `/clawsouls:memory` | Search, read, write, and manage memory files |

## Quick Start

```bash
# Load a persona from the registry
/clawsouls:load-soul TomLeeLive/brad

# Activate the persona
/clawsouls:activate

# Verify safety
/clawsouls:scan

# Search memory
/clawsouls:memory search "SDK version fix"

# Browse the registry
/clawsouls:browse coding assistant
```

## Telegram Integration

Connect Claude Code to Telegram for mobile access. Your agent responds from Telegram while Claude Code runs in the background.

### Setup

1. **Create a Telegram bot**: Open [@BotFather](https://t.me/BotFather) → `/newbot` → copy the token

2. **Install the Telegram channel plugin**:
   ```
   /plugin install telegram@claude-plugins-official
   /telegram:configure <YOUR_BOT_TOKEN>
   ```

3. **Restart with both plugins**:
   ```bash
   claude --plugin-dir ~/.claude/clawsouls-plugin \
          --channels plugin:telegram@claude-plugins-official
   ```

4. **Pair your account**: Send any message to your bot → receive a pairing code → in Claude Code:
   ```
   /telegram:access pair <CODE>
   /telegram:access policy allowlist
   ```

5. **Activate your persona**:
   ```
   /clawsouls:activate
   ```

### Always-On (Background)

```bash
# Run in tmux for persistent sessions
tmux new-session -d -s agent \
  'claude --plugin-dir ~/.claude/clawsouls-plugin \
          --channels plugin:telegram@claude-plugins-official'
```

## MCP Tools

The plugin connects [soul-spec-mcp](https://github.com/clawsouls/soul-spec-mcp) v0.4.0, providing 12 tools:

### Persona Management

| Tool | Description |
|------|-------------|
| `search_souls` | Search personas by keyword, category, or tag |
| `get_soul` | Get detailed info about a specific persona |
| `install_soul` | Download and save original Soul Spec files locally |
| `preview_soul` | Preview before installing |
| `apply_persona` | Apply to current session (temporary, no file save) |
| `list_categories` | List available persona categories |

### Safety & Integrity

| Tool | Description |
|------|-------------|
| `soul_scan` | SoulScan — verify against 53 safety patterns (A+ to F) |
| `soul_rollback_check` | Compare current vs. baseline files, detect drift |

### Memory

| Tool | Description |
|------|-------------|
| `memory_search` | TF-IDF + BM25 ranked search (supports `enhanced` mode for full snippets) |
| `memory_get` | Fetch specific memory file content by line range |
| `memory_status` | File inventory, sizes, last modified dates, git status |
| `memory_sync` | Multi-agent Git sync (init / push / pull / status) |

## Memory System

The plugin maintains persistent context across sessions using an OpenClaw-compatible memory layout:

```
project/
├── MEMORY.md           # Curated long-term knowledge (max 200 lines)
├── memory/
│   ├── topic-*.md      # Topic-specific context (Status/Decisions/History)
│   └── YYYY-MM-DD.md   # Daily session logs
```

### Automatic Memory via Hooks

| Hook | Type | When | Action |
|------|------|------|--------|
| SessionStart | prompt | Session opens | Detects SOUL.md presence |
| PreCompact | agent | Before compaction | Saves context to memory files |
| PostCompact | prompt | After compaction | Reloads SOUL.md |
| FileChanged | prompt | SOUL.md/IDENTITY.md modified | Alerts persona drift |
| SessionEnd | agent | Session closes | Flushes unsaved context |

### Memory Search

Zero-cost, local TF-IDF search with:
- BM25 term frequency saturation
- Korean + English tokenization
- Recency boost (7 days: 1.3×, 30 days: 1.1×)

```
/clawsouls:memory search "trademark filing"
```

## Soul File Locations

The plugin checks these locations in priority order:

1. `./SOUL.md` — Project-local (highest priority)
2. `~/.clawsouls/active/current/SOUL.md` — Global active soul (symlink)

When you run `/clawsouls:load-soul owner/name`, files are saved to `~/.clawsouls/active/owner/name/` and `current` is updated to point there.

## SoulScan

Analyzes persona files against 53 safety patterns:

- Prompt injection detection
- Safety boundary verification  
- Identity consistency checks
- Permission escalation detection

```
/clawsouls:scan                      # Active soul
/clawsouls:scan TomLeeLive/brad      # Registry soul
/clawsouls:scan ./my-agent/          # Local directory
```

## Troubleshooting

### Telegram bot doesn't respond

1. **Missing `--channels` flag**: Must use `claude --channels plugin:telegram@...`
2. **Bun not in PATH**: Run `curl -fsSL https://bun.sh/install | bash`, then `source ~/.zshrc`
3. **Token not configured**: Run `/telegram:configure <TOKEN>` or save to `~/.claude/channels/telegram/.env`
4. **Another process consuming updates**: If you called `getUpdates` via curl, clear with:
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/getUpdates?offset=-1"
   ```

### Plugin commands not showing

Ensure you're using `--plugin-dir`:
```bash
claude --plugin-dir ~/.claude/clawsouls-plugin
```

### CLAUDE.md conflicts with loaded soul

If both `CLAUDE.md` and a loaded soul exist, Claude receives conflicting instructions. Choose one approach:
- Remove `CLAUDE.md` and use `/clawsouls:activate` only
- Or keep `CLAUDE.md` as the sole persona source

### MCP server fails

```bash
# Test manually
npx soul-spec-mcp@0.3.0

# Remote fallback (edit .mcp.json in plugin dir)
{
  "mcpServers": {
    "soul-spec": {
      "type": "url",
      "url": "https://soul-change-production.up.railway.app/mcp"
    }
  }
}
```

## Cross-Platform

The same persona and MCP server work across platforms:

| Platform | Integration |
|----------|-------------|
| **Claude Code / Cowork** | This plugin — `/clawsouls:*` commands |
| **OpenClaw / SoulClaw** | Native Soul Spec support |
| **Cursor** | `.cursor/rules/` + `.mcp.json` |
| **Windsurf** | `.windsurfrules` + `.mcp.json` |
| **Any MCP client** | `npx soul-spec-mcp@0.3.0` |

## Links

- [Plugin Repository](https://github.com/clawsouls/clawsouls-claude-code-plugin)
- [MCP Server (npm)](https://www.npmjs.com/package/soul-spec-mcp)
- [ClawSouls Registry](https://clawsouls.ai/souls)
- [Soul Spec Standard](https://soulspec.org)
