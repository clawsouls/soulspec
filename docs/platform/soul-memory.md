---
sidebar_position: 7
title: Soul Memory
description: 4-Tier Adaptive Memory Architecture — temporal decay, automatic promotion, and quarterly compaction for long-lived AI agents.
---

# Soul Memory

Soul Memory is a **4-tier adaptive memory architecture** for AI agents running on SoulClaw. It solves the Memory-Identity Paradox: perfect memory undermines agent identity, while complete forgetting destroys continuity.

Inspired by human cognitive architecture, Soul Memory separates *identity* from *experience*, applies selective temporal decay to working memories, and provides automatic promotion of important memories to permanent storage.

## The 4 Tiers

```
┌─────────────────────────────────────────────┐
│  T0: SOUL (Identity)                        │
│  SOUL.md, IDENTITY.md                       │
│  Immutable. Human-authorized changes only.  │
│  "Who I am"                                 │
├─────────────────────────────────────────────┤
│  T1: CORE MEMORY (Evergreen)                │
│  MEMORY.md, memory/roadmap.md, etc.         │
│  No decay. Curated knowledge.               │
│  "What I must never forget"                 │
├─────────────────────────────────────────────┤
│  T2: WORKING MEMORY (Temporal)              │
│  memory/2026-03-19.md (dated files)         │
│  Decay: configurable half-life.             │
│  "What happened recently"                   │
├─────────────────────────────────────────────┤
│  T3: SESSION MEMORY (Ephemeral)             │
│  Current conversation context.              │
│  Gone after session ends.                   │
│  "What we're talking about right now"       │
└─────────────────────────────────────────────┘
```

### T0: Soul (Identity)

Your agent's `SOUL.md` and `IDENTITY.md`. These define *who the agent is* — personality, values, behavioral rules. They're loaded fresh every session, never modified by the agent, and never subject to search decay.

This is your agent's defense against the Memory-Identity Paradox — no matter how much experience accumulates, the identity anchor remains unchanged.

### T1: Core Memory (Evergreen)

`MEMORY.md` and undated topic files (`memory/roadmap.md`, `memory/legal.md`). These store curated, long-term knowledge: decisions, architecture choices, key relationships, strategies.

**No temporal decay.** Core memories are always at full relevance, whether they were written today or a year ago. The system recognizes files without dates in their filename as evergreen.

### T2: Working Memory (Temporal)

Date-stamped files like `memory/2026-03-19.md`. These are daily work logs, debug notes, meeting records, task progress.

**Temporal decay** is applied based on the file date. Today's working memory has full relevance. Last week's is slightly reduced. Last month's is significantly lower. Files older than 3 months are barely visible to search — but still on disk.

### T3: Session Memory (Ephemeral)

The current conversation context. This is the standard LLM context window — no persistence. Gone when the session ends.

---

## Temporal Decay

Working Memory files have dated filenames. The search system applies exponential decay to their search scores:

```
final_score = semantic_score × exp(-λ × age_in_days)
λ = ln(2) / half_life_days
```

### Example: 23-Day Half-Life

| Age | Weight | Agent's Behavior |
|-----|--------|-----------------|
| Today | 1.00 | "I just worked on this" |
| 1 week | 0.81 | "This is recent context" |
| 23 days | 0.50 | "I remember this" |
| 1 month | 0.41 | "This sounds familiar" |
| 2 months | 0.17 | "Vaguely, let me check..." |
| 3 months | 0.07 | "Near search threshold" |

**Important notes:**
- Decay affects **search ranking only**, not storage. All data remains on disk.
- Explicit queries about old events still work if the semantic match is strong enough.
- **Evergreen files** (MEMORY.md, undated topic files) are **exempt from decay** — always weight 1.0.

### Configuration

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "query": {
          "hybrid": {
            "temporalDecay": {
              "enabled": true,
              "halfLifeDays": 23
            }
          }
        }
      }
    }
  }
}
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enabled` | `false` | Enable/disable temporal decay |
| `halfLifeDays` | `30` | Number of days for score to halve |

:::tip Choosing a half-life
- **7 days** — Aggressive. Best for fast-moving projects where last week's context is rarely relevant.
- **23 days** — Balanced. Good for most development workflows.
- **45 days** — Conservative. Good for long-term projects with infrequent context changes.
- **90 days** — Very conservative. Minimal decay effect.
:::

---

## Memory Promotion

Important working memories should be promoted to Core Memory. Soul Memory provides three mechanisms:

### 1. Rule-Based Detection

The `memory promote` command scans T2 files for entries matching promotion rules:

| Category | Triggers |
|----------|----------|
| **Decision** | 결정, decided, confirmed, approved |
| **Architecture** | 아키텍처, design, schema, stack |
| **Financial** | $, ₩, pricing, margin, BEP, revenue |
| **Legal** | 상표, trademark, patent, ToS, GDPR |
| **People** | 변리사, partner, client, meeting results |
| **Milestone** | 출시, launch, shipped, released, Phase N |
| **Strategy** | 로드맵, roadmap, vision, strategy |
| **Explicit** | 기억해, IMPORTANT, CRITICAL, ★ |

Each match produces a confidence score. Items above 40% confidence are flagged as candidates.

### 2. Access-Frequency Promotion

Memories retrieved **3+ times across different sessions** are automatically flagged. This is tracked via a `search_hits` table in the SQLite database.

### 3. Weekly Review

Set up a scheduled cron to scan weekly and report candidates:

```bash
openclaw cron add \
  --name "Soul Memory Weekly Review" \
  --cron "0 18 * * 5" \
  --tz "Asia/Seoul" \
  --message "Weekly memory promotion review: scan this week's memory files and report promotion candidates." \
  --announce \
  --session isolated
