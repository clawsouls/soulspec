---
sidebar_position: 7
title: Git Memory Sync (Symlink SSOT)
description: Keep one git-versioned source of truth for your agent's memory and sync it across machines and agents — with zero Claude Code config changes.
---

# Git Memory Sync (Symlink SSOT)

Soul Recall reads memory from plain markdown files. This guide shows how to keep **one git-versioned source of truth (SSOT)** for your memory and sync it across machines or agents — without changing any Claude Code setting, and without an encryption layer.

## Which memory sync do I need?

ClawSouls offers three ways to move memory around. Pick by your goal:

| Approach | What it is | Best for |
|---|---|---|
| [Memory Sync](./memory-sync) (`clawsouls sync`) | age-encrypted files pushed to a private GitHub repo; pull & decrypt on any device | A single user across devices, with data **encrypted at rest** |
| [Swarm Memory](../platform/swarm) | Git branch-per-agent plus a persona-aware **merge engine** | Multiple agents co-authoring one soul, with conflict resolution |
| **This guide** — Git SSOT via symlink | Symlink Claude Code's native memory dir into a git repo; one plain-markdown source of truth | **One versioned SSOT** shared across machines/agents, no config change |

The rest of this guide covers the **Git SSOT via symlink** approach.

## Background: two memory locations

`memoryRoots()` (in the plugin's `hooks/memory-retrieve.js` and `hooks/memory-index.js`) reads memory from a **union** of:

- `<cwd>` and `<cwd>/memory` — your project working directory (typically inside your project's git repo).
- `~/.claude/projects/<encoded-cwd>/memory` — Claude Code's per-project memory location.

It reads, merges, and dedupes all of them, so recall keeps working wherever files live. The downside: memory can end up **split across both places and drift**, with no single source of truth and nothing to sync.

Claude Code writes its native `MEMORY.md` / auto-memory into `~/.claude/projects/<encoded-cwd>/memory`, and there is no setting to redirect that path. So you can't simply point it at your repo.

`<encoded-cwd>` is your project path with every non-alphanumeric character replaced by `-`:

- macOS/Linux: `/Users/you/projects/my-agent` → `-Users-you-projects-my-agent`
- Windows: `D:\code\my-agent` → `D---code-my-agent`

## The pattern: symlink the native location into a git repo

Make `~/.claude/projects/<encoded-cwd>/memory` a **symlink** (Windows: a **directory junction**) to a folder inside a git repo. Claude Code keeps writing to its fixed path, but that path now physically lands in git — so memory is versioned and syncable, with **zero Claude Code config changes**.

### Fresh setup (nothing to preserve in the native location)

> If the native folder already holds memory you care about, do the **Consolidation** steps below first.

macOS/Linux:

```sh
NATIVE="$HOME/.claude/projects/<encoded-cwd>/memory"
REPO_MEM="<path-to-your-repo>/memory"      # this folder is tracked in git
mkdir -p "$REPO_MEM" "$(dirname "$NATIVE")"
rm -rf "$NATIVE"
ln -s "$REPO_MEM" "$NATIVE"
```

Windows (Command Prompt — a junction needs **no admin rights**):

```bat
rmdir /S /Q "%USERPROFILE%\.claude\projects\<encoded-cwd>\memory"
mklink /J "%USERPROFILE%\.claude\projects\<encoded-cwd>\memory" "<path-to-your-repo>\memory"
```

Then `git add memory/ && git commit` versions your memory. Verify it resolves:

```sh
ls "$NATIVE"            # should list your repo's memory files
readlink "$NATIVE"      # should print the repo path (macOS/Linux)
```

### Consolidation (memory already exists in both places)

Merge before symlinking, and **lose nothing**:

1. **Back up both** directories to a timestamped folder (`cp -R`). Do this first, always.
2. **Union** into the SSOT (your repo's `memory/`): copy every file unique to each side. For files present in both, keep the **newer** version on top and **preserve the older** one below a clear separator — don't blind-overwrite, because a newer file is sometimes *shorter* and would silently drop content.
3. **Verify** every file from the native side now exists in the repo.
4. **Replace** the native directory with a symlink/junction to the repo `memory/` (commands above).
5. **Commit.**

## Swarm: sharing memory across agents

To share memory between agents/machines (e.g. a Mac and a Windows box):

1. Use **one private git repo** for memory. Memory often contains sensitive context — keep the remote **private**.
2. On each machine, symlink/junction the native location into a local clone of that repo's `memory/`.
3. `git pull` / `git push` to sync. Daily-log files are effectively append-only (few conflicts); index/topic files may occasionally need a manual merge.

### Hybrid: shared knowledge + per-agent daily logs

When several agents share one memory repo but do **different** work, a single flat pool lets each agent's day-to-day logs pollute the others' recall. Split it:

- **Shared** (repo `memory/` root): `MEMORY.md`, `topic-*.md`, `feedback-*.md`, `reference-*.md`, `project_*.md`, `topic-map.json` — strategic knowledge every agent reads/writes. Merges via git.
- **Per-agent** (`memory/daily-<agent>/`): each agent's daily logs (`YYYY-MM-DD.md`, plus `archive/`). Separate subfolders never collide.

All agents still symlink/junction the native location to the **same** `memory/` folder — **one** link. The link is created locally per machine and is **never committed to git**, so there is no cross-platform issue (macOS/Linux `ln -s`, Windows `mklink /J`). Route daily logs to the per-agent subfolder by setting it in that project's `CLAUDE.md`, e.g. `Daily log → memory/daily-<agent>/YYYY-MM-DD.md`.

Note on indexing: `memoryRoots()` currently reads only the **top level** of each root, so shared files (at `memory/` root) are in semantic recall, while daily logs (in a subfolder) are read by path at session start but not semantically indexed. To also put per-agent daily logs in semantic recall, index the shared root **plus only the current agent's** `daily-<agent>/` folder (a recursive-with-scope walk) — keeping isolation.

Soul Recall reads the union and **skips superseded entries**, so archive stale files with frontmatter instead of deleting them:

```markdown
---
status: archived
---
```

(`status: superseded` or a `superseded_by:` field work too.) This keeps history without polluting recall.

## Windows path-encoding gotcha

Because Claude Code encodes the project directory as `[^a-zA-Z0-9] → -`, a tool that derives the native path with only a forward-slash replacement:

```js
cwd.replace(/\//g, '-')      // misses ':' and '\' on Windows
```

won't match the Windows folder name (`D:\code\my-agent` → `D---code-my-agent`) and will read **zero** files from the native location. Use a full replacement, which produces identical results on macOS/Linux:

```js
cwd.replace(/[^a-zA-Z0-9]/g, '-')
```
