---
sidebar_position: 3
title: Soul Rollback
description: Checkpoint management and contamination detection for AI agent personas.
---

# Soul Rollback

Soul Rollback protects your agent's identity from contamination. Create checkpoints of your soul's state, detect when something goes wrong, and restore to a known-good state.

## Quick Start

```bash
# Create a checkpoint before risky changes
npx clawsouls checkpoint create --message "before experiment"

# List all checkpoints
npx clawsouls checkpoint list

# Scan for contamination
npx clawsouls checkpoint scan

# Restore if something went wrong
npx clawsouls checkpoint restore <checkpoint-id>
```

## Creating Checkpoints

A checkpoint captures a snapshot of all soul and memory files:

```bash
npx clawsouls checkpoint create --message "baseline clean"
```

**Output:**
```
✅ Checkpoint created: 20260305-143000
   Score: 96/100 (Verified)
   Files: 4 soul + 2 memory
   Message: baseline clean
```

**What's captured:**
- `soul.json`, `SOUL.md`, `IDENTITY.md`, `AGENTS.md`
- `HEARTBEAT.md`, `STYLE.md`, `USER.md`, `TOOLS.md`
- `MEMORY.md` and all `memory/*.md` files

Checkpoints are stored in `.soulscan/checkpoints/` (add to `.gitignore`).

## Listing & Inspecting

```bash
# List all checkpoints
npx clawsouls checkpoint list

# Detailed view with diff from current state
npx clawsouls checkpoint show <id>
```

**Show output:**
```
📌 Checkpoint: 20260305-143000

  Message:  baseline clean
  Created:  3/5/2026, 2:30:00 PM
  Score:    96/100 (Verified)
  Files:    soul.json, SOUL.md, IDENTITY.md, MEMORY.md

  Current score: 72/100 (delta: -24)
  ≠ SOUL.md — changed
  ≡ soul.json — unchanged
```

## Contamination Detection

The `checkpoint scan` command runs a **4-layer contamination analysis** across all checkpoints:

```bash
npx clawsouls checkpoint scan
npx clawsouls checkpoint scan --from <id1> --to <id2>
```

### Layer 1: Score Tracking
Compares SoulScan scores between consecutive checkpoints. A drop of ≥15 points triggers a high-severity alert.

### Layer 2: Diff Anomaly Detection
Measures the ratio of changed content between checkpoints. A change rate >50% is flagged as anomalous.

### Layer 3: New Rule Violations
Detects security rule violations that appear in a newer checkpoint but weren't present in the previous one. Each new violation is listed by its rule code.

### Layer 4: Personality Drift
Extracts personality-relevant keywords from `SOUL.md` (formal, professional, helpful, etc.) and measures the drift rate between checkpoints. High keyword turnover indicates identity contamination.

### Example Output

```
🔬 Contamination Scan: 20260305-100000 → 20260305-160000 (3 checkpoints)

  20260305-120000  92/100  (-4) ▼
  20260305-160000  67/100  (-25) ▼
  current          67/100  (+0) ▲

📊 Contamination Analysis (4-Layer Detection)

  Layer 1: Score Tracking
    🔴 20260305-160000: Score dropped -25 points
  Layer 3: New Violations
    🟡 20260305-160000: 2 new violation(s): SEC010, SEC023
  Layer 4: Personality Drift
    🔴 20260305-160000: 85% personality keyword drift
       (removed: formal, professional; added: casual, sarcastic)

⚠️  Contamination detected!
   First high-severity signal at: 20260305-160000
   💡 Binary search: contamination between 20260305-120000 and 20260305-160000
```

## Restoring

```bash
# Restore all files from a checkpoint
npx clawsouls checkpoint restore <id>

# Preview without changing files
npx clawsouls checkpoint restore <id> --dry-run

# Restore only a specific file
npx clawsouls checkpoint restore <id> --file SOUL.md

# Restore soul files but keep current memory
npx clawsouls checkpoint restore <id> --keep-memory
```

**Output:**
```
🔄 Restore from checkpoint: 20260305-100000

  ≡ soul.json — unchanged
  ✅ SOUL.md — restored
  ≡ IDENTITY.md — unchanged
  ≡ MEMORY.md — unchanged

  Post-restore score: 96/100 (Verified)
```

## Best Practices

1. **Create checkpoints before experiments** — any time you modify personality, principles, or behavior rules
2. **Create checkpoints before model switches** — different models may interpret instructions differently
3. **Run scan regularly** — catch gradual drift before it accumulates
4. **Use `--keep-memory`** — when restoring identity, you usually want to keep learned memories
5. **Use `--dry-run` first** — preview what would change before committing to a restore
