---
sidebar_position: 2
title: Changelog
description: Soul Spec version history.
---

# Changelog

## v0.5 — 2026-02-23

**Robotics & Embodied Agents**

- Added `environment` field for physical context
- Added `interactionMode` for voice/gesture/touch interactions
- Added `sensors` and `actuators` schemas for hardware declarations
- Added `allowedTools` field (also backported to v0.4)
- Full backward compatibility with v0.4

## v0.4 — 2026-02-20

**Multi-Framework Compatibility**

- Added `compatibility.frameworks` for declaring compatible frameworks
- Added `recommendedSkills` with version constraints (replaces `skills`)
- Added `disclosure.summary` for progressive disclosure
- Added `deprecated` and `supersededBy` fields
- Deprecated `modes`, `interpolation`, `skills`
- `compatibility.openclaw` now validated by SoulScan + CLI

## v0.3 — 2026-02-16

**Registry-Ready**

- Renamed `clawsouls.json` → `soul.json`
- Added required `specVersion` field
- Added license allowlist for registry publishing
- Minimum version required for publishing

## v0.2 — 2026-02-13

*Internal development spec*

- Added `STYLE.md` support
- Added `modes` and `interpolation` fields
- Added `examples` (good/bad outputs)

## v0.1 — 2026-02-12

*Initial spec prototype*

- Basic `soul.json` schema
- `SOUL.md`, `IDENTITY.md`, `AGENTS.md` file structure
- First draft of required/optional fields
