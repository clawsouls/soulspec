# Soul Spec

**An open standard for AI agent personas.**

Latest version: **v0.5** ([soul-spec-v0.5.md](./soul-spec-v0.5.md))

Website: [soulspec.org](https://soulspec.org) · Registry: [clawsouls.ai](https://clawsouls.ai)

## Version History

| Version | Date | Status | Description |
|---------|------|--------|-------------|
| [v0.5](./soul-spec-v0.5.md) | 2026-02-23 | **Current** | Robotics/embodied agents, sensors, allowedTools, hardware-aware personas |
| [v0.4](./soul-spec-v0.4.md) | 2026-02-20 | Supported | Multi-framework compatibility, recommendedSkills, progressive disclosure, soul lifecycle |
| [v0.3](./soul-spec-v0.3.md) | 2026-02-16 | Supported | specVersion field, soul.json rename, license allowlist |
| [v0.2](./soul-spec-v0.2.md) | 2026-02-13 | Internal | STYLE.md, examples, modes, interpolation |
| [v0.1](./soul-spec-v0.1.md) | 2026-02-12 | Internal | Initial spec prototype |

> **Note**: v0.1 and v0.2 were internal development specs. The registry requires **v0.3 or higher** for publications.

## Quick Start

A minimal soul package:

```
my-soul/
├── soul.json       # Metadata (name, version, author, tags)
├── SOUL.md         # Core personality & behavior
├── IDENTITY.md     # Name, appearance, background
└── AGENTS.md       # Workflow rules & tool usage
```

### soul.json

```json
{
  "specVersion": "0.4",
  "name": "my-soul",
  "displayName": "My Soul",
  "version": "1.0.0",
  "description": "A helpful assistant with a unique personality.",
  "author": { "name": "yourname", "github": "yourname" },
  "license": "MIT",
  "tags": ["assistant"],
  "category": "general",
  "files": { "soul": "SOUL.md", "identity": "IDENTITY.md", "agents": "AGENTS.md" }
}
```

## Tools & Ecosystem

- **CLI**: `npx clawsouls init my-soul` — scaffold a new soul
- **Registry**: [clawsouls.ai](https://clawsouls.ai) — browse, publish, install
- **MCP Server**: [soul-spec-mcp](https://www.npmjs.com/package/soul-spec-mcp) — search & apply souls via MCP
- **SoulScan**: Security validation (53 patterns) — built into CLI and web editor
- **Web Editor**: [clawsouls.ai/dashboard/editor/new](https://clawsouls.ai/en/dashboard/editor/new) — create in browser

## Compatible Frameworks

Soul Spec works with any SOUL.md-compatible agent framework:

- [OpenClaw](https://openclaw.ai)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Desktop](https://claude.ai)
- [Cursor](https://cursor.sh)
- [Windsurf](https://codeium.com/windsurf)
- And any tool that reads markdown persona files

## Contributing

Soul Spec is maintained by [ClawSouls](https://github.com/clawsouls). Issues and pull requests welcome.

## License

[CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)
