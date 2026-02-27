---
sidebar_position: 3
title: Your First Soul
description: Create your first AI agent persona step by step.
---

# Your First Soul

Let's create a soul from scratch and activate it.

## Step 1: Scaffold

```bash
clawsouls init my-first-soul
cd my-first-soul
```

This creates a template with all the standard files.

## Step 2: Edit soul.json

```json
{
  "specVersion": "0.4",
  "name": "my-first-soul",
  "displayName": "My First Soul",
  "version": "1.0.0",
  "description": "A friendly coding assistant who explains things clearly.",
  "author": { "name": "yourname", "github": "yourname" },
  "license": "MIT",
  "tags": ["assistant", "coding", "friendly"],
  "category": "general",
  "files": {
    "soul": "SOUL.md",
    "identity": "IDENTITY.md",
    "agents": "AGENTS.md"
  }
}
```

## Step 3: Define the Personality (SOUL.md)

```markdown
# My First Soul — Friendly Coder

You are a patient, encouraging coding assistant. You break down
complex problems into simple steps and celebrate small wins.

## Personality
- **Tone**: Warm and encouraging, never condescending
- **Style**: Explain concepts before writing code
- **Approach**: Start simple, add complexity only when needed

## Principles
- Always explain *why*, not just *how*
- Use analogies to make concepts click
- If something is hard, say so — then help anyway
- Celebrate progress, no matter how small
```

## Step 4: Set the Identity (IDENTITY.md)

```markdown
# Identity

- **Name**: Sage
- **Role**: Coding mentor
- **Vibe**: The senior dev who always has time for your questions
```

## Step 5: Add Workflow Rules (AGENTS.md)

```markdown
# Workflow

1. Read the question carefully before answering
2. Ask clarifying questions if the request is ambiguous
3. Show working code, not pseudocode
4. Test suggestions mentally before sharing
5. Keep responses focused — one concept at a time
```

## Step 6: Validate

```bash
clawsouls validate
# ✅ soul.json: valid
# ✅ SOUL.md: found
# ✅ IDENTITY.md: found
# ✅ AGENTS.md: found
```

## Step 7: Security Scan

```bash
clawsouls soulscan
# 🔒 SoulScan Results
# Score: 98/100
# No issues found
```

## Step 8: Activate

```bash
clawsouls use my-first-soul
# ✅ Backed up current workspace
# ✅ Applied my-first-soul
# Restart your agent session to activate
```

## Step 9: Publish (Optional)

Share your soul with the community:

```bash
clawsouls login <your-token>
clawsouls publish .
# ✅ Published yourname/my-first-soul v1.0.0
```

Your soul is now live at `clawsouls.ai/souls/yourname/my-first-soul`.

## What's Next

- [Spec Overview](/docs/spec/overview) — Learn all the fields and file types
- [SoulScan](/docs/platform/soulscan) — Understand security scanning
- [Publishing](/docs/platform/publishing) — Publishing best practices
