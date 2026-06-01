# Event-driven (domain events + outbox)

[← Mục lục](./README.md)

---

## Domain events

Use domain events when:

- a core use case triggers side effects across bounded contexts
- you want to decouple “do X” from “after X do Y”

Common options:

- `@nestjs/event-emitter` (simple in-process events)
- `@nestjs/cqrs` (commands/queries/events with more structure)

---

## Outbox pattern (must-deliver events)

Problem:

- Emitting events inside a DB transaction can cause “DB committed but event not delivered”.

Solution:

- Persist outbox records in the same transaction as the business write.
- A relay/worker publishes outbox events to the queue/bus and marks them delivered.

---

## Saga pattern (optional)

Use only when:

- workflows span multiple services/datastores
- you need compensating actions instead of distributed transactions
