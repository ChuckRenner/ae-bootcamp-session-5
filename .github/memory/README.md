# Development Memory System

This directory stores working knowledge discovered while developing the TODO application. It helps future sessions recognize useful patterns, understand past decisions, and avoid repeating the same debugging work.

## Two Types of Memory

### Persistent Memory

`.github/copilot-instructions.md` contains the project's foundational principles, workflows, testing expectations, and agent boundaries. It is always-on guidance that applies to development across the repository.

### Working Memory

`.github/memory/` contains discoveries made during development:

```text
.github/memory/
├── README.md
├── session-notes.md
├── patterns-discovered.md
└── scratch/
    ├── .gitignore
    └── working-notes.md
```

- `session-notes.md` contains completed session summaries. It is a committed historical record.
- `patterns-discovered.md` contains reusable code patterns, decisions, and accumulated learnings. It is committed so future work can build on it.
- `scratch/working-notes.md` contains notes for the active session. Scratch contents are ignored and are not committed.

## When to Use Each File

### During TDD

Record the behavior under investigation, the failing test, hypotheses, and the final implementation decision in `scratch/working-notes.md`. When a solution reveals a reusable testing or design pattern, add it to `patterns-discovered.md` after the test is passing.

### During Linting

Use the scratch notes to capture recurring lint failures, their causes, and the changes that resolved them. Promote a recurring rule or project convention to `patterns-discovered.md` so it can guide later changes.

### During Debugging

Write down reproduction steps, observations, attempted fixes, and confirmed causes in the scratch file. This prevents circular investigation during the active session and makes the useful conclusions easy to summarize when the issue is resolved.

## Session Lifecycle

1. Start by reading this README, the relevant persistent instructions, and existing patterns or session summaries.
2. During active work, update `scratch/working-notes.md` as findings and decisions emerge.
3. At the end of the session, summarize completed work, important findings, decisions, and outcomes in `session-notes.md`.
4. Add broadly reusable discoveries to `patterns-discovered.md`.
5. Leave scratch notes ephemeral. They are intentionally ignored and do not belong in a commit.

Session summaries are for completed work, not a running journal. Patterns are for knowledge that applies beyond one task. Scratch notes are for incomplete, changing, or exploratory work.

## How AI Uses the Memory

Before making context-aware suggestions, AI should read the persistent instructions and then consult the relevant files in `.github/memory/`. Existing patterns should influence implementation and testing choices. Session summaries provide historical context, while scratch notes describe the current task when available.

AI should update working notes while investigating, record confirmed reusable patterns, and preserve important completed-session knowledge in committed summaries. Memory is supporting context: current source code, tests, and direct evidence take precedence when they disagree with an old note.

## Commit Boundaries

Commit `session-notes.md` and `patterns-discovered.md` when they contain useful historical or reusable knowledge. Do not commit files inside `scratch/`; its `.gitignore` intentionally ignores all active-session notes.
