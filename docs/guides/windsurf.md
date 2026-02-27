---
sidebar_position: 5
title: Windsurf + Soul Spec
description: Give Windsurf a persistent AI persona using Soul Spec.
---

# Windsurf + Soul Spec

[Windsurf](https://windsurf.com) (by Codeium) is an AI-powered code editor. It supports custom instructions via a `.windsurfrules` file in your project root or global rules in settings.

Soul Spec gives Windsurf a real persona. Install a soul, export it to `.windsurfrules`, and your AI assistant gets a consistent identity.

## Quick Start (2 minutes)

### Step 1: Install the CLI

```bash
npm install -g clawsouls
```

### Step 2: Install a soul

```bash
clawsouls install TomLeeLive/brad
```

### Step 3: Export to Windsurf format

```bash
clawsouls export windsurfrules --dir ~/.clawsouls/souls/TomLeeLive/brad -o ./my-project/.windsurfrules
```

### Step 4: Open in Windsurf

```bash
windsurf ./my-project
```

Windsurf reads `.windsurfrules` automatically and adopts the persona.

## Global vs Per-Project Rules

**Per-project (`.windsurfrules`):** Best for project-specific personas.

**Global rules:** Best for a default persona across all projects. Set in Windsurf Settings → search "Rules".

Per-project `.windsurfrules` takes precedence over global rules.

## Use the MCP Server

Windsurf supports MCP servers. Add to Windsurf's MCP configuration:

```json
{
  "soul-spec": {
    "command": "npx",
    "args": ["-y", "soul-spec-mcp"]
  }
}
```

Then ask Windsurf: *"Apply the surgical-coder persona"*

## Tips

- **Project-specific personas.** Each project gets its own `.windsurfrules`.
- **Git-friendly.** Commit `.windsurfrules` to share with your team.
- **Combine with technical rules.** Add project-specific coding conventions in the same file.
- **Update easily.** `clawsouls install <name> -f && clawsouls export windsurfrules --dir ...`
