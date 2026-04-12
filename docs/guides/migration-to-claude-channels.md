---
sidebar_position: 12
sidebar_label: Migration to Claude Code Channels
title: "Migration Guide: OpenClaw → Claude Code Channels"
description: Migrate your Soul Spec agent from OpenClaw/SoulClaw to Claude Code Channels with Telegram or Discord support.
---

# Migration Guide: OpenClaw → Claude Code Channels

Migrate your Soul Spec agent from OpenClaw/SoulClaw to Claude Code's native Channels system. Keep your persona, memory, and workflows — now running within your Claude subscription at no extra API cost.

## Why Migrate?

On April 4, 2026, Anthropic updated their subscription policy: Claude subscriptions only cover Claude.ai, Claude Code, and Claude Cowork. Third-party harnesses like OpenClaw require separate pay-as-you-go billing.

Claude Code Channels provides similar functionality to OpenClaw's messaging integration — within your existing subscription.

## Feature Comparison

| Feature | OpenClaw/SoulClaw | Claude Code Channels | Notes |
|---------|-------------------|---------------------|-------|
| **Telegram** | ✅ Built-in | ✅ Official plugin | Equivalent |
| **Discord** | ✅ Built-in | ✅ Official plugin | Equivalent |
| **iMessage** | ❌ | ✅ Official plugin | Channels-only |
| **Signal** | ✅ Built-in | ❌ | OpenClaw-only |
| **Soul Spec persona** | ✅ Native | ✅ Via ClawSouls plugin | Equivalent |
| **Persistent memory** | ✅ Auto (DAG + passive) | ⚠️ Via plugin hooks | Plugin needed |
| **Memory search** | ✅ Semantic + TF-IDF | ✅ TF-IDF + hybrid via MCP | Ollama auto-detect |
| **Always-on daemon** | ✅ Built-in | ⚠️ tmux/screen | Manual setup |
| **Heartbeat/cron** | ✅ Built-in | ❌ | External cron needed |
| **Multi-channel** | ✅ Simultaneous | ✅ `--channels` flag | Equivalent |
| **Sub-agents** | ✅ sessions_spawn | ⚠️ Claude agents | Different model |
| **Cost** | API pay-as-you-go | **$0 (subscription)** | **Key advantage** |
| **File editing** | ✅ | ✅ | Equivalent |
| **Git operations** | ✅ | ✅ | Equivalent |

## Migration Steps

### Step 1: Update Claude Code

```bash
claude update
claude --version  # Needs v2.1.80+
```

### Step 2: Install Bun (for Telegram/Discord)

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.zshrc  # or ~/.bashrc
which bun  # Verify installation
```

### Step 3: Clone the ClawSouls Plugin

```bash
git clone https://github.com/clawsouls/clawsouls-claude-code-plugin.git ~/.claude/clawsouls-plugin
```

### Step 4: Migrate Your Workspace

**Option A: Automated migration (recommended)**

```bash
# Create your project directory
mkdir -p ~/projects/my-agent && cd ~/projects/my-agent

# Launch Claude Code with permissions skip + plugin
claude --dangerously-skip-permissions \
       --plugin-dir ~/.claude/clawsouls-plugin \
       --channels plugin:telegram@claude-plugins-official

# Inside Claude Code, run:
/clawsouls:migrate
```

When the LLM asks about Migration, type **yes** to confirm.

The migrate command auto-detects your `~/.openclaw/workspace/`, shows a preview of what will be copied/archived/skipped, and executes on your confirmation. It also generates a `CLAUDE.md` with memory rules and cleans OpenClaw-specific directives from `AGENTS.md`.

:::tip settings.json
Before launching, ensure your `~/.claude/settings.json` includes:
```json
{
  "enabledPlugins": {
    "telegram@claude-plugins-official": true
  },
  "skipDangerousModePermissionPrompt": true
}
```
This enables the Telegram plugin and removes the repeated permissions prompt.
:::

**Option B: Manual copy**

```bash
# Create your project directory
mkdir -p ~/projects/my-agent && cd ~/projects/my-agent

