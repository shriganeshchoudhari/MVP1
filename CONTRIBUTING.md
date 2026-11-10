# Enterprise Test Automation Engineering Standards & Guidelines

This document outlines the architectural principles, coding standards, and quality gates required for contributing to this Playwright test automation framework.

---

## 1. Core Principles
1. **Maintainability over Unnecessary Complexity:** Keep abstractions purposeful and self-explanatory.
2. **Deterministic Execution:** Eliminating flaky tests is prioritized over raw speed. No arbitrary `page.waitForTimeout()` sleeps are allowed.
3. **Strict Type Safety:** All code must be written in TypeScript with strict null checks and appropriate interface typings.
4. **Test Isolation:** Every test must run independently and must not rely on the side-effects of prior tests.
5. **No Production Secrets:** Pass credentials via environment variables or CI/CD secret vaults.

---

## 2. Locator Hierarchy
Always locate elements in this order of priority:
1. `page.getByRole(...)` (semantic accessibility roles)
2. `page.getByLabel(...)` (form inputs with explicit labels)
3. `page.getByPlaceholder(...)` (inputs with placeholder hints)
4. `page.getByText(...)` (static text / buttons)
5. `page.getByTestId(...)` (dedicated data-testid anchors)
6. Scoped CSS locator when DOM structure is complex and un-anchored
7. **AVOID:** Fragile XPath, index-based nth-child cascades, and volatile auto-generated IDs (`#mat-radio-3`).

---

## 3. Pull Request Quality Gate Checklist
Before submitting a Pull Request:
- [ ] Code compiles without errors: `npm run type-check`
- [ ] Code passes linting: `npm run lint`
- [ ] Tests execute successfully locally: `npm test`
- [ ] No hardcoded sleep calls (`waitForTimeout`) exist.
- [ ] Page Objects follow single responsibility.
- [ ] Added assertions are web-first (`await expect(...)`).
- [ ] Test runs are clean and do not leave orphaned test artifacts.
