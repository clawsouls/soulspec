---
sidebar_position: 5
title: Migration Guide
description: How to upgrade between Soul Spec versions.
---

# Migration Guide

## v0.4 → v0.5

v0.5 is **fully backward compatible** with v0.4. All v0.4 souls work without changes.

### New Optional Fields

If you're building for robotics or embodied agents, v0.5 adds:

- `environment` — Physical context (indoor/outdoor, noise level)
- `interactionMode` — How users interact (voice, gesture, touch)
- `sensors` / `actuators` — Hardware capability declarations

### To Upgrade

1. Change `specVersion` to `"0.5"` in `soul.json`
2. Add robotics fields if applicable
3. Run `clawsouls validate`

## v0.3 → v0.4

### Breaking Changes

These fields are **deprecated** in v0.4:

| Field | Action | Migration |
|-------|--------|-----------|
| `modes` | Remove | No runtime ever consumed this field |
| `interpolation` | Remove | No runtime implementation |
| `skills` | Replace with `recommendedSkills` | `"skills": ["a"]` → `"recommendedSkills": [{"name": "a"}]` |

### New Fields

| Field | Purpose |
|-------|---------|
| `compatibility.frameworks` | Declare compatible frameworks |
| `allowedTools` | Tools this soul expects |
| `recommendedSkills` | Skills with version constraints |
| `disclosure.summary` | One-line summary (max 200 chars) |
| `deprecated` | Mark a soul as deprecated |
| `supersededBy` | Replacement soul reference |

### To Upgrade

1. Change `specVersion` to `"0.4"`
2. Remove `modes`, `interpolation`, `skills`
3. Add `recommendedSkills` if you had `skills`
4. Run `clawsouls validate`

## v0.2 → v0.3

### Breaking Changes

- **Renamed**: `clawsouls.json` → `soul.json`
- **Added**: `specVersion` field (required)
- **Added**: License allowlist for registry publishing

### To Upgrade

1. Rename `clawsouls.json` to `soul.json`
2. Add `"specVersion": "0.3"`
3. Ensure `license` is in the allowed list
4. Run `clawsouls validate`
