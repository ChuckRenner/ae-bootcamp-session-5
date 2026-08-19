---
description: "Execute instructions from the current GitHub Issue step"
agent: tdd-developer
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

Execute the current GitHub Issue step using the project's TDD workflow.

Issue number: ${input:issue-number:Optional GitHub Issue number}

## Instructions

1. If an issue number was provided, use it. Otherwise, use the Workflow Utilities from `.github/copilot-instructions.md` and `gh` CLI to find the main exercise issue whose title contains `Exercise:`.
2. Get the issue content and comments with `gh issue view <issue-number> --comments`.
3. Parse the latest applicable step instructions from the issue, including its `:keyboard: Activity:` sections.
4. Execute each activity systematically using the `tdd-developer` workflow and the testing scope in the project instructions.
5. For new behavior, write tests first, verify the RED phase, implement the minimum code, verify GREEN, and refactor only while tests remain green.

## Scope Boundary

Do not create or run Playwright UI tests in this prompt. For required Playwright work, stop the UI portion and hand it off in this order:

1. `/create-ui-tests`
2. `/run-ui-tests`

These prompts automatically switch to the `test-engineer` agent. Do not commit or push changes; that is the responsibility of `/commit-and-push`.

## Completion Handoff

After completing the activities, report what changed, tests run, and any blockers. Then provide the next commands in exactly the applicable order:

- If the current step requires UI workflow: `/create-ui-tests` -> `/run-ui-tests` -> `/validate-step {step-number}`
- If UI workflow is not required: `/validate-step {step-number}`

Never recommend `/validate-step` before required UI prompts have completed. Do not create or run Playwright tests here, and follow all testing scope constraints from the project instructions.
