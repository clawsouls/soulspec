---
sidebar_position: 11
title: Ollama + Qwen3.5
description: Run a local LLM with Soul Spec using Ollama and Qwen3.5 — zero cost, full tool calling support.
---

# Ollama + Qwen3.5 Setup Guide

Run your Soul Spec agent locally with **zero API costs** using Ollama and Qwen3.5.

| Spec | Value |
|------|-------|
| Model | Qwen3.5 (35B params, 3B active MoE) |
| Disk | 6.6 GB |
| RAM | ~10 GB (runtime) |
| License | Apache 2.0 |
| Tool Calling | ✅ Full support |

## Requirements

| Item | Minimum | Recommended |
|------|---------|-------------|
| RAM | 16 GB | 32 GB |
| Disk | 10 GB free | 20 GB free |
| OS | macOS 13+ / Linux | macOS 14+ (Apple Silicon) |
| Ollama | 0.20.0+ | 0.20.2+ |

## Step 1: Install Ollama

### macOS
```bash
# Download from https://ollama.com/download/mac
# Or via CLI:
curl -fsSL https://ollama.com/install.sh | sh
```

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Verify:
```bash
ollama --version
# Should be 0.20.0+
```

## Step 2: Pull Models

```bash
# Main model — chat & tool calling
ollama pull qwen3.5:latest

# Embedding model — semantic memory search
ollama pull bge-m3:latest
```

### Model Sizes

| Model | Disk | Runtime Memory | Purpose |
|-------|------|---------------|---------|
| qwen3.5:latest | 6.6 GB | ~9.7 GB | Chat, tool calling |
| bge-m3:latest | 1.2 GB | ~1.3 GB | Semantic search (memory_search) |
| **Total** | **7.8 GB** | **~11 GB** | |

## Step 3: Verify Tool Calling

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
        "properties": {
          "expression": {"type": "string"}
        },
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

## Step 4: Configure OpenClaw / SoulClaw

Add to your `openclaw.json` or `soulclaw.json`:

```json
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

## ⚠️ Thinking Mode Warning (Important)

Qwen3.5 has **thinking mode enabled by default**. This causes a critical issue:

### The Problem

All generated tokens are consumed by internal "thinking", leaving `content` as an empty string:

```json
// API response — content is empty!
{
  "message": {
    "content": "",
    "thinking": "Thinking Process:\n\n1. Analyze the Request..."
  }
}
```

Via CLI:
```bash
$ echo "Hello" | ollama run qwen3.5:latest
Thinking...
# (no response, just exits)
```

### Solution 1: `/no_think` directive

Add `/no_think` to your system prompt:

```json
{
  "messages": [
    {"role": "system", "content": "You are an assistant. /no_think"},
    {"role": "user", "content": "Hello"}
  ]
}
```

### Solution 2: Increase `num_predict`

Set `num_predict` to 1000+ so there are tokens left after thinking:

```json
{
  "options": {"num_predict": 2000}
}
```

### Solution 3: Custom Modelfile (disable thinking)

```bash
cat > Modelfile.no-think << 'EOF'
FROM qwen3.5:latest
PARAMETER num_predict 2000
TEMPLATE """{{- if .System }}<|im_start|>system
{{ .System }}<|im_end|>
{{ end }}<|im_start|>user
{{ .Prompt }}<|im_end|>
<|im_start|>assistant
"""
EOF

ollama create qwen3.5-no-think -f Modelfile.no-think
```

### Impact by Use Case

| Use Case | Affected? | Notes |
|----------|-----------|-------|
| Tool calling | ✅ No | `tool_calls` are separate from `content` |
| Chat responses | ❌ **Yes** | Empty content — apply fix above |
| Code generation | ❌ **Yes** | Empty content — apply fix above |
| Embedding (bge-m3) | ✅ No | Different model, no thinking |

:::tip
**If you only use Qwen3.5 for tool calling** (e.g., as a local task executor), the thinking mode issue doesn't apply. It only matters for direct chat/code generation.
:::

## Auto-Start on Boot (macOS)

Create a LaunchAgent:

```bash
cat > ~/Library/LaunchAgents/com.ollama.serve.plist << 'EOF'
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
EOF

launchctl load ~/Library/LaunchAgents/com.ollama.serve.plist
```

## Troubleshooting

### "model failed to load" (500 error)
1. Check if another user account is running Ollama: `ps aux | grep ollama`
2. Ollama stores models per-user in `~/.ollama/models/`
3. Kill the other instance and restart from your account

### Out of memory
```bash
# Check loaded models
ollama ps

# Unload unused models
ollama stop <model-name>
```

### Empty responses
See [Thinking Mode Warning](#️-thinking-mode-warning-important) above.

## Benchmarks (Mac mini M4 32GB)

| Metric | Result |
|--------|--------|
| First load | ~1.6s |
| Tool calling response | ~4.5s |
| GPU utilization | 100% Apple Silicon |
| Context length | 32,768 tokens |
| Concurrent models | qwen3.5 + bge-m3 (11 GB / 32 GB) |

## Gemma 4 Alternative

[Gemma 4](https://ai.google.dev/gemma) (26B, 4B active) is also Apache 2.0 licensed, but currently has tool calling issues. We recommend Qwen3.5 first, Gemma 4 later once stabilized.

```bash
# Future: when Gemma 4 tool calling is fixed
ollama pull gemma4:26b  # 18 GB — requires 32 GB RAM
```
