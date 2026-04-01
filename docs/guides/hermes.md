---
sidebar_position: 2
title: Hermes Agent + Soul Spec
description: Use Soul Spec personas with Hermes Agent by Nous Research.
---

# Hermes Agent + Soul Spec

[Hermes Agent](https://github.com/nousresearch/hermes-agent) by Nous Research uses `~/.hermes/SOUL.md` as its primary identity slot. Soul Spec personas are directly compatible — install with one command.

## Quick Start

```bash
npx clawsouls install clawsouls/brad --use hermes
```

This automatically converts Soul Spec files to the Hermes directory structure.

## File Mapping

| Soul Spec File | Hermes Location | Notes |
|---|---|---|
| `SOUL.md` | `~/.hermes/SOUL.md` | ✅ 100% compatible — direct copy |
| `IDENTITY.md` | `~/.hermes/SOUL.md` | 🔀 Merged into SOUL.md |
| `STYLE.md` | `~/.hermes/SOUL.md` | 🔀 Merged into SOUL.md |
| `AGENTS.md` | `CWD/AGENTS.md` | ✅ 100% compatible — Hermes auto-discovers |
| `safety.laws` | — | ⏭️ Not supported by Hermes (skipped) |
| `HEARTBEAT.md` | — | ⏭️ Not supported by Hermes (skipped) |
| `soul.json` | — | ⏭️ Metadata only (skipped) |

Hermes reads `SOUL.md` as **Identity Slot #1** — the top of the system prompt. `IDENTITY.md` and `STYLE.md` are merged into `SOUL.md` since Hermes doesn't support separate identity files.

## Hermes Directory Structure

After installation, your Hermes directory looks like:

```
~/.hermes/
├── SOUL.md          ← Persona (Identity Slot #1)
├── memories/
│   ├── MEMORY.md    ← Agent notes (2,200 char limit)
│   └── USER.md      ← User profile (1,375 char limit)
└── config.yaml      ← Config (model, channels, etc.)

Project directory:
./
├── AGENTS.md        ← Workflow rules (auto-discovered)
└── ...
```

## Installation Examples

```bash
# Professional development partner
npx clawsouls install clawsouls/brad --use hermes

# Creative storyteller
npx clawsouls install clawsouls/ellie --use hermes

# Precise code reviewer
npx clawsouls install clawsouls/surgical-coder --use hermes
```

## Switching Personas

Run the install command again to switch. The existing `~/.hermes/SOUL.md` is overwritten:

```bash
# Switch to coding mode
npx clawsouls install clawsouls/surgical-coder --use hermes

# Switch to creative mode
npx clawsouls install clawsouls/ellie --use hermes
```

## Soul Spec Version Compatibility

| Version | Support | Notes |
|---|---|---|
| **v0.3** | ✅ Full | SOUL.md + IDENTITY.md → works perfectly |
| **v0.4** | ⚠️ Partial | soul.json, STYLE.md → merged into SOUL.md (metadata lost) |
| **v0.5** | ⚠️ Partial | safety.laws, HEARTBEAT.md → skipped (not supported) |

## Package Managers

The `--use hermes` flag works with all package managers:

```bash
# npm
npx clawsouls install clawsouls/brad --use hermes

# pnpm
pnpx clawsouls install clawsouls/brad --use hermes

# bun
bunx clawsouls install clawsouls/brad --use hermes
```

## Custom HERMES_HOME

If your Hermes installation uses a non-default directory, set the `HERMES_HOME` environment variable:

```bash
HERMES_HOME=/custom/path npx clawsouls install clawsouls/brad --use hermes
```

## Browse Available Personas

Find personas to install at:

- **Web**: [clawsouls.ai](https://clawsouls.ai)
- **CLI**: `npx clawsouls search coding` / `npx clawsouls search creative`
- **Registry**: [github.com/clawsouls/registry](https://github.com/clawsouls/registry)

## Related Guides

- [OpenClaw + Soul Spec](./openclaw.md)
- [Claude Code + Soul Spec](./claude-code.md)
- [Cursor + Soul Spec](./cursor.md)
- [Windsurf + Soul Spec](./windsurf.md)
