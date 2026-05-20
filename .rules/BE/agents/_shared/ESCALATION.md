# Escalation taxonomy (BE)

Coordinator tags plans and findings with escalation classes. Agents may suggest escalation in `findings`; only the Coordinator triggers human checkpoints.

## Classes

| Class           | Meaning                                  | Agent response                            | Human required            |
| --------------- | ---------------------------------------- | ----------------------------------------- | ------------------------- |
| `BREAKING_API`  | DTO/route/response contract change       | reviewer + document breaking change       | Yes — API consumers       |
| `DB_MIGRATION`  | Prisma schema, migrate, seed             | prisma agent analysis only; never migrate | Yes — run migrate locally |
| `AUTH_BOUNDARY` | Guards, JWT, session, roles              | architecture + reviewer                   | Yes — security review     |
| `SECURITY_RISK` | Secrets exposure, injection, auth bypass | BLOCK in reviewer; stop implementation    | Yes — immediate           |
| `PROD_CONFIG`   | Env, observability, deploy, hardening    | production agent (readonly)               | Yes — deploy owner        |

## Coordinator rules

1. Large plans MUST include `escalation: []` or list active classes.
2. `DB_MIGRATION`: never spawn quality-gates to run migrate; document steps for human.
3. `SECURITY_RISK`: do not mark task complete until user acknowledges.
4. `PROD_CONFIG`: spawn `production` with `readonly: true` only; no config file writes by agents.
5. `BREAKING_API`: ensure `dto` + `reviewer` ran before merge.

## Production agent

Spawn `production` only when:

- User asks for deploy/hardening/observability review, or
- `PROD_CONFIG` is active, or
- `performance` recommends `recommendation_owner: production`

Always `readonly: true` on Task tool.
