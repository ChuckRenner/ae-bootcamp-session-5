# Patterns Discovered

Record reusable implementation patterns and project conventions here. Add a new entry when a discovery is likely to help with more than one task.

## Pattern Template

### <Pattern Name>

**Context:** <Where or when this pattern applies>

**Problem:** <Problem the pattern addresses>

**Solution:** <Recommended approach>

**Example:**

```js
// Add a concise, repository-relevant example here.
```

**Related files:**

- `<path/to/file>`

## Service Initialization: Empty Array vs Null

**Context:** Services that manage a collection of TODO records in memory.

**Problem:** An uninitialized or `null` collection forces every consumer to handle a special state and can cause collection operations to fail during the first request.

**Solution:** Initialize the collection to an empty array when the service is created. An empty collection accurately represents a valid service with no records and supports normal array operations immediately.

**Example:**

```js
class TodoService {
  constructor() {
    this.todos = [];
  }
}
```

**Related files:**

- `packages/backend/src/app.js`
- `packages/backend/__tests__/app.test.js`