```

---

## CLI Commands

### `memory status`

Shows index status including Soul Memory tier statistics:

```bash
openclaw memory status
```

Output includes:
```
Soul Memory Tiers:
  T0 Soul: 2 files
  T1 Core: 5 files
  T2 Working: 284 files
```

### `memory promote`

Scan working memory for promotion candidates:

```bash
# Scan last 7 days (default)
openclaw memory promote

# Scan last 30 days with higher confidence threshold
openclaw memory promote --days 30 --min-confidence 0.6

# Show frequently accessed memories (access-frequency promotion)
openclaw memory promote --frequency

# Output as JSON
openclaw memory promote --json
```

Execute promotions (move from T2 to T1):

```bash
# Auto-promote to MEMORY.md or category-specific files
openclaw memory promote --apply

# Promote to a specific target file
openclaw memory promote --apply --target memory/legal.md
```

**What `--apply` does:**
1. Copies matched sections to the target file (MEMORY.md or topic file)
2. Removes the sections from the source dated file
3. Reports results

### `memory compact`

Archive old T2 files into quarterly summary files:

```bash
# Preview: show files eligible for compaction (90+ days old)
openclaw memory compact

# Change the age threshold
openclaw memory compact --days 60

# Execute compaction
openclaw memory compact --apply

# Execute and remove original files
openclaw memory compact --apply --remove
```

**What `--apply` does:**
1. Groups dated files by quarter (e.g., `2025-Q1`, `2026-Q1`)
2. Concatenates content into `memory/archive/2026-Q1.md`
3. Optionally removes originals (with `--remove`)

:::caution
Use `--remove` with care. Without it, originals are preserved alongside the archive.
:::

---

## File Structure

```
workspace/
├── SOUL.md                    # T0: Identity (immutable)
├── IDENTITY.md                # T0: Identity (immutable)
├── MEMORY.md                  # T1: Core Memory (no decay)
├── memory/
│   ├── roadmap.md             # T1: Core (undated = evergreen)
│   ├── legal.md               # T1: Core (undated = evergreen)
│   ├── architecture.md        # T1: Core (undated = evergreen)
│   ├── 2026-03-19.md          # T2: Working (dated = decays)
│   ├── 2026-03-18.md          # T2: Working (dated = decays)
│   ├── ...
│   └── archive/
│       ├── 2025-Q1.md         # Compacted quarterly archive
│       └── 2026-Q1.md         # Compacted quarterly archive
```

---

## Embedding Model

Soul Memory works best with a multilingual embedding model. We recommend **bge-m3** via Ollama:

```bash
# Install
ollama pull bge-m3

# Configure (openclaw.json)
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "provider": "ollama",
        "model": "bge-m3"
      }
    }
  }
}

# Rebuild index
openclaw memory index --force
```

| Model | Dimensions | MTEB | Multilingual | Size |
|-------|-----------|------|-------------|------|
| embeddinggemma-300M (default) | 768 | ~60 | Weak | 300MB |
| **bge-m3 (recommended)** | 1024 | ~63 | 100+ languages | 1.2GB |
| nomic-embed-text | 768 | ~62 | English-focused | 274MB |

---

## Quick Start

### 1. Enable Temporal Decay

Add to your `openclaw.json`:

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "provider": "ollama",
        "model": "bge-m3",
        "query": {
          "hybrid": {
            "temporalDecay": {
              "enabled": true,
              "halfLifeDays": 23
            }
          }
        }
      }
    }
  }
}
```

### 2. Install bge-m3 and Rebuild Index

```bash
ollama pull bge-m3
openclaw memory index --force
```

### 3. Organize Your Memory Files

- Put long-term decisions in `MEMORY.md` or undated topic files (`memory/roadmap.md`)
- Let daily logs go to dated files (`memory/2026-03-19.md`)

### 4. Set Up Weekly Review (Optional)

```bash
openclaw cron add \
  --name "Soul Memory Weekly Review" \
  --cron "0 18 * * 5" \
  --tz "Your/Timezone" \
  --message "Scan this week's memory files for promotion candidates." \
  --announce --session isolated
```

### 5. Restart Gateway

```bash
openclaw gateway restart
```

---

## How It Works With Soul Spec

Soul Memory complements [Soul Spec](/docs/spec/overview):

| Layer | Soul Spec | Soul Memory |
|-------|-----------|-------------|
| **Purpose** | Define identity | Preserve experience |
| **Changes** | Human-authorized | Agent-managed (with human review) |
| **Lifetime** | Permanent | Tiered (permanent → ephemeral) |
| **Protection** | Against identity hijacking | Against Memory-Identity Paradox |

Together, they ensure an agent **knows who it is** (Soul) and **remembers what matters** (Memory) without letting accumulated experience corrupt its identity.

---

## FAQ

### Does temporal decay delete my data?

No. Decay only affects search ranking. All files remain on disk. You can always find old memories with a direct search or by reading the file.

### What if something important is in a dated file?

Use `openclaw memory promote --apply` to move it to Core Memory (T1). Or manually copy it to `MEMORY.md` or a topic file.

### Can I disable decay for specific dated files?

Not currently. The workaround is to rename the file to remove the date pattern (e.g., `2026-03-19.md` → `march-decisions.md`), making it an evergreen T1 file.

### What happens after 1 year?

Dated files from a year ago have near-zero search weight. They're effectively invisible to search but still on disk. Use `memory compact` to archive them into quarterly files.
