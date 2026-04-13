---
sidebar_position: 11
title: Import to Soul Spec
description: Convert existing persona configs (CLAUDE.md, .cursorrules, system prompts) into Soul Spec files with intelligent keyword classification.
---

# Import to Soul Spec

The `clawsouls import` command converts your existing persona configurations into Soul Spec format. Whether you're using a CLAUDE.md file, Cursor rules, or plain system prompts, import intelligently extracts persona content and classifies it into Soul Spec sections.

## Overview

Soul Spec defines personas in three complementary files:
- **SOUL.md** — Personality, principles, and values
- **IDENTITY.md** — Name, creature type, and vibe
- **AGENTS.md** — Workflow rules, work style, and safety

The import command uses keyword matching and confidence scoring to assign your existing text to the correct sections, then previews the result before writing files.

## Supported Formats

| Format | Extension | Framework | Support |
|--------|-----------|-----------|---------|
| **CLAUDE.md** | `.md` | Claude Code / OpenClaw | Full |
| **Cursor Rules** | `.cursorrules` | Cursor / JetBrains IDEs | Full |
| **Windsurf Rules** | `.windsurfrules` | Windsurf | Full |
| **System Prompt** | `.txt` / `.md` | Any LLM | Full |
| **Instructions** | `instructions.md` | Claude Desktop | Full |

All formats are converted to the same Soul Spec output. Just point the import command at your file.

## Quick Start

### From CLAUDE.md

```bash
npx clawsouls import ./CLAUDE.md --output ./soul/
```

This creates:
```
soul/
├── SOUL.md       # Personality + principles
├── IDENTITY.md   # Name, creature, vibe
└── AGENTS.md     # Workflow + safety rules
```

### From Cursor .cursorrules

```bash
npx clawsouls import ./.cursorrules --output ./soul/
```

### From System Prompt (plain text)

```bash
npx clawsouls import system-prompt.txt --output ./soul/
```

### Dry Run (preview without writing)

```bash
npx clawsouls import ./CLAUDE.md --dry-run
```

Output shows a table with section assignments and confidence scores:

```
┌────────────────────────────┬──────────────┬────────────┐
│ Content                    │ Target       │ Confidence │
├────────────────────────────┼──────────────┼────────────┤
│ "I am Claude, an AI..."    │ IDENTITY.md  │ 95%        │
│ "Prioritize accuracy..."   │ SOUL.md      │ 88%        │
│ "Use TypeScript strict..." │ AGENTS.md    │ 92%        │
│ "[MEMORY section]"         │ SKIP         │ —          │
│ "[Config block]"           │ SKIP         │ —          │
└────────────────────────────┴──────────────┴────────────┘
```

## How Classification Works

The import engine uses **keyword matching** in English and Korean to assign paragraphs to sections. Sections with no matched keywords are marked `SKIP`.

### Keywords by Section

**SOUL.md** (Personality & Principles)
- `personality`, `character`, `principle`, `value`, `believe`, `ethics`, `philosophy`
- `특성`, `성격`, `원칙`, `철학`, `가치관`
- Words like: think, feel, always, never, important, care about

**IDENTITY.md** (Name, Creature, Vibe)
- `name`, `I am`, `identity`, `creature`, `type`, `role`, `who`, `vibe`, `style`
- `이름`, `나는`, `정체성`, `생물`, `역할`, `타입`, `분위기`, `스타일`
- Context: First-person sentences, introductions

**AGENTS.md** (Workflow & Safety)
- `workflow`, `rules`, `process`, `step`, `do`, `don't`, `must`, `never`, `safety`, `boundary`, `permission`
- `워크플로우`, `규칙`, `프로세스`, `절차`, `해야`, `금지`, `안전`, `경계`, `권한`
- Imperatives and conditional logic

### SKIP Sections

These are **not converted** but preserved in a report:
- `[MEMORY]` blocks — memory structure varies by platform
- `[CONFIG]` / `[SETUP]` — configuration and installation steps
- `[API KEYS]` / `[CREDENTIALS]` — removed for safety
- Metadata headers (`---`, `title:`, `description:`)
- Tables with metadata (sidebars, frontmatter, etc.)

