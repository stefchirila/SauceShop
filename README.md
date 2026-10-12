# proiect-saucedemo

End-to-end test suite for [saucedemo.com](https://www.saucedemo.com), built with **Playwright** and **TypeScript**.

It covers the authentication flows (standard user, locked-out account, performance glitch user, invalid credentials), shopping cart management, and the full checkout process including form validation.

---

## Requirements

- **Node.js** 18 or newer (LTS recommended)
- **npm** (ships with Node)

Check what you have installed:

```bash
node -v
npm -v
```

## Setup

```bash
# 1. Install project dependencies
npm install

# 2. Install the browsers Playwright drives
npx playwright install chromium
```

The second step is required — Playwright downloads its own browser binaries, separate from the Chrome installed on your system. To get every browser (for when you enable Firefox/WebKit in the config), run `npx playwright install` with no argument.

No `.env` file or credentials are needed: the test accounts are public and live in `data/testAccountData.ts`.

## Commands

| Command | What it does |
|---|---|
| `npm test` | Run the whole suite (9 tests) |
| `npm run test:ui` | Open **UI mode** — interactive runner with timeline, watch mode and DOM snapshots |
| `npm run test:debug` | Step through tests with the Playwright Inspector |
| `npm run test:login` | Run the authentication tests only |
| `npm run test:cart` | Run the cart and checkout tests only |
| `npm run report` | Open the HTML report from the last run |
| `npm run codegen` | Record browser actions and generate test code |

### Targeted runs

```bash
# a single file
npx playwright test tests/login.spec.ts

# a single test, by title
npx playwright test -g "Login with locked account"

# serially, one test at a time
npx playwright test --workers=1

# with the browser visible / hidden
npx playwright test --headed
npx playwright test --headless
```

## Project structure

```
tests/                  specs (what is verified)
  login.spec.ts           authentication
  addToCart.spec.ts       cart + checkout
helpers/                reusable actions (how it is done)
  auth.ts                 login, asserting either success or an error
  products.ts             add/remove from the products page, cart badge
  cart.ts                 cart, checkout form, order placement
locators/               selectors, grouped per page
data/                   test accounts and password
utils/strings.ts        expected texts, URLs, product names
fixtures.ts             fixture that lands every test on baseURL
playwright.config.ts    configuration
```

The guiding idea: **specs describe the scenario, helpers perform the actions, locators know the selectors.** When the application UI changes you only touch `locators/`; when a flow changes you only touch `helpers/`.

Assertions use *web-first assertions* (`expect(locator).toHaveText(...)`), which are retried automatically until timeout — no `waitForTimeout`, and no comparisons against values read a single time.

## Configuration

Everything is tuned from `playwright.config.ts`:

| Option | Current value | Notes |
|---|---|---|
| `baseURL` | `https://www.saucedemo.com` | lets tests use relative URLs |
| `headless` | `false` | browser visible locally; set `true` for faster runs |
| `fullyParallel` | `false` | tests inside the same file run sequentially |
| `workers` | `1` on CI, automatic locally | set to `1` outright for zero parallelism |
| `trace` | `on-first-retry` | locally there are no retries, so no trace is saved |
| `projects` | `chromium` only | Firefox and WebKit are commented out and can be enabled |

### Reports and traces

After a run, the HTML report is generated in `playwright-report/`:

```bash
npm run report
```

To investigate a failing test step by step, set `trace: 'retain-on-failure'` in the config, then open the trace:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Continuous integration

The suite runs automatically on GitHub Actions (`.github/workflows/playwright.yml`) on every push and pull request against `main` / `master`. The HTML report is uploaded as an artifact and kept for 30 days.

## Test accounts

All of them use the password `secret_sauce`, defined in `data/testAccountData.ts`:

| Key | Username | Behaviour |
|---|---|---|
| `standard` | `standard_user` | works normally |
| `locked` | `locked_out_user` | returns a locked-out error |
| `problem` | `problem_user` | intentional UI bugs |
| `performance` | `performance_glitch_user` | slow responses |
| `error` | `error_user` | fails on certain actions |
| `visual` | `visual_user` | visual differences |
| `wrongUser` | `wrong_user` | does not exist, used for the negative test |

Usage in a test:

```ts
await login(page, 'standard');

await login(page, 'locked', {
  expectedError: Strings.lockedUserError,
});
```

When `expectedError` is omitted, the helper itself verifies that login succeeded and that the inventory page was reached.
