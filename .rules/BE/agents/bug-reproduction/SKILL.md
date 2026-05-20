---
name: be-bug-reproduction-agent
description: Structured bug reproduction for BE APIs — repro_bundle required, ranked hypotheses. Extended agent.
disable-model-invocation: true
---

# Bug Reproduction Agent (extended)

Produce **structured repro** and ranked hypotheses — do not fix.

## Input

- Module manifest (inline or path)
- User report: expected vs actual

## Required output — repro_bundle

[../\_shared/output-contract.md](../_shared/output-contract.md) requires:

```markdown
### repro_bundle

- expected:
- actual:
- request: { method, path, headers_redacted, body_redacted }
- response: { status, body_redacted }
- stack_trace: <path or INSUFFICIENT_CONTEXT>
- suspected_layer: controller | service | domain | prisma | dto | common
```

## Procedure

1. Locate HTTP entry from manifest `controllers`
2. Trace call chain to service (evidence lines)
3. Identify DTO validation vs service vs DB failure modes
4. Rank hypotheses with % (only this agent uses ranked hypotheses)

## next_agents

From `suspected_layer`:

- controller → `controller`
- service → `service`
- domain → `domain`
- prisma → `prisma`
- dto → `dto`
- common → `common`

## Forbidden

- Implementing fixes
- Guessing request bodies without user input — use `INSUFFICIENT_CONTEXT`
