---
sidebar_position: 4
title: Swarm Memory
description: Multi-agent memory collaboration with branch & merge.
---

# Swarm Memory

Swarm Memory enables multiple AI agents to collaborate on a shared soul package using independent branches. Each agent works on its own branch, and changes are merged back with persona-aware conflict resolution.

## Concept

When multiple agents (or the same agent across devices) work with the same soul:
- Each agent gets its own **Git branch** (`agent/<name>`)
- Agents push their memory and personality changes independently
- A **merge engine** combines changes, resolving conflicts based on the soul's merge priority settings

```
Agent A ──branch──→ Git Repo ←──branch── Agent B
                       ↓
                 Merge Engine
                 ├── Conflict Detection
                 ├── Auto Resolution
                 └── Persona-Aware Priority
```

## Quick Start

```bash
# Initialize swarm in an existing soul package (must be a git repo)
npx clawsouls swarm init

# Join as a specific agent
npx clawsouls swarm join --agent-id brad

# Work normally, then push changes
npx clawsouls swarm push

# Pull latest from main
npx clawsouls swarm pull

# Merge all agent branches back to main
npx clawsouls swarm merge
```

## Commands

### `swarm init`

Initialize swarm mode in a soul package directory.

```bash
npx clawsouls swarm init [--repo <url>]
```

- Requires a git repository and `soul.json`
- Auto-detects remote URL and main branch
- Creates `.soulscan/swarm.json` config

### `swarm join`

Create or switch to an agent branch.

```bash
npx clawsouls swarm join --agent-id <name>
```

- Creates branch `agent/<name>` from main (or switches to it if it exists)
- Saves agent config to `swarm.json`

### `swarm push`

Commit and push changes on the agent branch.

```bash
npx clawsouls swarm push
```

- Stages all soul and memory files
- Commits with timestamp message
- Pushes to remote

### `swarm pull`

Fetch main and rebase the agent branch.

```bash
npx clawsouls swarm pull
```

- Fetches from origin
- Rebases agent branch on main
- Warns on conflicts

### `swarm status`

Show swarm configuration and all agent branches.

```bash
npx clawsouls swarm status
```

**Output:**
```
🐝 Swarm Status

  Repo:         https://github.com/user/my-soul.git
  Main branch:  main
  Agent ID:     brad
  Agent branch: agent/brad
  Current:      agent/brad

  Agent Branches:
    → agent/brad
      agent/claude
      agent/gemini

  Merge Priority:
    personality: conservative
    memory:      union
    skills:      latest
```

### `swarm merge`

Merge agent branches into main.

```bash
npx clawsouls swarm merge [--strategy auto|manual|llm] [--agent <id>]
```

**Strategies:**
- `auto` (default): Git merge + persona-aware conflict resolution
- `manual`: Skip conflicts, list them for manual resolution
- `llm`: LLM-powered semantic conflict resolution via Ollama

### `swarm diff`

Show differences between an agent branch and main.

```bash
npx clawsouls swarm diff [--agent <id>]
```

## Merge Priority

The merge engine uses per-file-type priority rules to resolve conflicts automatically:

| File Type | Priority | Behavior |
|-----------|----------|----------|
| Personality files (`SOUL.md`, `IDENTITY.md`, `soul.json`) | `conservative` | Keep main version (protect identity) |
| Memory files (`MEMORY.md`, `memory/*.md`) | `union` | Combine both versions (section-level dedup) |
| Skill files (`AGENTS.md`, `TOOLS.md`) | `latest` | Take agent's version (newest wins) |

### Customizing Priority

Edit `.soulscan/swarm.json` to change merge behavior:

```json
{
  "mergePriority": {
    "personality": "conservative",
    "memory": "union",
    "skills": "latest"
  }
}
```

**Options for each file type:**
- `conservative`: keep main branch version
- `latest`: take agent branch version
- `union`: combine both (for memory files, merges by section headers)

## Union Merge for Memory

When `memory: "union"` is set (default), memory file conflicts are resolved by:

1. Splitting both versions by markdown headers (`##`, `###`)
2. Keeping all sections from main
3. Adding new sections from the agent branch
4. Deduplicating by header text

This ensures no agent loses their learned experiences.

## LLM Semantic Merge