# Copy persona files
cp ~/.openclaw/workspace/SOUL.md ./
cp ~/.openclaw/workspace/IDENTITY.md ./
cp ~/.openclaw/workspace/AGENTS.md ./

# Copy memory
cp ~/.openclaw/workspace/MEMORY.md ./
cp -r ~/.openclaw/workspace/memory/ ./memory/

# Initialize git
git init && git add -A && git commit -m "init: migrate from OpenClaw"
```

### Step 5: Set Up Telegram

1. Create a bot via [@BotFather](https://t.me/BotFather) → `/newbot` → copy token
2. In Claude Code:
   ```
   /plugin install telegram@claude-plugins-official
   /telegram:configure <YOUR_BOT_TOKEN>
   ```

### Step 6: Launch

```bash
cd ~/projects/my-agent
claude --plugin-dir ~/.claude/clawsouls-plugin \
       --channels plugin:telegram@claude-plugins-official
```

### Step 7: Pair and Activate

1. Send a message to your bot on Telegram
2. In Claude Code:
   ```
   /telegram:access pair <CODE>
   /telegram:access policy allowlist
   /clawsouls:activate
   ```

Your agent is now running on Claude Code with Telegram access.

## Always-On Setup

OpenClaw runs as a daemon automatically. For Claude Code, use tmux or screen:

### tmux

```bash
# Install tmux (macOS)
brew install tmux

# Start a detached session
tmux new-session -d -s agent \
  'cd ~/projects/my-agent && \
   claude --plugin-dir ~/.claude/clawsouls-plugin \
          --channels plugin:telegram@claude-plugins-official'

# Attach to check on it
tmux attach -t agent

# Detach without stopping: Ctrl+B, then D
```

### screen

```bash
# Start a detached session
screen -dmS agent bash -c \
  'cd ~/projects/my-agent && \
   claude --plugin-dir ~/.claude/clawsouls-plugin \
          --channels plugin:telegram@claude-plugins-official'

# Attach
screen -r agent

# Detach: Ctrl+A, then D
```

### Auto-restart on reboot (macOS launchd)

Create `~/Library/LaunchAgents/com.clawsouls.agent.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.clawsouls.agent</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>cd ~/projects/my-agent && claude --plugin-dir ~/.claude/clawsouls-plugin --channels plugin:telegram@claude-plugins-official</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/clawsouls-agent.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/clawsouls-agent.err</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
        <key>HOME</key>
        <string>/Users/YOUR_USERNAME</string>
        <key>BUN_INSTALL</key>
        <string>/Users/YOUR_USERNAME/.bun</string>
    </dict>
</dict>
</plist>
```

```bash
# Load the agent
launchctl load ~/Library/LaunchAgents/com.clawsouls.agent.plist

# Check status
launchctl list | grep clawsouls

# Unload
launchctl unload ~/Library/LaunchAgents/com.clawsouls.agent.plist
```

## Heartbeat Workaround

OpenClaw has built-in heartbeat cron. For Claude Code, use an external cron that sends a Telegram message:

```bash
# Add to crontab (every 6 hours)
crontab -e
```

```
0 */6 * * * curl -s "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -d "chat_id=<YOUR_CHAT_ID>&text=heartbeat check — any pending tasks?" \
  > /dev/null 2>&1
