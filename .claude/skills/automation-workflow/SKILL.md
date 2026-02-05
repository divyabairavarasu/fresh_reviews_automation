---
name: automation-workflow
description: Run end-to-end Jira ticket creation/update and Playwright automation workflow with minimal output when user says "run automation workflow".
---

# Automation Workflow

## When to use
Use this skill when the user says the trigger phrase `run automation workflow` or asks to run the full Jira + Playwright + commit pipeline in one go.

## Inputs (ask only if missing)
- Target URL to automate (always ask for this when the trigger phrase is used)
- Repo path (default to current `cwd` if it looks like the repo)
- Jira project key (if not in `.env` or inferred)
- Jira issue type (default: `Task`)
- Jira summary (default: `Automate E2E Testing for <page>`)
- Git branch name (default: `automation/<short-page>`)
- Commit message (default: `Add Playwright automation for <page>`)
- User email for test report (if not in `.env` as `USER_EMAIL`)

## Defaults
- Read Jira creds from `.env`: `JIRA_URL`, `JIRA_API_TOKEN`, `JIRA_EMAIL`, `JIRA_TICKET`.
- Read email config from `.env`: `USER_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
- If `JIRA_TICKET` exists, update that issue; otherwise create a new issue.
- Push to remote if `git remote` is configured.
- Run tests after code generation (can be skipped if user requests).
- Keep output terse: only key actions, issue key, commit hash, PR URL, and test summary.

## Workflow (single pass)
1. Read `.env` (if present) for Jira creds and defaults.
2. Generate or update `JIRA_TICKET.md` from the URL and stated scope (keep concise).
3. Create or update the Jira issue via API:
   - Update if `JIRA_TICKET` exists.
   - Create if missing; store returned key and use it in code/comments.
4. Generate Playwright tests and any page objects under repo (TypeScript).
5. Update references to Jira key in repo files (if required and safe).
6. Commit changes locally with the provided message.
7. Push changes to remote repository (if git remote is configured).
8. Create Pull Request using `gh pr create`:
   - Title: Jira summary
   - Body: Link to Jira ticket, acceptance criteria summary, test coverage details.
9. Run Playwright tests:
   - Execute `npm test` or `npx playwright test` for the new test suite.
   - Generate HTML report and Allure report (if configured).
   - Capture test results, pass/fail counts, execution time.
10. Email test report to user:
    - Compose email with test summary (pass/fail stats, execution time, coverage).
    - Attach or link to HTML test report.
    - Include PR link and Jira ticket link.
    - Send via configured email service (SMTP or API).
11. Summarize: Jira issue key + commit hash + PR URL + test results.

## Output style
- Be brief.
- Avoid long explanations.
- Ask only blocking questions.
