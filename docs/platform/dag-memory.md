---
sidebar_label: "DAG Memory"
title: "DAG Lossless Memory"
---

# DAG Lossless Memory

> Added in SoulClaw v2026.3.18

The DAG (Directed Acyclic Graph) Memory provides **lossless conversation persistence** for Soul-powered agents. Every message exchanged between the user and agent is stored permanently in a local SQLite database, ensuring no information is ever lost to context window pruning or compaction.

## The Problem

AI agents forget. Context windows are finite, and when conversations exceed the limit, older messages are pruned — silently, permanently. Summarization-based pruning loses nuance. Hard truncation loses everything.

## How It Works

The DAG store hooks into the agent lifecycle and runs automatically after each conversation turn:

```
Level 0: Raw messages (never deleted)
   ↓ Every 10 turns
Level 1: Chunk summaries (LLM-generated)
   ↓ Every 10 summaries  
Level 2+: Higher-level summaries (recursive)
```

1. **Raw storage (Level 0)**: Every user and assistant message is stored as-is
2. **Chunk summarization (Level 1)**: After 10 accumulated turns, the LLM generates a concise summary
3. **Higher-level summaries (Level 2+)**: Summaries are recursively rolled up for long-running sessions

The DAG structure means you can always trace back from a summary to the original messages that produced it. **Nothing is lost.**

## 3-Tier Memory Architecture

DAG Memory is part of SoulClaw's 3-tier memory system:

| Tier | Component | Purpose | Storage |
|------|-----------|---------|---------|
| 1 | **DAG Store** | Lossless conversation persistence + FTS5 search | `.dag-memory.sqlite` |
| 2 | **Vector Search** | Semantic similarity search over memory files | `memory-index.db` |
| 3 | **Passive Memory** | Automatic extraction of important facts | `memory/*.md` files |

All three tiers work together:
- **DAG** ensures nothing is lost
- **Passive Memory** extracts signal from noise
- **Vector Search** provides semantic retrieval

## Key Design Decisions

- **SQLite** — Zero-dependency, single-file database. No external services required.
- **FTS5 full-text search** — Instant keyword search across all conversation history.
- **Incremental storage** — Only new messages are written per turn; no duplicates.
- **Level-based hierarchy** — Raw messages at level 0, progressive summarization at higher levels.

## Storage

The database is stored at:

```
<workspace>/.dag-memory.sqlite
```

Typical storage: ~50 conversation turns ≈ 300KB.

## Activation

The DAG store activates **automatically** when `memorySearch` is configured in SoulClaw. No additional setup required:

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "provider": "local"
      }
    }
  }
}
```

If `memorySearch` is not configured, the DAG store remains inactive and no SQLite file is created.

## Retrieval

When `memory_search` is called, results come from all three tiers:

1. **FTS5** searches the DAG for exact keyword matches across all history
2. **Semantic search** finds conceptually related memories from indexed files
3. **Passive memories** provide curated, high-signal facts

The combination gives you both **precision** (exact matches from FTS5) and **recall** (conceptual matches from vectors).

## Inspecting the DAG

You can query the DAG database directly:

```bash
# Count stored nodes by level
sqlite3 .dag-memory.sqlite \
  "SELECT level, COUNT(*) FROM dag_nodes GROUP BY level"

# Search conversation history
sqlite3 .dag-memory.sqlite \
  "SELECT content FROM dag_fts WHERE dag_fts MATCH 'deployment' LIMIT 5"

# Recent messages
sqlite3 .dag-memory.sqlite \
  "SELECT role, substr(content,1,80) FROM dag_nodes \
   WHERE level=0 ORDER BY created_at DESC LIMIT 10"
```

## Getting Started

```bash
npm install -g soulclaw
soulclaw onboard
```

The 3-tier memory system activates automatically once you configure memory search during onboarding.
