---
sidebar_position: 2
title: Claude Code + Soul Spec
description: Give Claude Code a persistent identity using Soul Spec.
---

# Claude Code + Soul Spec

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) is Anthropic's terminal-based AI coding agent. It reads `CLAUDE.md` from your project root as persistent instructions — but by default, it has no personality.

Soul Spec gives Claude Code an identity. Install a soul, export it to `CLAUDE.md`, and Claude Code becomes your customized agent.

## Prerequisites

- Claude Code CLI installed
- Node.js 22+

## Quick Start (2 minutes)

### Step 1: Install the CLI

```bash
npm install -g clawsouls
```

### Step 2: Install a soul

```bash
clawsouls install TomLeeLive/brad
```

Or create your own:

```bash
clawsouls init my-agent
```

### Step 3: Export to CLAUDE.md

```bash
clawsouls export claude-md --dir ./my-agent -o ./my-project/CLAUDE.md
```

### Step 4: Use Claude Code

```bash
cd my-project && claude
```

Claude Code reads `CLAUDE.md` automatically and adopts the persona.

## How It Works

The `export claude-md` command merges Soul Spec files into a single `CLAUDE.md`:

| Soul Spec File | Purpose |
|---|---|
| `SOUL.md` | Core personality & principles |
| `IDENTITY.md` | Name, role, traits |
| `STYLE.md` | Communication tone & language |
| `AGENTS.md` | Workflow & behavioral rules |
| `HEARTBEAT.md` | Periodic check-in behaviors |

## Alternative: Place Files Directly

```bash
clawsouls install TomLeeLive/brad
cp ~/.openclaw/souls/TomLeeLive/brad/SOUL.md ./my-project/
cp ~/.openclaw/souls/TomLeeLive/brad/IDENTITY.md ./my-project/
```

Then reference them from your `CLAUDE.md`:

```markdown
# Project Instructions
See SOUL.md and IDENTITY.md for persona configuration.
```

## Use the MCP Server

Apply personas from inside Claude Code without touching files:

```bash
claude mcp add soul-spec -- npx -y soul-spec-mcp
```

Then say: *"Apply the TomLeeLive/brad persona"*

## Tips

- **One CLAUDE.md per project.** Use different projects for different personas.
- **Version control.** Commit `CLAUDE.md` to your repo so team members share the same persona.
- **SoulScan.** Run `npx clawsouls soulscan` to verify persona integrity.
- **Update easily.** `clawsouls install <name> -f && clawsouls export claude-md --dir ...`
