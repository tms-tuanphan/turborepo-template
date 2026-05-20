---
name: be-testing-factory-aaa
description: NestJS unit/e2e tests with AAA sections and factories. Use when writing or reviewing specs in apps/api.
---

# Testing — factory + AAA

> Full doc: [docs/06-testing.md](../../docs/06-testing.md)

## Factory template

```typescript
export class LinkFactory {
  static create(overrides?: Partial<LinkEntity>): LinkEntity {
    return { id: 1, url: 'https://example.com', ...overrides };
  }
  static createMany(count: number, overrides?: Partial<LinkEntity>) {
    return Array.from({ length: count }, (_, i) =>
      this.create({ id: i + 1, ...overrides }),
    );
  }
}
```

## Test template

```typescript
it('should return link when valid id is provided', async () => {
  // Arrange
  const link = LinkFactory.create();
  mockService.findOne.mockResolvedValue(link);

  // Act
  const result = await controller.findOne('1');

  // Assert
  expect(result).toEqual(link);
});
```

## Rule & agent

- [be-testing.mdc](../../rules/be-testing.mdc)
- Agent: [test](../../agents/test/SKILL.md) (extended)
