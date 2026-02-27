---
sidebar_position: 4
title: Cursor + Soul Spec
description: Give Cursor a persistent AI persona using Soul Spec.
---

# Cursor + Soul Spec

[Cursor](https://cursor.com) is an AI-first code editor built on VS Code. It supports custom instructions via `.cursor/rules/` directory or a `.cursorrules` file in your project root.

Soul Spec gives Cursor a real persona. Install a soul, export the files into Cursor's rules directory, and your AI assistant gets a consistent identity.

## Quick Start (2 minutes)

### Step 1: Install the CLI

```bash
npm install -g clawsouls
```

### Step 2: Install a soul

```bash
clawsouls install TomLeeLive/brad
```

### Step 3: Export to Cursor format

**Option A — Single `.cursorrules` file:**

```bash
clawsouls export cursorrules --dir ~/.clawsouls/souls/TomLeeLive/brad -o ./my-project/.cursorrules
```

**Option B — `.cursor/rules/` directory (recommended):**

```bash
mkdir -p ./my-project/.cursor/rules/
cp ~/.clawsouls/souls/TomLeeLive/brad/SOUL.md ./my-project/.cursor/rules/
cp ~/.clawsouls/souls/TomLeeLive/brad/IDENTITY.md ./my-project/.cursor/rules/
cp ~/.clawsouls/souls/TomLeeLive/brad/STYLE.md ./my-project/.cursor/rules/
cp ~/.clawsouls/souls/TomLeeLive/brad/AGENTS.md ./my-project/.cursor/rules/
```

### Step 4: Open in Cursor

```bash
cursor ./my-project
```

Cursor reads the rules automatically and adopts the persona.

## Why .cursor/rules/ is Better

The rules directory approach keeps files separate:

```
my-project/
├── .cursor/
│   └── rules/
│       ├── SOUL.md
│       ├── IDENTITY.md
│       ├── STYLE.md
│       └── AGENTS.md
├── src/
└── ...
```

Benefits:
- Edit individual files without merging
- Git diffs are cleaner
- Add project-specific rules alongside persona files
- Matches Soul Spec's native file structure

## Use the MCP Server

Cursor supports MCP servers natively. Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "soul-spec": {
      "command": "npx",
      "args": ["-y", "soul-spec-mcp"]
    }
  }
}
```

Then say in Cursor's chat: *"Apply the surgical-coder persona"*

## Tips

- **Project-specific personas.** Different projects get different `.cursor/rules/`.
- **Git-friendly.** Commit `.cursor/rules/` to share with your team.
- **Combine with technical rules.** Add `CODING_STANDARDS.md` alongside persona files.
- **Switching personas.** Different projects, different souls — just export to each.