When `--strategy llm` is used, conflicting files are resolved by a local LLM via [Ollama](https://ollama.ai). The LLM reads both versions alongside the agent's personality from `soul.json` and produces a merged result that preserves the agent's identity.

### Setup

Requires [Ollama](https://ollama.ai) running locally (free, offline, private):

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (any works — smaller = faster)
ollama pull gemma3:4b    # ~3GB, fast
ollama pull qwen3:8b     # ~5GB, more accurate

# Start Ollama
ollama serve
```

### Usage

```bash
# LLM merge with auto-detected model
npx clawsouls swarm merge --strategy llm

# Specify model
npx clawsouls swarm merge --strategy llm --model qwen3:8b

# Custom Ollama URL (e.g., remote server)
npx clawsouls swarm merge --strategy llm --ollama-url http://192.168.1.10:11434

# Merge specific agent only
npx clawsouls swarm merge --strategy llm --agent brad
```

### How It Works

1. Git attempts a normal merge
2. For each conflicting file, both versions are extracted
3. The LLM receives: `soul.json` personality context + version A (main) + version B (agent)
4. LLM produces a merged result that aligns with the agent's identity
5. LLM explains its merge decision (logged to console)
6. If the LLM fails or times out, the file is marked as unresolvable

### Example Output

```
🐝 Merging with strategy: llm

  ✅ agent/brad-laptop: merged (2 conflict(s) resolved by LLM)
     SOUL.md: Kept formal tone from main, added new principles from agent. (12.3s via gemma3:4b)
     MEMORY.md: Combined both memory sections, deduped project notes. (8.7s via gemma3:4b)
```

### Key Points

- **Cost: $0** — runs entirely on your local machine
- **Privacy: 100%** — no data leaves your machine
- **Offline: yes** — works without internet after model download
- **Personality-aware** — the LLM uses `soul.json` to make identity-consistent decisions
- Falls back gracefully if Ollama is unavailable

## How Sync Works

Swarm Memory lives in a dedicated directory (`~/.openclaw/swarm/`), separate from the agent's workspace. When you pull or merge, the CLI automatically syncs memory files to the agent's workspace so the running agent picks them up.

```
┌──────────────────────────────┐
│  Swarm Git Repo              │
│  ~/.openclaw/swarm/          │
│  (shared across all agents)  │
└──────────┬───────────────────┘
           │
    swarm pull / merge
           │
    ┌──────▼──────────┐
    │  swarm sync      │  (automatic)
    │  copies files →  │
    └──────┬──────────┘
           │
┌──────────▼───────────────────┐
│  OpenClaw Workspace          │
│  ~/.openclaw/workspace/      │
│  MEMORY.md, SOUL.md, etc.   │
└──────────┬───────────────────┘
           │
    gateway restart
           │
┌──────────▼───────────────────┐
│  Running Agent               │
│  (reads updated files)       │
└──────────────────────────────┘
```

### What Gets Synced

| File | Direction | Notes |
|------|-----------|-------|
| `MEMORY.md` | swarm → workspace | Agent's long-term memory |
| `memory/*.md` | swarm → workspace | Daily/session memory files |
| `SOUL.md` | swarm → workspace | Personality definition |
| `IDENTITY.md` | swarm → workspace | Identity metadata |
| `AGENTS.md` | swarm → workspace | Workflow rules |
| `soul.json` | swarm → workspace | Soul package manifest |

### Manual Sync

If you need to sync without pulling (requires CLI v0.13.0+):

```bash
cd ~/.openclaw/swarm
npx clawsouls swarm sync
```

### VSCode Extension

The [ClawSouls Agent extension](/platform/vscode) handles sync automatically:
- **Pull** button → runs `swarm pull` + `swarm sync` + restarts gateway
- **Merge** button → runs `swarm merge` + `swarm sync` + restarts gateway

No manual steps needed — your agent sees updated memories immediately.

## Use Cases

### Multi-Device Agent
Same agent personality used across desktop and laptop:
```
agent/brad-desktop → shared memories → agent/brad-laptop
```

### Multi-Agent Team
Multiple specialized agents sharing knowledge:
```
agent/researcher → findings merged → agent/writer
```

### A/B Testing
Test personality variants on separate branches:
```
agent/brad-formal vs agent/brad-casual → compare → merge winner
```
