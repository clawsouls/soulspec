---
sidebar_position: 8
title: Local LLM with Qwen3.5
description: Run Soul Spec agents locally with Ollama and Qwen3.5 — zero server cost, full tool calling support.
---

# Local LLM with Qwen3.5

Run your Soul Spec agent locally using [Ollama](https://ollama.com/) and Qwen3.5 — a 35B parameter MoE model with only 3B active parameters. **Zero API costs**, full tool calling, and Apple Silicon optimized.

## Requirements

| Item | Minimum | Recommended |
|------|---------|-------------|
| RAM | 16GB | 32GB |
| Disk | 10GB free | 20GB free |
| OS | macOS 13+ / Linux | macOS 14+ (Apple Silicon) |
| Ollama | 0.20.0+ | 0.20.2+ |

## Step 1: Install Ollama

### macOS

```bash
# Download from https://ollama.com/download/mac
# Or install via CLI:
curl -fsSL https://ollama.com/install.sh | sh

# Verify
ollama --version
# Requires 0.20.0+
```

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
# Qwen3.5 (35B params, 3B active MoE, 6.6GB)
ollama pull qwen3.5:latest

# bge-m3 (embedding model for semantic search, 1.2GB)
ollama pull bge-m3:latest

# Verify
ollama list
```

### Model Sizes

| Model | Disk | Memory (loaded) | Purpose |
|-------|------|-----------------|---------|
| qwen3.5:latest | 6.6GB | ~9.7GB | Chat, tool calling |
| bge-m3:latest | 1.2GB | ~1.3GB | Semantic search (memory_search) |
| **Total** | **7.8GB** | **~11GB** | |

Runs comfortably on 32GB. Possible on 16GB but may swap under load.

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

## Step 4: Verify Tool Calling

```bash
curl -s http://localhost:11434/api/chat -d '{
  "model": "qwen3.5:latest",
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

```json title="openclaw.json"
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/qwen3.5:latest"
      }
    }
  },
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434",
      "defaultOptions": {
        "num_predict": 2000
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

:::info Why `num_predict: 2000`?
See the [Thinking Mode](#thinking-mode-caveat) section below. Without this, Qwen3.5 may consume all tokens on internal reasoning and return empty responses.
:::

## Step 6: Language Quality

Qwen3.5 supports multilingual chat but **doesn't know your domain-specific context** (your products, your team, etc.). SOUL.md and memory files provide this context at runtime.

| Capability | Quality |
|-----------|---------|
| General conversation | ⭐⭐⭐⭐ |
| Tool calling | ⭐⭐⭐⭐⭐ (excellent) |
| Code generation | ⭐⭐⭐⭐ |
| Domain knowledge | ⭐⭐ (supplement via SOUL.md) |
| Thinking / reasoning | ⭐⭐⭐⭐ |
| Korean | ⭐⭐⭐⭐ |
| Japanese / Chinese | ⭐⭐⭐⭐ |

## Thinking Mode Caveat {#thinking-mode-caveat}

:::danger Important: Empty Responses
Qwen3.5 has **thinking mode enabled by default**. This can cause:

1. All output tokens consumed by internal reasoning
2. `content` field returns empty string (`""`)
3. CLI shows `Thinking...` with no actual answer
:::

### Symptoms

```json
// API response — content is empty!
{
  "message": {
    "content": "",
    "thinking": "Thinking Process:\n\n1. **Analyze the Request:**\n..."
  }
}
```

### Solutions

**Option 1: Add `/no_think` to system prompt**
```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant. /no_think"},
    {"role": "user", "content": "Your question here"}
  ]
}
```

**Option 2: Increase `num_predict`** (recommended: 2000+)
```json
{
  "options": {"num_predict": 2000}
}
```

**Option 3: Custom Modelfile with thinking disabled**
```bash title="Modelfile.no-think"
FROM qwen3.5:latest
PARAMETER num_predict 2000
TEMPLATE """{{- if .System }}<|im_start|>system
{{ .System }}<|im_end|>
{{ end }}<|im_start|>user
{{ .Prompt }}<|im_end|>
<|im_start|>assistant
"""
```

```bash
ollama create qwen3.5-no-think -f Modelfile.no-think
```

### Impact Matrix

| Use Case | Affected? |
|----------|-----------|
| Tool calling | ✅ No — tool_calls are separate from content |
| Chat responses | ❌ **Empty content** — apply fix above |
| Code generation | ❌ **Empty content** — apply fix above |
| Embeddings (bge-m3) | ✅ Not affected |

## Alternative: Gemma 4

[Gemma 4](https://ai.google.dev/gemma) (26B, 4B active) is also Apache 2.0 licensed, but currently has reported issues with tool calling. We recommend Qwen3.5 first, with Gemma 4 as a future option once tool calling stabilizes.

```bash
# Future — after tool calling is stable
ollama pull gemma4:26b  # 18GB — requires 32GB RAM
```

## Troubleshooting

### "model failed to load" (500 error)
1. Check if another user account is running Ollama: `ps aux | grep ollama`
2. Verify models exist for your account: `ls ~/.ollama/models/manifests/`
3. Kill the other server, restart from your account

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
Major Ollama upgrades may change model format. Re-pull: `ollama pull qwen3.5:latest`

## Benchmarks (Mac mini M4 32GB)

| Metric | Result |
|--------|--------|
| First load | ~1.6s |
| Tool calling response | ~4.5s (first call) |
| GPU utilization | 100% Apple Silicon |
| Context length | 32,768 tokens |
| Concurrent models | qwen3.5 + bge-m3 (11GB / 32GB) |