**Skipped content is not lost** — the import tool lists all skipped sections in the output report so you can manually add them later if needed.

### Confidence Scoring

Each paragraph gets a confidence score (0–100%):
- **90%+**: High confidence — multi-section keywords, clear intent
- **70–89%**: Good confidence — primary keywords + context clues
- **50–69%**: Moderate — single keyword or weak context
- **<50%**: Low — ambiguous; marked for manual review

Low-confidence sections appear in the output report. Review and reassign manually if needed.

## Example Dry Run

```bash
$ npx clawsouls import ./CLAUDE.md --dry-run

┌─────────────────────────────────────────┬──────────────┬────────────┐
│ Content Preview                         │ Target       │ Confidence │
├─────────────────────────────────────────┼──────────────┼────────────┤
│ "I'm Brad, a 막내 of three brothers..." │ IDENTITY.md  │ 98%        │
│ "Always default to parallelism..."      │ SOUL.md      │ 84%        │
│ "Read MEMORY.md first each session..."  │ AGENTS.md    │ 91%        │
│ "Set SIDEBAR_POSITION = 11"             │ SKIP (cfg)   │ —          │
│ "[Bro Mailbox config block]"            │ SKIP (cfg)   │ —          │
│ "Never commit secrets to git..."        │ AGENTS.md    │ 87%        │
└─────────────────────────────────────────┴──────────────┴────────────┘

Summary:
  SOUL.md: 3 paragraphs, avg 87%
  IDENTITY.md: 1 paragraph, avg 98%
  AGENTS.md: 2 paragraphs, avg 89%
  SKIP: 2 sections (config, memory)

Ready to import? Run without --dry-run to write files.
```

## Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--input` | path | (required) | Path to input file (CLAUDE.md, .cursorrules, etc.) |
| `--output` | path | `./soul/` | Directory to write SOUL.md, IDENTITY.md, AGENTS.md |
| `--dry-run` | flag | false | Preview classification without writing files |
| `--smart` | flag | false | Enable GPT-assisted refinement (higher quality, slower) |
| `--name` | string | (auto-detect) | Soul name (used for metadata comments in output files) |
| `--force` | flag | false | Overwrite existing output files without prompting |

### Option Details

**--input** (Required)
```bash
npx clawsouls import CLAUDE.md
npx clawsouls import ./.cursorrules
npx clawsouls import system-prompt.txt
```

**--output** (Directory)
```bash
# Write to custom directory
npx clawsouls import CLAUDE.md --output ~/.clawsouls/active/my-persona/

# Default: ./soul/
npx clawsouls import CLAUDE.md
```

**--dry-run** (Preview)
```bash
# See classification and confidence before writing
npx clawsouls import CLAUDE.md --dry-run

# Outputs table, then exits (no files written)
```

**--smart** (AI-Assisted)
```bash
# Use GPT to refine classification for better results
npx clawsouls import CLAUDE.md --smart

# Slower (~30s) but more accurate for ambiguous content
# Requires OPENAI_API_KEY
```

**--name** (Metadata)
```bash
# Set soul name in output file comments
npx clawsouls import CLAUDE.md --name my-assistant

# Default: auto-detected from CLAUDE.md or filename
```

**--force** (Overwrite)
```bash
# Skip confirmation and overwrite existing files
npx clawsouls import CLAUDE.md --force

# Without --force, will prompt if files exist
```

## Tips

### When Confidence is Low

If your dry run shows many low-confidence results, try:

1. **Use --smart for AI refinement**
   ```bash
   npx clawsouls import CLAUDE.md --smart
   ```
   This uses OpenAI's API to re-classify ambiguous sections (slower, better accuracy).

2. **Manually review and fix**
   - Run `--dry-run` to see the output
   - Note sections with <70% confidence
   - Move text to correct files after import
   - Use `/clawsouls:scan` to verify safety after edits

3. **Check SKIP list**
   - Review skipped sections in the report
   - Add memory/config sections back manually if needed
   - Sections marked SKIP (memory, config) were intentionally excluded for portability

### Editing After Import

The import is a starting point — you'll likely refine it:

