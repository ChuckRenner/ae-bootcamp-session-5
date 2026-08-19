---
description: "Run UI tests and summarize failures"
agent: test-engineer
tools: ['read', 'execute', 'todo']
---

Run the project's Playwright UI tests and summarize the outcomes and likely causes of any failures.

## Required Setup

1. Before running `/run-ui-tests`, run exactly the project installation command:

   `npm run test:ui:install --workspace=frontend`

2. In Ubuntu or other Linux environments, this installation is mandatory and must perform `playwright install --with-deps chromium` before tests run. Repeat it after a container rebuild.
3. The install script includes bounded automatic Ubuntu repository remediation for the common Yarn key issue and one retry. Do not perform ad-hoc package hunting or broad operating-system troubleshooting beyond that automated remediation.
4. If installation still fails, stop immediately. Report an environment blocker with the failing command and key error lines. Do not run Playwright tests after a failed dependency install.

## Test Execution

1. Ensure both backend and frontend are running. From the repository root, start them with `npm start` if needed.
2. Run the UI suite with the project command: `npm run test:ui`.
3. Summarize total tests, passed tests, failed tests, skipped tests, and relevant artifacts such as traces or screenshots.
4. For every failure, classify the likely root cause as application code, test code, or environment, and explain the evidence.
5. Report any missing critical journey coverage discovered during the run.

Do not hide failures by broadening timeouts, skipping tests, or changing assertions without evidence. Stop and report clearly when setup or execution is blocked.
