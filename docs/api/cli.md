---
sidebar_position: 3
title: CLI Reference
description: ClawSouls CLI command reference.
---

# CLI Reference

[![npm](https://img.shields.io/npm/v/clawsouls)](https://www.npmjs.com/package/clawsouls)

**Give your AI a soul.** Install, manage, and switch AI agent personas.

## Installation

```bash
# Use directly with npx
npx clawsouls <command>

# Or install globally
npm install -g clawsouls
```

**Requirements:** Node.js 22+

## Commands

### `clawsouls platform`

Show detected agent platform(s) and workspace path.

```bash
clawsouls platform
# 🔍 Agent Platform Detection
# ▶ Active: OpenClaw 🦞
#   Workspace: /home/user/.openclaw/workspace
```

### `clawsouls init [name] [--spec <version>]`

Scaffold a new soul package with template files.

```bash
clawsouls init my-soul
clawsouls init my-robot --spec 0.5   # Robotics/embodied agents
```

| Flag | Version | Use Case |
|------|---------|----------|
| *(default)* | v0.4 | General-purpose personas |
| `--spec 0.3` | v0.3 | Minimal / legacy |
| `--spec 0.5` | v0.5 | Robotics / embodied agents |

### `clawsouls install <owner/name[@version]>`

Download a soul from the registry.

```bash
clawsouls install clawsouls/surgical-coder
clawsouls install clawsouls/surgical-coder@0.1.0   # specific version
clawsouls install clawsouls/surgical-coder --force  # overwrite
```

### `clawsouls use <name>`

Activate an installed soul. Current workspace is automatically backed up.

```bash
clawsouls use surgical-coder
```

**Protected files** (never overwritten): `USER.md`, `MEMORY.md`, `TOOLS.md`

### `clawsouls restore`

Revert to the previous soul from backup.

```bash
clawsouls restore
```

### `clawsouls list`

List installed souls.

```bash
clawsouls list
clawsouls ls
```

### `clawsouls validate [dir]`

Validate a soul package against the spec.

```bash
clawsouls validate              # current directory
clawsouls validate ./my-soul    # specific directory
clawsouls validate --soulscan   # include security analysis
```

### `clawsouls soulscan [dir]`

Run SoulScan security and quality analysis.

```bash
clawsouls soulscan                # active workspace
clawsouls soulscan ./my-soul      # specific directory
clawsouls soulscan -q             # quiet mode
clawsouls soulscan --init         # initialize checksums
```

### `clawsouls publish <dir>`

Publish to the registry.

```bash
clawsouls login <token>
clawsouls publish ./my-soul
```

### `clawsouls export <format>`

Export to other framework formats.

```bash
clawsouls export claude-md --dir ./my-soul -o CLAUDE.md
clawsouls export cursorrules --dir ./my-soul -o .cursorrules
clawsouls export windsurfrules --dir ./my-soul -o .windsurfrules
clawsouls export system-prompt --dir ./my-soul -o prompt.txt
```

### `clawsouls sync`

Memory sync commands. See the [Memory Sync guide](/docs/guides/memory-sync).

```bash
clawsouls sync init         # Initialize sync
clawsouls sync push         # Encrypt & upload
clawsouls sync pull         # Download & decrypt
clawsouls sync status       # Show sync state
clawsouls sync export-key   # Export encryption key
clawsouls sync import-key   # Import key on new device
```

## Platform Override

```bash
clawsouls --platform zeroclaw use surgical-coder
clawsouls --workspace ~/custom/path use surgical-coder
CLAWSOULS_PLATFORM=clawdbot clawsouls use surgical-coder
```
