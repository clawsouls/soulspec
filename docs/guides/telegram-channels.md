---
sidebar_position: 10
title: Telegram Channels Setup
description: Connect Claude Code to Telegram — message your AI agent from your phone with Soul Spec personas and persistent memory.
---

# Telegram Channels Setup

Connect Claude Code to Telegram so you can message your AI agent from your phone. Combined with the ClawSouls plugin, your agent maintains its Soul Spec persona and memory across all conversations.

## Overview

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Telegram    │ ──→ │  Claude Code      │ ──→ │  Your Code  │
│  (Phone)     │ ←── │  + ClawSouls      │ ←── │  + Memory   │
│              │     │  + Telegram       │     │  + Git      │
└─────────────┘     └──────────────────┘     └─────────────┘
```

## Prerequisites

| Requirement | How to get it |
|-------------|---------------|
| Claude Code v2.1.80+ | `claude update` |
| Bun runtime | `curl -fsSL https://bun.sh/install \| bash` |
| Telegram account | [telegram.org](https://telegram.org) |
| Telegram bot token | [@BotFather](https://t.me/BotFather) → `/newbot` |

## Step-by-Step Setup

### 1. Create a Telegram Bot

Open Telegram, search for **@BotFather**, and send:

```
/newbot
```

Follow the prompts:
- **Name**: Your agent's display name (e.g., "Brad Dev")
- **Username**: Must end in `bot` (e.g., `brad_dev_bot`)

Copy the token that BotFather returns (looks like `1234567890:AAH...`).

### 2. Enable the Telegram Plugin

Edit your Claude Code settings file:

```bash
vi ~/.claude/settings.json
```

Add the following (merge with existing content if file already exists):

```json
{
  "enabledPlugins": {
    "telegram@claude-plugins-official": true
  },
  "skipDangerousModePermissionPrompt": true
}
```

:::tip skipDangerousModePermissionPrompt
Setting `skipDangerousModePermissionPrompt: true` removes the repeated permission prompt when using `--dangerously-skip-permissions`. This is required for always-on agent sessions.
:::

### 3. Install ClawSouls Plugin (Optional)

For persona management:

```bash
git clone https://github.com/clawsouls/clawsouls-claude-code-plugin.git ~/.claude/clawsouls-plugin
```

### 4. Launch with Channels

Exit Claude Code and restart:

```bash
# With ClawSouls plugin + permissions skip
claude --dangerously-skip-permissions \
       --plugin-dir ~/.claude/clawsouls-plugin \
       --channels plugin:telegram@claude-plugins-official

# Without ClawSouls plugin
claude --dangerously-skip-permissions \
       --channels plugin:telegram@claude-plugins-official
```

:::info --dangerously-skip-permissions
This flag allows the agent to execute tools (file editing, shell commands) without manual confirmation for each action. Required for autonomous agent operation via Telegram. The `skipDangerousModePermissionPrompt` setting in `settings.json` prevents the repeated warning prompt.
:::

Look for: `Listening for channel messages from: plugin:telegram@claude-plugins-official`

### 5. Pair Your Account

1. Send **any message** to your bot on Telegram
2. The bot replies with a **pairing code**
3. In Claude Code, run:
   ```
   /telegram:access pair <CODE>
   /telegram:access policy allowlist
   ```

### 6. Test

Send a message to your bot on Telegram. Claude Code should receive it and reply.

If you have the ClawSouls plugin, activate your persona:
```
/clawsouls:activate
```

## Always-On Setup

### tmux (Recommended)

```bash
tmux new-session -d -s agent \
  'cd ~/my-project && claude --plugin-dir ~/.claude/clawsouls-plugin \
                             --channels plugin:telegram@claude-plugins-official'

# Attach later
tmux attach -t agent

# Detach: Ctrl+B, then D
```

### screen

```bash
screen -dmS agent bash -c \
  'cd ~/my-project && claude --plugin-dir ~/.claude/clawsouls-plugin \
                             --channels plugin:telegram@claude-plugins-official'

# Attach later
screen -r agent
```

## Troubleshooting

### Bot doesn't respond to messages

| Check | Fix |
|-------|-----|
| Claude Code running with `--channels`? | Must include `--channels plugin:telegram@...` |
| Bun installed and in PATH? | `which bun` → should show path. If not: `source ~/.zshrc` |
| Token configured? | `/telegram:configure <TOKEN>` or check `~/.claude/channels/telegram/.env` |
| Plugin installed? | `/plugin install telegram@claude-plugins-official` |

### "Pending pairings: 0" after messaging bot

The channel server isn't receiving Telegram updates. Most common cause: Bun not in PATH when Claude Code was started. Open a **new terminal tab** (loads `.zshrc`) and restart.

### Another process stole the updates

If you called the Telegram API directly (e.g., `curl .../getUpdates`), it consumes the updates before the plugin can read them:

```bash
# Clear the queue
curl "https://api.telegram.org/bot<TOKEN>/getUpdates?offset=-1"
```

Then restart Claude Code.

### Connection works but persona isn't applied

If using `CLAUDE.md` method: ensure the file is in the project root where you launched `claude`.

If using the plugin: run `/clawsouls:activate` after connecting.

## Tips

- **Multiple channels**: Add both Telegram and Discord:
  ```bash
  claude --channels plugin:telegram@claude-plugins-official \
         --channels plugin:discord@claude-plugins-official
  ```

- **Project-specific**: Always `cd` to your project directory before launching. Claude Code reads `CLAUDE.md` and Soul Spec files from the working directory.

- **Memory persistence**: With the ClawSouls plugin, memory is saved before context compaction via hooks. Without the plugin, consider manually maintaining a `MEMORY.md`.

## Next Steps

- [ClawSouls Plugin Guide](/docs/guides/claude-code-plugin) — Full plugin documentation
- [Your First Soul](/docs/getting-started/your-first-soul) — Create your own persona
- [Soul Spec v0.5](/docs/spec/v0.5) — Full specification
