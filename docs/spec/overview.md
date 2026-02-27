---
sidebar_position: 1
title: Spec Overview
description: Overview of the Soul Spec standard.
---

# Soul Spec Overview

Soul Spec is an open standard for AI agent persona packages. It defines a structured set of files that give an AI agent a persistent identity, personality, and behavioral rules.

## Package Structure

A soul package contains these files:

```
my-soul/
├── soul.json          # Required: metadata
├── SOUL.md            # Required: core personality
├── IDENTITY.md        # Optional: name, role, traits
├── AGENTS.md          # Optional: workflow & behavioral rules
├── STYLE.md           # Optional: communication style
├── HEARTBEAT.md       # Optional: periodic check-in behavior
├── USER_TEMPLATE.md   # Optional: user profile template
├── avatar/            # Optional: avatar image
│   └── avatar.png
└── examples/          # Optional: calibration examples
    ├── good-outputs.md
    └── bad-outputs.md
```

## soul.json

The metadata file. Defines the soul's identity, compatibility, and file paths.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `specVersion` | string | Spec version: `"0.3"`, `"0.4"`, or `"0.5"` |
| `name` | string | Unique identifier (kebab-case) |
| `displayName` | string | Display name |
| `version` | semver | Package version |
| `description` | string | One-line description (max 160 chars) |
| `author` | object | `{ name, github }` |
| `license` | string | SPDX identifier |
| `tags` | string[] | Search tags (max 10) |
| `category` | string | Category path (e.g., `"work/devops"`) |
| `files.soul` | string | Path to SOUL.md |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `compatibility.openclaw` | string | Min OpenClaw version |
| `compatibility.models` | string[] | Recommended models (glob) |
| `compatibility.frameworks` | string[] | Compatible frameworks (v0.4+) |
| `allowedTools` | string[] | Expected tools (v0.4+) |
| `recommendedSkills` | object[] | Skills with version constraints (v0.4+) |
| `disclosure.summary` | string | One-line summary for progressive disclosure (v0.4+) |

## File Purposes

### SOUL.md
The core personality file. Defines who the agent is, how it thinks, and what principles it follows. This is the only required markdown file.

### IDENTITY.md
Name, role, background, appearance, and other identity traits. Separating identity from personality allows mixing and matching.

### AGENTS.md
Workflow rules, tool usage patterns, safety guidelines. How the agent operates day-to-day.

### STYLE.md
Communication tone, formatting preferences, language patterns. How the agent writes.

### HEARTBEAT.md
What the agent does during idle/periodic check-ins. Common for always-on agents.

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| [v0.5](/docs/spec/v0.5) | 2026-02-23 | Robotics/embodied agents, sensors, allowedTools, hardware-aware personas |
| [v0.4](/docs/spec/v0.4) | 2026-02-20 | Multi-framework compatibility, recommendedSkills, progressive disclosure |
| [v0.3](/docs/spec/v0.3) | 2026-02-16 | specVersion field, soul.json rename, license allowlist |

> **Note**: v0.1 and v0.2 were internal development specs. The registry requires **v0.3 or higher**.

## Allowed Licenses

Souls published to the registry must use one of these SPDX identifiers:

`MIT`, `Apache-2.0`, `CC-BY-4.0`, `CC-BY-SA-4.0`, `CC0-1.0`, `ISC`, `BSD-2-Clause`, `BSD-3-Clause`, `Unlicense`

## Next Steps

- [v0.5 Spec](/docs/spec/v0.5) — Latest full specification
- [Migration Guide](/docs/spec/migration) — Upgrading between versions
