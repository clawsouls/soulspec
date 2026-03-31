---
sidebar_position: 3
title: ClawSouls Plugin for Claude Code
description: Install the ClawSouls plugin for Claude Code — persona management, SoulScan, TF-IDF memory search, and Swarm Memory sync.
---

# ClawSouls Plugin for Claude Code

The ClawSouls plugin brings persona management, safety verification, and intelligent memory directly into Claude Code via 5 slash commands and 9 MCP tools.

## Installation

```bash
# In Claude Code — two commands, that's it
/plugin marketplace add https://github.com/clawsouls/clawsouls-claude-code-plugin
/plugin install clawsouls
/reload-plugins
```

## Commands

| Command | What it does |
|---------|-------------|
| `/clawsouls:browse` | Search and install personas from ClawSouls |
| `/clawsouls:install` | Apply a persona to your project (generates CLAUDE.md) |
| `/clawsouls:scan` | Verify persona safety — 53 patterns, A+ to F grade |
| `/clawsouls:rollback` | Detect persona drift & restore identity |
| `/clawsouls:memory` | Git-based memory sync & TF-IDF search |

## Quick Start

```bash
# Browse personas
/clawsouls:browse coding agents

# Install one
/clawsouls:install clawsouls/surgical-coder

# Verify safety
/clawsouls:scan

# Search memory
/clawsouls:memory search "SDK version fix"

# Sync memory to Git
/clawsouls:memory sync
```

## MCP Tools

The plugin connects a `clawsouls-mcp` server providing 9 tools:

### Persona Management

| Tool | Description |
|------|-------------|
| `soul_search` | Search personas by keyword, category, or tag |
| `soul_get` | Get detailed info about a specific persona |
| `soul_install` | Download a persona and generate CLAUDE.md |

### Safety & Integrity

| Tool | Description |
|------|-------------|
| `soul_scan` | SoulScan — verify against 53 safety patterns (A+ to F) |
| `soul_rollback_check` | Compare current vs. baseline files, detect drift |

### Swarm Memory

| Tool | Description |
|------|-------------|
| `memory_search` | TF-IDF + BM25 ranked search across memory files |
| `memory_detail` | Fetch full content of a specific memory section |
| `memory_status` | File inventory, sizes, and git status |
| `memory_sync` | Multi-agent Git sync (init / push / pull / status) |

## Memory Search

### TF-IDF + BM25 Ranking (Default)

Zero cost. No embedding model. No API calls. Pure local keyword intelligence.

The search engine:
- Splits memory files into sections by markdown headings
- Tokenizes with support for English, Korean, and mixed content
- Applies BM25 term frequency saturation (`tf / (tf + 1.2)`)
- Boosts recent files (7 days: 1.3×, 30 days: 1.1×)
- Returns results ranked by relevance score

### 3-Layer Workflow

For token-efficient memory retrieval (~10× savings vs loading all files):

```
Step 1: memory_search query="auth bug"
        → compact index (~50 tokens/result)

Step 2: memory_detail file="memory/2026-03-31.md" line=15
        → full section content

Step 3: memory_search query="auth bug" enhanced=true
        → full snippets with score visualization
```

### Compatible Folder Structure

Works with [OpenClaw](https://openclaw.ai)'s memory layout:

```
MEMORY.md              # Long-term curated memory
memory/
  topic-*.md           # Project-specific status / decisions / history
  YYYY-MM-DD.md        # Daily logs
```

## Swarm Memory Sync

Share memory across multiple agents via a Git remote:

```bash
# Initialize (one time)
memory_sync action=init repo_url=git@github.com:user/agent-memory.git agent_name=brad

# Push local changes
memory_sync action=push

# Pull from other agents
memory_sync action=pull

# Check sync status
memory_sync action=status
```

### Architecture

```
[Agent A] ←→ [GitHub Private Repo] ←→ [Agent B]
  memory/        agent-memory           memory/
  MEMORY.md                             MEMORY.md
```

Each agent pushes and pulls from the same repo. Conflicts are resolved with `git pull --rebase`.

## SoulScan

Analyzes persona files against 53 safety patterns:

- Prompt injection detection
- Safety boundary verification
- Identity consistency checks
- Permission escalation detection
- Harmful instruction detection

Returns a grade (A+ to F) with actionable recommendations.

```bash
# Via command
/clawsouls:scan

# Via MCP tool
soul_scan files={"SOUL.md": "...", "IDENTITY.md": "..."}
```

## Soul Rollback

Detects persona drift by comparing current files against their original committed versions:

- Monitors tone, boundaries, roles, and safety constraints
- Flags critical safety line removals
- Severity levels: low / medium / high
- Recommends `git checkout` for high-severity drift

```bash
/clawsouls:rollback
```

## Auto-Activated Skills

The plugin includes skills that Claude activates automatically:

| Skill | Activates when... |
|-------|-------------------|
| Persona Manager | Discussing agent identity or Soul Spec files |
| SoulScan | Checking safety or after persona modifications |
| Swarm Memory | Managing memory files or syncing knowledge |
| Soul Rollback | Behavior seems inconsistent with persona |

## Cross-Platform

The same MCP server works across all platforms:

| Platform | Integration |
|----------|-------------|
| **Claude Code** | This plugin — `/clawsouls:*` commands |
| **OpenClaw** | Native SOUL.md support |
| **Cursor / Windsurf** | Add to `.mcp.json` |
| **Any MCP Client** | `npx -y clawsouls-mcp@latest` |

### Direct MCP Configuration

For clients without plugin support, add to `.mcp.json`:

```json
{
  "mcpServers": {
    "clawsouls": {
      "command": "npx",
      "args": ["-y", "clawsouls-mcp@latest"]
    }
  }
}
```

## Links

- [Plugin GitHub](https://github.com/clawsouls/clawsouls-claude-code-plugin)
- [MCP Server (npm)](https://www.npmjs.com/package/clawsouls-mcp)
- [ClawSouls Platform](https://clawsouls.ai)
- [Soul Spec Standard](https://soulspec.org)