```

The Telegram message triggers Claude Code to check for pending work.

## How Memory Works After Migration

In OpenClaw, the framework handles memory automatically — passive memory extraction, auto-compaction, and session hooks all run without explicit instructions. After migrating to Claude Code, memory becomes **instruction-driven**: the agent follows rules in `CLAUDE.md` to decide when and what to save.

### Add Memory Rules to CLAUDE.md

This is the most important step. Without these rules, the agent won't persist new knowledge across sessions:

```markdown
## Memory Rules
- Session start: read MEMORY.md + recent memory/*.md files
- Important decisions/discoveries → memory/YYYY-MM-DD.md (daily log)
- Long-running project context → memory/topic-<project>.md
- Long-term knowledge (contacts, architecture, rules) → promote to MEMORY.md
- Topic files: History max 30 lines, Decisions max 50 lines
- Before context gets full: save unsaved knowledge to memory files
- Use /clawsouls:memory search to find past context before answering
```

### Runtime Memory Flow

```
1. Session starts → agent reads MEMORY.md + memory/*.md (SessionStart hook)
2. During work → agent writes discoveries to memory/2026-04-05.md
3. Context fills up → PreCompact hook saves unsaved context
4. Session ends → SessionEnd hook flushes remaining knowledge
5. Next session → reads updated files, continues where it left off
```

### What the Agent Creates Automatically

| File | When created | Content |
|------|-------------|---------|
| `memory/YYYY-MM-DD.md` | Each working day | Decisions, bug fixes, progress notes |
| `memory/topic-*.md` | When a new project starts | Status, key decisions, history for that project |
| `MEMORY.md` updates | When important long-term knowledge emerges | Contacts, rules, architecture decisions |

### Multi-Agent Memory Sharing

If you run multiple Claude Code instances (e.g., one for coding, one for Telegram), use `memory_sync` to share knowledge via Git:

```bash
# Agent A pushes
memory_sync action=push agent_name=coding-agent

# Agent B pulls
memory_sync action=pull
```

Both agents see the same memory files. Conflicts are resolved by preferring newer + human edits.

## What You Keep

| Item | How |
|------|-----|
| **SOUL.md** | Copied to project root → CLAUDE.md or `/clawsouls:activate` |
| **IDENTITY.md** | Copied to project root |
| **AGENTS.md** | Copied to project root |
| **MEMORY.md** | Copied to project root |
| **memory/*.md** | Copied to `./memory/` directory |
| **Topic files** | Copied as-is, TF-IDF search works identically |
| **Daily logs** | Copied as-is |
| **Git history** | Start fresh or copy `.git/` |

## What Changes

| OpenClaw Feature | Claude Code Equivalent |
|------------------|----------------------|
| `openclaw.json` config | `CLAUDE.md` + `--plugin-dir` + `.mcp.json` |
| Gateway daemon | `claude --channels` in tmux/screen |
| `openclaw gateway start` | `tmux new-session -d -s agent 'claude ...'` |
| Heartbeat cron | External cron → Telegram message |
| `sessions_spawn` | Claude Code agents / `--agents` flag |
| Multi-channel simultaneous | `--channels` accepts multiple plugins |
| SoulClaw memory hooks | ClawSouls plugin hooks (PreCompact/PostCompact) |

## Hybrid Approach (Recommended)

You don't have to choose one or the other. Many users run both:

- **OpenClaw**: Always-on hub for automated tasks, cron jobs, multi-channel routing
- **Claude Code Channels**: Cost-effective coding sessions and Telegram access within subscription

Both share the same Soul Spec files and memory directory. Changes made in one are visible to the other.

```
~/projects/my-agent/
├── SOUL.md          ← shared
├── IDENTITY.md      ← shared
├── AGENTS.md        ← shared
├── MEMORY.md        ← shared
├── memory/          ← shared
├── CLAUDE.md        ← Claude Code reads this
└── .openclaw/       ← OpenClaw reads this
```

## Troubleshooting

See the [Telegram Channels Setup](/docs/guides/telegram-channels#troubleshooting) guide for common issues.

## Next Steps

- [ClawSouls Plugin Guide](/docs/guides/claude-code-plugin) — Full plugin documentation
- [Telegram Channels Setup](/docs/guides/telegram-channels) — Detailed Telegram guide
- [Soul Spec v0.5](/docs/spec/v0.5) — Full specification
