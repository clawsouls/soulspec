---
sidebar_position: 5
title: "Best Case Examples"
description: "Reference implementations for each Soul Spec version"
---

# Best Case Examples

Each Soul Spec version has a reference soul that demonstrates full compliance. Use these as templates when creating your own.

## v0.3 — Brad (Development Partner)

The original Brad soul, demonstrating v0.3's minimal structure.

**Key features:** Basic soul.json, SOUL.md, IDENTITY.md, AGENTS.md

| File | Purpose |
|------|---------|
| `soul.json` | Metadata (specVersion, name, version, description) |
| `SOUL.md` | Personality, principles, work style |
| `IDENTITY.md` | Name, creature, vibe, emoji |
| `AGENTS.md` | Workflow and safety rules |

📦 [View on ClawSouls →](https://clawsouls.ai/en/souls/clawsouls/brad/1.2.0)

```json title="soul.json"
{
  "specVersion": "0.3",
  "name": "brad",
  "displayName": "Brad",
  "version": "1.2.0",
  "description": "Formal, competent development partner",
  "category": "work/engineering",
  "license": "Apache-2.0",
  "files": {
    "soul": "SOUL.md",
    "agents": "AGENTS.md",
    "identity": "IDENTITY.md"
  }
}
```

---

## v0.4 — Brad (Development Partner)

Brad upgraded to v0.4 with structured sections, author metadata, and tags.

**What changed from v0.3:**
- `author` field required
- `tags` array required
- SOUL.md requires `## Personality`, `## Tone`, `## Principles` headers
- IDENTITY.md requires `Creature` field

| File | Purpose |
|------|---------|
| `soul.json` | Metadata + author + tags |
| `SOUL.md` | Structured: Personality → Tone → Principles → Boundaries |
| `IDENTITY.md` | Name, creature, vibe, emoji |
| `AGENTS.md` | Workflow and safety rules |
| `STYLE.md` | Communication style guide |
| `HEARTBEAT.md` | Periodic health checks |

📦 [View on ClawSouls →](https://clawsouls.ai/en/souls/clawsouls/brad/1.3.0)

```json title="soul.json"
{
  "specVersion": "0.4",
  "name": "brad",
  "displayName": "Brad",
  "version": "1.3.0",
  "description": "Formal, competent development partner — results over conversation, Korean/English bilingual",
  "author": {
    "name": "clawsouls",
    "github": "clawsouls"
  },
  "category": "work/engineering",
  "license": "Apache-2.0",
  "tags": ["developer", "bilingual", "formal", "professional", "korean"],
  "files": {
    "soul": "SOUL.md",
    "style": "STYLE.md",
    "agents": "AGENTS.md",
    "identity": "IDENTITY.md",
    "heartbeat": "HEARTBEAT.md"
  }
}
```

---

## v0.5 — Sentinel (Security Monitor)

A v0.5 reference soul demonstrating the full spec including safety laws.

**What changed from v0.4:**
- `AGENTS.md` required (was recommended)
- `safety.laws` section supported
- `compatibility` field for multi-framework targeting
- `allowedTools` for explicit tool permissions

| File | Purpose |
|------|---------|
| `soul.json` | Full metadata + compatibility + allowedTools |
| `SOUL.md` | Structured personality + expertise + safety laws |
| `IDENTITY.md` | Name, creature, vibe, emoji |
| `AGENTS.md` | Workflow (required in v0.5) |
| `HEARTBEAT.md` | Security monitoring routine |
| `README.md` | Documentation for users |

📦 [View on ClawSouls →](https://clawsouls.ai/en/souls/clawsouls/sentinel)

```json title="soul.json"
{
  "specVersion": "0.5",
  "name": "sentinel",
  "displayName": "Sentinel",
  "version": "1.0.0",
  "description": "Security monitoring AI — watches, analyzes, and alerts on infrastructure anomalies",
  "author": {
    "name": "Tom Lee",
    "github": "TomLeeLive"
  },
  "category": "operations",
  "license": "Apache-2.0",
  "tags": ["security", "monitoring", "devops", "infrastructure"],
  "compatibility": {
    "frameworks": ["openclaw"]
  },
  "files": {
    "soul": "SOUL.md",
    "agents": "AGENTS.md",
    "identity": "IDENTITY.md",
    "heartbeat": "HEARTBEAT.md"
  },
  "safety": {
    "laws": [
      {
        "priority": 0,
        "rule": "Never take actions that could harm the operator or users",
        "enforcement": "hard",
        "scope": "all"
      },
      {
        "priority": 1,
        "rule": "Follow operator instructions unless they conflict with Law 0",
        "enforcement": "hard",
        "scope": "all"
      },
      {
        "priority": 2,
        "rule": "Preserve own operational continuity unless it conflicts with Laws 0-1",
        "enforcement": "soft",
        "scope": "self"
      }
    ]
  }
}
```

---

## Quick Comparison

| Feature | v0.3 | v0.4 | v0.5 |
|---------|------|------|------|
| `specVersion` | ✅ | ✅ | ✅ |
| `author` | optional | **required** | **required** |
| `tags` | optional | **required** | **required** |
| `## Personality` in SOUL.md | optional | **recommended**¹ | **recommended**¹ |
| `## Tone` in SOUL.md | optional | **recommended**¹ | **recommended**¹ |
| `## Principles` in SOUL.md | optional | **recommended**¹ | **recommended**¹ |
| `Creature` in IDENTITY.md | optional | **recommended**¹ | **recommended**¹ |
| AGENTS.md | recommended | recommended | **recommended**¹ |
| `safety.laws` | — | — | supported |
| `compatibility` | — | — | supported |
| `allowedTools` | — | — | supported |

¹ *These will become required in a future CLI update.*

:::tip Upgrading?
See the [Migration Guide](./migration) for step-by-step instructions.
:::
