---
sidebar_position: 8
title: Local LLM with Gemma 4
description: Run Soul Spec agents locally with Ollama and Gemma 4 26B — zero server cost, full tool calling support.
---

# Local LLM with Gemma 4

Run your Soul Spec agent locally using [Ollama](https://ollama.com/) and Gemma 4 26B — a full dense 26B parameter model from Google AI. **Zero API costs**, full tool calling, excellent Korean support, and Apple Silicon optimized.

## Requirements

| Item | Minimum | Recommended |
|------|---------|-------------|
| RAM | 24GB | 32GB+ |
| Disk | 20GB free | 30GB free |
| OS | macOS 13+ / Linux | macOS 14+ (Apple Silicon) |
| Ollama | 0.19+ | latest (MLX support for Apple Silicon) |

## Step 1: Install Ollama

### macOS

```bash
# Option A: Homebrew (recommended — auto-updates, MLX backend)
brew install --cask ollama-app

# Option B: CLI installer
curl -fsSL https://ollama.com/install.sh | sh

# Verify
ollama --version
# Requires 0.19+ (MLX backend for Apple Silicon)
```

:::tip Ollama 0.19+ and MLX
Ollama 0.19 introduced the **MLX backend** for Apple Silicon, providing native acceleration without going through Metal shaders. This significantly improves prefill speed (up to 1,851 tok/s) and enables shared prompt caching across sessions. Always use 0.19+ on Apple Silicon.
:::

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama --version
```

:::caution macOS Multi-Account Warning
Ollama stores models in `~/.ollama/models/` of the account that runs `ollama serve`. If a different account starts the server, models won't be visible and you'll get 500 errors.

```bash
# Check which account is running the server
ps aux | grep "ollama serve" | grep -v grep
```

**Solution**: Always run `ollama serve` from the same user account.
:::

## Step 2: Pull Models

```bash
# Gemma 4 26B (17GB — chat, Korean excellent)
ollama pull gemma4:26b

# bge-m3 (embedding model for semantic search, 1.2GB)
ollama pull bge-m3:latest

# Verify
ollama list
```

### Model Sizes

| Model | Disk | Memory (loaded) | Purpose |
|-------|------|-----------------|---------|
| gemma4:26b | 17GB | ~20GB | Chat, tool calling |
| bge-m3:latest | 1.2GB | ~1.3GB | Semantic search (memory_search) |
| **Total** | **~18.2GB** | **~21GB** | |

### RAM Recommendation

| RAM | Recommended Model | Notes |
|-----|-------------------|-------|
| 16GB | `gemma4` (8B, Q4) | Stable, no swapping |
| 24GB | `gemma4:26b` | Tight — system swap may occur under load. Load models sequentially. |
| 32GB+ | `gemma4:26b` | Comfortable — chat + bge-m3 simultaneously |
| 64GB+ | `gemma4:26b` FP16 | Maximum quality, no quantization loss |

:::warning 24GB Machines
On 24GB unified memory (e.g., Mac mini M4), the 26B model (~20GB loaded) leaves minimal headroom for macOS and other processes. You may experience UI lag and occasional swapping. Consider the 8B variant (`ollama pull gemma4`) for smoother daily use, or close memory-heavy apps before running the 26B model.
:::

## Step 3: Server Configuration

```bash
# Keep models loaded (prevent unloading)
export OLLAMA_KEEP_ALIVE=-1

# Start server
ollama serve

# Or launch the Ollama app (macOS)
open -a Ollama
```

### Auto-start on Boot (macOS LaunchAgent)

```xml title="~/Library/LaunchAgents/com.ollama.serve.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.ollama.serve</string>
  <key>ProgramArguments</key>
  <array>
    <string>/Applications/Ollama.app/Contents/Resources/ollama</string>
    <string>serve</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>OLLAMA_KEEP_ALIVE</key><string>-1</string>
  </dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
</dict>
</plist>
```

```bash
launchctl load ~/Library/LaunchAgents/com.ollama.serve.plist
```

### Model Preload on Boot

Even with `OLLAMA_KEEP_ALIVE=-1`, the model isn't loaded into memory until the first request after a reboot. To eliminate cold-start delay, add a preload agent:

```xml title="~/Library/LaunchAgents/com.ollama.preload.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.ollama.preload</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/curl</string>
    <string>-s</string>
    <string>-X</string>
    <string>POST</string>
    <string>http://localhost:11434/api/generate</string>
    <string>-d</string>
    <string>{"model":"gemma4:26b","prompt":"hi","stream":false}</string>
  </array>
  <key>StartInterval</key><integer>300</integer>
  <key>RunAtLoad</key><true/>
</dict>
</plist>
```

This sends a minimal request every 5 minutes, keeping the model warm in memory.

## Step 4: Verify Tool Calling

```bash
curl -s http://localhost:11434/api/chat -d '{
  "model": "gemma4:26b",
  "messages": [{"role": "user", "content": "What is 2+2? Use the calculator tool."}],
  "tools": [{
    "type": "function",
    "function": {
      "name": "calculator",
      "description": "Calculate math",
      "parameters": {
        "type": "object",
        "properties": {"expression": {"type": "string"}},
        "required": ["expression"]
      }
    }
  }],
  "stream": false
}' | python3 -m json.tool
```

Expected response:
```json
{
  "message": {
    "tool_calls": [{
      "function": {
        "name": "calculator",
        "arguments": {"expression": "2+2"}
      }
    }]
  }
}
```

## Step 5: Configure OpenClaw / SoulClaw

### Method 1: As Fallback (Recommended)

This keeps your primary cloud model and uses Gemma 4 as backup. Best for maintaining response quality while having zero-cost option:

```json title="openclaw.json"
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://127.0.0.1:11434/v1",
        "apiKey": "dummy",
        "api": "openai-completions",
        "models": [
          { "id": "gemma4:26b", "name": "gemma4-26b" }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-6",
        "fallbacks": [
          "anthropic/claude-sonnet-4-20250514",
          "ollama/gemma4:26b"
        ]
      }
    }
  },
  "memory": {
    "embedding": {
      "provider": "ollama",
      "model": "bge-m3:latest"
    }
  }
}
```

### Method 2: Primary Model (Zero API Cost)

For pure local operation without cloud APIs:

```json title="openclaw.json"
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/gemma4:26b"
      }
    }
  },
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434"
    }
  },
  "memory": {
    "embedding": {
      "provider": "ollama",
      "model": "bge-m3:latest"
    }
  }
}
```

## Step 6: Language Quality

Gemma 4 26B supports multilingual chat at high quality and **doesn't know your domain-specific context** (your products, your team, etc.). SOUL.md and memory files provide this context at runtime.

| Capability | Quality |
|-----------|---------|
| General conversation | ⭐⭐⭐⭐⭐ |
| Tool calling | ⭐⭐⭐⭐ (good, improving) |
| Korean | ⭐⭐⭐⭐⭐ (excellent) |
| Code generation | ⭐⭐⭐⭐ |
| Emotional expression | ⭐⭐⭐⭐⭐ (rich, natural) |

## Alternative: Qwen3.5

[Qwen3.5](https://ollama.com/library/qwen3.5) (35B MoE, 3B active) is lighter (6.6GB) but has significant issues:
- Thinking mode consumes tokens, causing empty responses
- Conversational response time: ~10 minutes on Mac mini M4
- Requires workarounds (`/no_think`, custom Modelfile)

We recommend Gemma 4 for most users. Use Qwen3.5 only if RAM is limited (under 24GB).

## Troubleshooting

### "model failed to load" (500 error)
1. Check if another user account is running Ollama: `ps aux | grep ollama`
2. Verify models exist for your account: `ls ~/.ollama/models/manifests/`
3. Kill the other server, restart from your account

**Real-world case**: This commonly happens when switching between multiple macOS user accounts. Ollama server was running under one account while models were installed under another.

### Out of Memory
```bash
# Check loaded models
ollama ps

