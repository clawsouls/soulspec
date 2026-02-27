---
sidebar_position: 6
title: Memory Sync
description: Encrypt and sync your AI agent's memory across devices.
---

# Memory Sync

AI agents accumulate knowledge over time — conversation logs, preferences, project context — stored in files like `MEMORY.md` and `memory/*.md`. **Memory Sync** encrypts these files locally and pushes them to a GitHub private repository, so you can pull them on any device.

- 🔐 **End-to-end encrypted** — files are encrypted before leaving your machine
- 🔄 **Cross-device sync** — share memory between your laptop, desktop, and CI
- 📦 **GitHub-backed** — versioned, private, and free

## Why Do You Need It?

| Problem | Solution |
|---|---|
| Agent forgets everything on a new machine | Pull encrypted memory and resume |
| Memory files contain sensitive data | age encryption — server never sees the key |
| No backup for agent knowledge | GitHub private repo = automatic backup |
| Multiple devices, fragmented context | One encrypted repo, any device |

## Prerequisites

- Node.js 18+
- A [GitHub Personal Access Token](https://github.com/settings/tokens) with `repo` scope

## Quick Start

### 1. Initialize

```bash
npx clawsouls sync init
```

This will:
- Prompt for your GitHub PAT
- Create a private repo (e.g. `clawsouls-memory-sync`) on your GitHub account
- Generate an **age keypair** (X25519) and store it locally

### 2. Push (Encrypt & Upload)

```bash
npx clawsouls sync push
```

### 3. Pull (Download & Decrypt)

```bash
npx clawsouls sync pull
```

### 4. Check Status

```bash
npx clawsouls sync status
```

## Key Management

Your encryption key is the **only way** to decrypt your memory. Treat it like a password.

### Export Your Key

```bash
npx clawsouls sync export-key
```

Store it somewhere safe (password manager, encrypted USB).

### Import on New Device

```bash
npx clawsouls sync import-key
```

:::danger
**If you lose your key, your encrypted memory is unrecoverable.** There is no server-side backup. Export immediately after `sync init`.
:::

## How It Works

```
Local memory files
       │
       ▼
  age encrypt (X25519)
       │
       ▼
  GitHub Private Repo (encrypted blobs)
       │
       ▼
  age decrypt (local key)
       │
       ▼
  Memory restored on new device
```

**Tech stack:** [age](https://age-encryption.org/) encryption, GitHub API, local keystore.

## FAQ

### Can I sync multiple agents?

Yes. Each agent can have its own sync repo. Run `sync init` in each agent's working directory.

### Is my data safe on GitHub?

GitHub stores only encrypted blobs. Without your local private key, the data is indistinguishable from random bytes.

### Can I use this with a team?

Share the exported key with trusted team members via a secure channel. Anyone with the key and GitHub access can push and pull memory.
