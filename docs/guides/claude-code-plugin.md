---
sidebar_position: 3
title: ClawSouls Plugin for Claude Code
description: Install the ClawSouls plugin for Claude Code — persona management, Telegram/Discord channels, SoulScan safety verification, and persistent memory.
---

# ClawSouls Plugin for Claude Code

The ClawSouls plugin brings Soul Spec v0.5 persona management to Claude Code. Load personas from the registry, verify safety, manage persistent memory, and connect via Telegram or Discord.

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
npx clawsouls install clawsouls/brad && npx clawsouls export claude-md > CLAUDE.md

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
| `/clawsouls:rollback` | Compare current vs. baseline persona, detect drift |
| `/clawsouls:memory` | Search, read, write, and manage memory files |
| `/clawsouls:migrate` | Migrate from OpenClaw — auto-scan, preview, confirm, execute |

## Quick Start

```bash
# Load a persona from the registry
/clawsouls:load-soul clawsouls/brad

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

The plugin connects [soul-spec-mcp](https://github.com/clawsouls/soul-spec-mcp) v0.5.0, providing 12 tools:

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
| `memory_search` | Hybrid TF-IDF + semantic search (auto-detects Ollama for bge-m3 embeddings; `enhanced` + `mode` params) |
| `memory_get` | Fetch specific memory file content by line range |
| `memory_status` | File inventory, sizes, last modified dates, git status |
| `memory_sync` | Multi-agent Git sync (init / push / pull / status) |

## Memory System

The plugin maintains persistent context across sessions using an OpenClaw-compatible memory layout. Claude Code has direct filesystem access, so the agent reads and writes memory files like any other file — no special API required.

### How It Works

```
Session Start                    During Session                    Session End
     │                                │                                │
     ▼                                ▼                                ▼