# Unload unused models
ollama stop <model-name>

# Remove models
ollama rm <model-name>
```

### Models Missing After Upgrade
Major Ollama upgrades may change model format. Re-pull: `ollama pull gemma4:26b`

### OpenClaw Config Structure Issues

**Problem**: Using the wrong config structure can cause model discovery failures.

**Wrong** (old format):
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/gemma4:26b"
      }
    }
  }
}
```

**Correct** (v2026.3.32+ format):
```json
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://127.0.0.1:11434/v1",
        "apiKey": "dummy",
        "api": "openai-completions",
        "models": [
          { "id": "gemma4:26b", "name": "gemma4-26b" }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/gemma4:26b"
      }
    }
  }
}
```

### Auth Profiles for Local Models

If you get "No API key found for provider ollama" errors, create an auth profile:

```json title="~/.openclaw/agents/main/agent/auth-profiles.json"
{
  "version": 1,
  "profiles": {
    "ollama:default": {
      "type": "none",
      "provider": "ollama"
    }
  },
  "lastGood": {
    "ollama": "ollama:default"
  }
}
```

### Separate SoulClaw Profiles Not Needed

**Don't do this**: Creating separate `--profile gemma4` instances with independent configs.

**Do this**: Use the same OpenClaw instance with model switching:
```bash
# Switch to Gemma 4
# Edit ~/.openclaw/openclaw.json primary model
soulclaw gateway restart
```

This maintains session continuity and shared memory.

## Production Experience

### Performance Reality Check

Gemma 4 26B is fast enough for real-time chat on Apple Silicon:

| Use Case | Claude Opus (API) | Gemma 4 26B (Local) | Verdict |
|----------|-------------------|---------------------|---------|
| Simple questions | ~2-5s | ~5-15s | ✅ Usable |
| Tool calling | ~5-10s | ~10-20s | ✅ Good |
| Code generation | ~3-8s | ~15-45s | 🤔 Acceptable |
| Memory search | ~2-3s | ~5-10s | ✅ Good |
| Korean chat | ~2-5s | ~5-15s | ✅ Natural |

### Recommended Usage Patterns

**✅ Good for:**
- Real-time chat
- Tool calling / function execution
- Korean conversations
- 24/7 agent (always-on, zero cost)
- Cron jobs and batch processing
- Cost-sensitive environments
- Offline development

**❌ Avoid for:**
- Complex multi-step reasoning (use Opus)
- Very long code generation

### Architecture Recommendations

**Hybrid Setup** (best of both worlds):
```json
{
  "model": {
    "primary": "anthropic/claude-opus-4-6",      // Complex tasks
    "fallbacks": ["ollama/gemma4:26b"]           // Cost backup / always-on
  }
}
```

**Local-First** (for air-gapped or 24/7 environments):
- Use Gemma 4 26B as primary
- Handles most conversations naturally
- Fallback to cloud only for complex reasoning

## Benchmarks (Mac mini M4 24GB)

| Metric | Result |
|--------|--------|
| Model size | 17GB |
| First load | ~3s |
| Conversational response | ~5-15s |
| GPU utilization | 100% Apple Silicon |
| Context length | 32,768 tokens |

## Real-World: Twin Brad Architecture

We run Gemma 4 26B as "Brad" — a 24/7 local agent handling monitoring, cron jobs, and casual conversations. A separate Claude Opus instance ("Brad Pro") handles complex tasks. Both share the same Soul Spec persona via Swarm Memory.

This demonstrates Soul Spec's model portability — same personality, different engines.
