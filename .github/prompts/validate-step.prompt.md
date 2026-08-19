---
description: "Validate that all success criteria for the current step are met"
agent: code-reviewer
tools: ['search', 'read', 'execute', 'web', 'todo']
---

Validate the current workspace against every success criterion for the requested exercise step.

Step number: ${input:step-number:Required step number, for example 5-0 or 5-1}

## Instructions

1. The step number is required. If it is missing, ask the user for it and stop.
2. Use the Workflow Utilities from `.github/copilot-instructions.md` and `gh issue list --state open` to find the main exercise issue whose title contains `Exercise:`.
3. Get the issue and comments with `gh issue view <issue-number> --comments`.
4. Search the issue content for `# Step {step-number}:`.
5. Extract the `Success Criteria` section for that step.
6. Check every criterion against the current workspace state, source files, tests, configuration, and relevant command results.
7. Report each criterion as complete or incomplete with specific evidence and concrete guidance for any missing work.

Do not infer completion from a file name alone. Run focused validation where needed, distinguish implementation, test, and environment issues, and summarize remaining risks clearly.
