---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ['read', 'execute', 'todo']
---

Analyze the current changes, create or switch to the user-provided feature branch, commit the changes with a conventional commit message, and push that branch.

Branch name: ${input:branch-name:Required feature branch name}

## Instructions

1. If no branch name was provided, ask the user for it and stop until one is supplied.
2. Check whether the current step includes required UI workflow. If it does, run `npm run test:ui` from the repository root, or require a successful `/run-ui-tests` result in the current chat before committing.
3. Analyze the workspace with `git status` and `git diff`.
4. Generate a concise, descriptive commit message using the conventional commit format from the project Git Workflow, such as `feat:`, `fix:`, `chore:`, or `docs:`.
5. Create the specified branch if it does not exist with `git checkout -b <branch-name>`. If it exists, switch to it with `git checkout <branch-name>`.
6. Stage all changes with `git add .`.
7. Commit using the generated conventional commit message.
8. Push to the specified branch with `git push origin <branch-name>`.

## Branch Safety

Use only the user-provided branch name. Never commit to `main` or any other branch. Report the final branch, commit message, validation performed, and push result.