Read MEMORY.md              Write new knowledge to              SessionEnd hook
+ memory/*.md               memory/YYYY-MM-DD.md                flushes unsaved
(via SessionStart hook)     or memory/topic-*.md                context to files
```

**Key concept**: In OpenClaw/SoulClaw, the framework manages memory automatically (passive memory extraction, auto-compaction). In Claude Code, memory is **instruction-driven** — the agent follows rules in `CLAUDE.md` to decide when and what to save, assisted by plugin hooks.

### File Layout

```
project/
├── CLAUDE.md           # Agent instructions (includes memory rules)
├── SOUL.md             # Persona definition (personality, principles)
├── IDENTITY.md         # Agent identity (name, creature type, vibe)
├── AGENTS.md           # Workflow rules, work style, safety
├── MEMORY.md           # Curated long-term knowledge (index)
├── memory/
│   ├── topic-*.md      # Topic-specific context (Status/Decisions/History)
│   ├── topic-map.json  # DAG: topic relationships (status/depends/related)
│   ├── YYYY-MM-DD.md   # Daily session logs
│   └── archive/        # Compacted old session logs
```

### Topic DAG (topic-map.json)

Track relationships between memory topics for faster navigation:

```json
{
  "topics": {
    "my-project": {
      "file": "topic-my-project.md",
      "status": "active",
      "depends": ["infrastructure"],
      "related": ["marketing", "business"]
    }
  }
}
```

| Field | Description |
|-------|-------------|
| `status` | `active` or `paused` — controls Tier 2 loading |
| `depends` | Topics that must be read first for context |
| `related` | Topics to check when working in this area |

The agent uses this DAG during Tier 3 to find related context without scanning all files.

### CLAUDE.md Configuration Template

Add these sections to your `CLAUDE.md` so the agent maintains memory autonomously. **Without these rules, the agent won't know to persist knowledge across sessions.**

#### 4-Tier Session Bootstrap

```markdown
## Session Start Protocol (4-Tier Bootstrap)

### Tier 1 — Always (every session)
1. Load persona: SOUL.md → IDENTITY.md → AGENTS.md
2. Read MEMORY.md (index)
3. Current date/time

### Tier 2 — First Response
4. Read most recent memory/YYYY-MM-DD.md (daily log)
5. Read active topic files (memory/topic-*.md)
6. `/clawsouls:memory search` — restore recent context

### Tier 3 — On Demand
7. Search related topic files (via topic-map.json)
8. Archive memory (memory/archive/) — only for old context
9. External docs — only when relevant

### Tier 4 — Background
10. Channel integrations (Slack, Telegram bridges)
```

This mirrors the [Soul Memory](/docs/platform/soul-memory) 4-tier architecture (T0–T3) at the session level.

#### Memory Rules

```markdown
## Memory Rules
- Follow 4-Tier Bootstrap Protocol above
- Important decisions/discoveries → memory/YYYY-MM-DD.md (daily log)
- Long-running project context → memory/topic-<project>.md
- Long-term knowledge → promote to MEMORY.md
- Topic files: History max 30 lines, Decisions max 50 lines
- Use `/clawsouls:memory search` for hybrid semantic search
- Search before answering questions about past context

### Auto-Promotion Rules
- 3+ times referenced → promote to MEMORY.md
- User says "remember this" → immediate promotion
- Cost/contract/legal decisions → always promote
- Project status changes → update topic-map.json

### Compact Mode (context pressure)
- Before compaction: save key facts to daily log
- Use PreCompact hook for automatic reminders
- Restore order: MEMORY.md → recent daily log → topic files
```

### What Gets Saved and When

| Trigger | What the agent writes | Where |
|---------|----------------------|-------|
| Important decision made | Decision record with rationale | `memory/topic-*.md` |
| Bug fix or root cause found | Problem → cause → solution | `memory/YYYY-MM-DD.md` |
| Session ending / context full | Key facts promoted | `MEMORY.md` |
| User says "remember this" | Exact instruction | Appropriate file |
| New contact, credential location, or rule | Permanent reference | `MEMORY.md` |

### Automatic Memory via Hooks

Plugin hooks provide automatic triggers at key moments:

| Hook | Type | When | Action |
|------|------|------|--------|
| SessionStart | prompt | Session opens | Reads SOUL.md, injects memory context |
| PreCompact | agent | Before compaction | Saves unsaved context to memory files |
| PostCompact | prompt | After compaction | Reloads SOUL.md + memory |
| FileChanged | prompt | SOUL.md/IDENTITY.md modified | Alerts persona drift |
| SessionEnd | agent | Session closes | Flushes remaining context to files |
| Heartbeat | prompt | Periodic (configurable) | Self-check: channels, tasks, memory save, blockers |

### Migrating Memory from OpenClaw

The file layout is identical — just copy:

```bash
cp ~/.openclaw/workspace/MEMORY.md ./
cp -r ~/.openclaw/workspace/memory/ ./memory/
```

All prior knowledge is immediately available. The agent picks up where it left off, and `memory_search` indexes the files automatically.

### OpenClaw vs Claude Code Memory Comparison

| Aspect | OpenClaw/SoulClaw | Claude Code + Plugin |
|--------|-------------------|---------------------|
| **Memory creation** | Framework auto-extracts (passive memory) | Agent writes files per CLAUDE.md rules |
| **Compaction** | Automatic on context overflow | PreCompact hook + agent judgment |
| **Search** | bge-m3 semantic + hybrid | TF-IDF/BM25 (hybrid with Ollama) |
| **Sync** | Single machine | Git-based multi-device (`memory_sync`) |
| **File format** | Markdown files | Same markdown files (100% compatible) |
| **Cost** | API pay-as-you-go | $0 within Claude subscription |

### Memory Search (Hybrid)

The search engine auto-detects your environment:

| Mode | When | How |
|------|------|-----|
| 🧠 **Hybrid** | Ollama running with bge-m3 | 0.4× TF-IDF + 0.6× semantic (cosine similarity) |
| 📝 **FTS** | No Ollama | TF-IDF + BM25 (zero dependencies) |

Both modes include:
- BM25 term frequency saturation
- Korean + English tokenization
- Recency boost (7 days: 1.3×, 30 days: 1.1×)

```
/clawsouls:memory search "trademark filing"
```

To force a specific mode, use the `mode` parameter when calling the MCP tool:

| Mode | Description |
|------|-------------|
| `auto` | Default — uses hybrid if Ollama available, FTS otherwise |
| `fts` | Force TF-IDF only (no embeddings) |
| `hybrid` | Force semantic + TF-IDF (requires Ollama + bge-m3) |

Use `enhanced=true` for full snippets with score visualization (uses more tokens).

**Ollama setup** (optional, for hybrid mode):
```bash
# Install Ollama and pull bge-m3
ollama pull bge-m3
# soul-spec-mcp auto-detects at localhost:11434
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
/clawsouls:scan clawsouls/brad      # Registry soul
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
npx soul-spec-mcp@latest

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
| **Claude Code** | This plugin — `/clawsouls:*` commands |
| **OpenClaw / SoulClaw** | Native Soul Spec support |
| **Cursor** | `.cursor/rules/` + `.mcp.json` |
| **Windsurf** | `.windsurfrules` + `.mcp.json` |
| **Any MCP client** | `npx soul-spec-mcp@latest` |

## Links

- [Plugin Repository](https://github.com/clawsouls/clawsouls-claude-code-plugin)
- [MCP Server (npm)](https://www.npmjs.com/package/soul-spec-mcp)
- [ClawSouls Registry](https://clawsouls.ai/souls)
- [Soul Spec Standard](https://soulspec.org)
