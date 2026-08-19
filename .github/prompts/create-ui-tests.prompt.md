---
description: "Create UI tests for required critical user journeys"
agent: test-engineer
tools: ['search', 'read', 'edit', 'execute', 'todo']
---

Create or update Playwright tests for the requested critical user journeys.

Journeys: ${input:journeys:Optional journeys; defaults to create, edit, toggle, delete, and core error-state handling}

## Instructions

1. If journeys are not provided, use the default set: create, edit, toggle, delete, and core error-state handling.
2. Select the highest-risk scenarios and keep the total authored Playwright test cases between 3 and 5 when possible.
3. Hard limit: create or update a maximum of 5 Playwright test cases in this run. Include at least 1 error-path test within the 3-5 total.
4. If more than 5 candidate scenarios exist, choose the highest-risk 5 and list deferred scenarios instead of creating more tests.
5. Generate or update tests using the project's Playwright framework and existing configuration.
6. Prefer accessibility-first selectors, stable `data-testid` selectors when necessary, and state-based waits. Avoid brittle CSS selectors and arbitrary timeouts.
7. Apply Page Object Model practices: put reusable interactions and selectors in page object classes or helpers, and keep test files focused on scenario intent and assertions.
8. Keep each test deterministic, isolated, readable, and free of shared mutable state.
9. Before finishing, count the created or updated Playwright test cases by inspecting `test(...)` and `it(...)` declarations. Reduce the authored count to 5 or fewer if it exceeds the limit.
10. Do not claim a small scope if the final authored count is greater than 5.

Report the files changed, exact scenarios covered, error-path coverage, deferred scenarios, and the final Playwright test-case count.
