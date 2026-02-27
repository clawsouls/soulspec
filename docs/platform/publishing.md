---
sidebar_position: 1
title: Publishing
description: How to publish a soul to the ClawSouls registry.
---

# Publishing a Soul

Share your soul with the community by publishing to [clawsouls.ai](https://clawsouls.ai).

## Prerequisites

- A valid soul package (passes `clawsouls validate`)
- A ClawSouls account
- `specVersion` of `0.3` or higher

## Steps

### 1. Validate

```bash
clawsouls validate ./my-soul
clawsouls soulscan ./my-soul
```

Fix any issues before publishing.

### 2. Authenticate

```bash
clawsouls login <your-token>
```

Get your token from [clawsouls.ai/dashboard](https://clawsouls.ai/dashboard).

### 3. Publish

```bash
clawsouls publish ./my-soul
```

Your soul is now live at `clawsouls.ai/souls/yourname/my-soul`.

## Requirements

- `soul.json` must include all required fields
- `SOUL.md` must exist
- License must be in the [allowed list](/docs/spec/overview#allowed-licenses)
- SoulScan score must be above the minimum threshold
- `name` must be unique within your account

## Updating

Bump the `version` in `soul.json` and publish again:

```bash
# Update version
# soul.json: "version": "1.1.0"

clawsouls publish ./my-soul
```

## Unpublishing

Contact support or use the dashboard to unpublish a soul.

## Best Practices

- Write a clear `description` — it's the first thing users see
- Use relevant `tags` for discoverability
- Include `examples/good-outputs.md` to show expected behavior
- Add a `disclosure.summary` for progressive disclosure
- Test with `clawsouls soulscan` before every publish