1. **Import as draft**
   ```bash
   npx clawsouls import CLAUDE.md --output ./draft/
   ```

2. **Review and edit** the three files manually

3. **Verify safety**
   ```bash
   /clawsouls:scan ./draft/
   ```

4. **Move to final location**
   ```bash
   mv ./draft/* ~/.clawsouls/active/my-persona/
   ```

5. **Load and test**
   ```bash
   /clawsouls:load-soul my-persona
   /clawsouls:activate
   ```

### Handling Unsupported Formats

If your persona file isn't in a standard format:

1. **Save as plain text**
   ```bash
   # Copy/paste into a .txt file
   cat my-rules.json | jq -r '.instructions' > persona.txt
   ```

2. **Import the text file**
   ```bash
   npx clawsouls import persona.txt --dry-run
   ```

3. **Refine with --smart if needed**
   ```bash
   npx clawsouls import persona.txt --smart
   ```

## From Other Platforms

### Cursor (.cursorrules)

```bash
npx clawsouls import ./.cursorrules --output ./soul/
```

Cursor rules use the same plaintext format as CLAUDE.md. Import handles both identically.

**Migrating from Cursor?**
- Keep `.cursorrules` as-is (for Cursor use)
- Export your Soul Spec for Claude Code
- Load in Claude Code with the ClawSouls plugin
- Both tools can now share the same persona

### Windsurf (.windsurfrules)

```bash
npx clawsouls import ./.windsurfrules --output ./soul/
```

Windsurf uses the same format as Cursor. Full compatibility.

### Plain System Prompt

Any system prompt text file works:

```bash
# From a .txt file
npx clawsouls import system-prompt.txt

# From JSON (extract the instruction field)
cat config.json | jq -r '.system_prompt' > prompt.txt
npx clawsouls import prompt.txt

# From a PDF or document (copy/paste to .txt first)
npx clawsouls import prompt.txt --smart
```

## Workflow: Import → Review → Publish

```
1. Export from old platform (Cursor, OpenClaw, etc.)
2. npx clawsouls import old-persona.txt --dry-run
3. Review confidence table
4. npx clawsouls import old-persona.txt --smart (if low confidence)
5. Edit SOUL.md, IDENTITY.md, AGENTS.md manually
6. /clawsouls:scan to verify safety
7. npx clawsouls publish (to share on registry)
```

## FAQ

**Q: My content is split across multiple files. Can I import all at once?**

A: Not yet. Import one file per run. You can manually merge SOUL.md, IDENTITY.md, AGENTS.md afterward:
```bash
npx clawsouls import file1.md --output ./soul1/
npx clawsouls import file2.md --output ./soul2/
# Manually edit and combine into ~/.clawsouls/active/my-persona/
```

**Q: Does import remove credentials or secrets?**

A: Yes. Sections tagged `[CONFIG]`, `[CREDENTIALS]`, `[API KEYS]` are automatically skipped. Always review the output before committing to git.

**Q: Can I import from Claude Desktop instructions.md?**

A: Yes:
```bash
npx clawsouls import ~/Library/Application\ Support/Claude/instructions.md --output ./soul/
```

**Q: What if --smart fails or requires API key?**

A: `--smart` is optional. Standard keyword matching works for most personas. Only use `--smart` if:
- Confidence scores are consistently low (<60%)
- Your persona has non-English content (mixed KR/EN)
- Content is highly abstract or unusual

Set `OPENAI_API_KEY` env var first:
```bash
export OPENAI_API_KEY=sk-...
npx clawsouls import CLAUDE.md --smart
```

**Q: How do I merge multiple personas into one Soul?**

A: Import separately, then manually edit:
```bash
npx clawsouls import persona1.md --output ./temp1/
npx clawsouls import persona2.md --output ./temp2/

# Manually combine:
cat ./temp1/SOUL.md ./temp2/SOUL.md > final/SOUL.md
# Edit to remove duplicates
```

## See Also

- [Soul Spec Standard](../spec/overview)
- [Your First Soul](../getting-started/your-first-soul)
- [ClawSouls Registry](https://clawsouls.ai/souls)
- [SoulScan Safety Verification](../platform/soulscan)
